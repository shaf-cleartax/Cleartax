#!/usr/bin/env python3
"""UTM Link Helper — attach per-copy UTM-tagged link annotations to a PDF's CTA button.

Subcommands:
  inspect      List existing link annotations in a PDF (page + rect + URI).
  find-button  Locate a CTA button's clickable rect on a page (text search + filled-rect detection + optional PNG preview).
  apply        Create one output PDF per UTM link, each with that link laid over the same button rect. Verifies after writing.
"""
import argparse
import json
import os

import fitz  # PyMuPDF


def cmd_inspect(args):
    doc = fitz.open(args.pdf)
    print(f"pages: {len(doc)}")
    found_any = False
    for pno, page in enumerate(doc):
        links = page.get_links()
        if links:
            found_any = True
            print(f"--- page {pno} ---")
            for l in links:
                print(f"  rect={l.get('from')} uri={l.get('uri')}")
    if not found_any:
        print("No existing link annotations found in this PDF.")


def cmd_find_button(args):
    doc = fitz.open(args.pdf)
    page = doc[args.page]

    if args.text:
        rects = page.search_for(args.text)
        print("text matches:", rects)

    y0, y1 = args.y_range
    print(f"filled rects on page {args.page} with y0 in [{y0}, {y1}]:")
    for d in page.get_drawings():
        r = d["rect"]
        if d.get("type") == "f" and y0 <= r.y0 <= y1:
            print(f"  {r}  fill={d.get('fill')}")

    if args.preview:
        clip = fitz.Rect(0, max(0, y0 - 50), page.rect.width, y1 + 50)
        pix = page.get_pixmap(clip=clip, dpi=150)
        pix.save(args.preview)
        print("preview saved to", args.preview)


def cmd_apply(args):
    with open(args.links_json) as f:
        versions = json.load(f)  # [{"label": "...", "url": "..."}, ...]

    os.makedirs(args.outdir, exist_ok=True)
    rect = fitz.Rect(*args.rect)
    base_name = os.path.splitext(os.path.basename(args.pdf))[0]

    created = []
    for v in versions:
        doc = fitz.open(args.pdf)
        page = doc[args.page]
        page.insert_link({"kind": fitz.LINK_URI, "from": rect, "uri": v["url"]})
        out_path = os.path.join(args.outdir, f"{base_name} ({v['label']}).pdf")
        doc.save(out_path)
        doc.close()
        created.append(out_path)
        print("saved:", out_path)

    print("\nVerification:")
    for path in created:
        doc = fitz.open(path)
        page = doc[args.page]
        links = page.get_links()
        status = "OK" if len(links) == 1 else f"WARNING: {len(links)} links found"
        print(f"  {os.path.basename(path)}: {status}")
        for l in links:
            print(f"    rect={l['from']} uri={l['uri']}")


def main():
    parser = argparse.ArgumentParser(description="UTM Link Helper for PDF CTA buttons")
    sub = parser.add_subparsers(dest="command", required=True)

    p_inspect = sub.add_parser("inspect", help="List existing link annotations in a PDF")
    p_inspect.add_argument("pdf")
    p_inspect.set_defaults(func=cmd_inspect)

    p_find = sub.add_parser("find-button", help="Locate a CTA button's rect on a page")
    p_find.add_argument("pdf")
    p_find.add_argument("--page", type=int, required=True, help="0-indexed page number")
    p_find.add_argument("--text", help="CTA text to search for on the page")
    p_find.add_argument("--y-range", type=float, nargs=2, default=[0, 10000])
    p_find.add_argument("--preview", help="Path to save a cropped PNG preview")
    p_find.set_defaults(func=cmd_find_button)

    p_apply = sub.add_parser("apply", help="Create one PDF copy per UTM link")
    p_apply.add_argument("pdf")
    p_apply.add_argument("--page", type=int, required=True, help="0-indexed page number")
    p_apply.add_argument("--rect", type=float, nargs=4, required=True, metavar=("X0", "Y0", "X1", "Y1"))
    p_apply.add_argument("--links-json", required=True, help='JSON file: [{"label": "...", "url": "..."}, ...]')
    p_apply.add_argument("--outdir", required=True)
    p_apply.set_defaults(func=cmd_apply)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
