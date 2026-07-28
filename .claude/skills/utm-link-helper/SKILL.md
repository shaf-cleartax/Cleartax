---
name: utm-link-helper
description: Attach UTM-tagged tracking links to a PDF's CTA button without touching visible design. Given a source PDF and a set of UTM links, produces one copy per link (invisible clickable link annotation over the button, no rasterization/re-export). Use whenever asked to "add UTM links", "tag the CTA", "attach tracking links", or generate per-channel/per-campaign versions of a PDF asset.
---

# UTM Link Helper

## Overview

Marketing PDFs (one-pagers, playbooks, case studies) usually ship with a CTA button that has no real hyperlink baked in — it's just text drawn on a colored pill shape. This skill adds a real clickable link annotation over that button, one output file per UTM-tagged URL, so each channel/campaign gets its own trackable copy. The PDF's visible content is never modified — only an invisible link annotation is layered on top, so every copy still looks pixel-identical to the source.

Reference build: `Asset/Output/ClearTax e-Invoicing Vendor Evaluation Framework/` — 3 copies of the Vendor Evaluation Framework PDF, each with one of three UTM links on the same CTA button rect (page 12, "Get Your Country-Specific Exposure Assessment" pill).

## Requirements: PyMuPDF (`fitz`)

Check first: `python3 -c "import fitz"`. If that fails, create a persistent venv **inside this skill folder** (so it's reused across future runs instead of reinstalling every time):

```bash
python3 -m venv "/Users/mohammed.shafin/Documents/Cleartax/.claude/skills/utm-link-helper/.venv"
"/Users/mohammed.shafin/Documents/Cleartax/.claude/skills/utm-link-helper/.venv/bin/pip" install --quiet pymupdf
```

Then always invoke the script via that venv's python:
```
"/Users/mohammed.shafin/Documents/Cleartax/.claude/skills/utm-link-helper/.venv/bin/python3" \
  "/Users/mohammed.shafin/Documents/Cleartax/.claude/skills/utm-link-helper/scripts/utm_links.py" <command> ...
```

## Workflow

1. **Resolve the source PDF.** The user will tag it (e.g. `@Asset/Output/<name>.pdf`). Confirm it exists.

2. **Check for an existing link first.**
   ```
   utm_links.py inspect "<source.pdf>"
   ```
   If the CTA button already has a `LINK_URI` annotation, reuse its exact page + rect for step 4 instead of re-detecting.

3. **If there's no existing link, locate the CTA button's rect.** CTA buttons are almost always on the last page. Find the button text, then the filled pill shape it sits on:
   ```
   utm_links.py find-button "<source.pdf>" --page <N> --text "<CTA phrase>" --y-range <y0> <y1> --preview /path/to/preview.png
   ```
   - Use `get_text` (or just read the earlier `inspect`/manual `page.get_text()` output) to find the CTA phrase and its approximate y-position first, so `--y-range` is narrow.
   - Among the filled rects returned, pick the one that visually forms the button pill (usually the widest, on-brand-color rect enclosing the text) — a black/white fill pair drawn back-to-back is normal (border + fill), take the outer one.
   - **Always render the `--preview` PNG and view it with Read** before trusting the rect — confirm it's the actual button, not a section divider or background panel.

4. **Build the links JSON.** One `{"label": ..., "url": ...}` per UTM link the user gave you. Derive `label` from the `utm_source`/`utm_medium` (e.g. `linkedin_paid` → `UTM 1 - LinkedIn Paid`) unless the user specifies labels. Write it to a scratch file (job tmp dir, not the project).

5. **Create the output folder** at `Asset/Output/<Asset Name>/` (matching the source PDF's base name, no extension) if it doesn't already exist — this is where "each version with different UTM links" goes, one file per link, named `<Asset Name> (<label>).pdf`.

6. **Apply:**
   ```
   utm_links.py apply "<source.pdf>" --page <N> --rect <x0> <y0> <x1> <y1> \
     --links-json <scratch>/links.json --outdir "Asset/Output/<Asset Name>"
   ```
   This both writes every copy and re-opens each one to verify it has exactly one link annotation with the right URI — read that verification output before reporting success; don't assume it worked.

## Rules

- Never edit visible text, shapes, or re-render/flatten the PDF — the only change per copy is one invisible link annotation.
- One UTM link per output file — never combine multiple UTM links into one PDF, even if the source has multiple CTA buttons (ask the user which button gets which link if that's ambiguous).
- If the button spans multiple pages/repeats (e.g. a CTA on every page), ask the user whether every instance should get the link or just the primary one, rather than guessing.
- Keep output filenames stable and descriptive (`<Asset Name> (<label>).pdf`) so campaign teams can tell copies apart without opening them.
