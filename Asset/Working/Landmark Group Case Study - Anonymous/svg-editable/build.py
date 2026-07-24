import base64
import math
import os
import sys
import components as C
from components import (
    CONTENT_X, CONTENT_W, CONTENT_RIGHT, PAGE_W, PAGE_H, MARGIN,
    BRAND, BRAND_600, BRAND_700, INFO_SUBTLE, INK, BODY, MUTED, DIVIDER, CARD_BG, BG,
)
from wrap import text_width
import fontembed

OUT_DIR = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(OUT_DIR, exist_ok=True)

STARS_SOURCE = "/Users/mohammed.shafin/Documents/Cleartax/Design system/Background/Stars/Stars-6.jpg"
STARS_SMALL = os.path.join(OUT_DIR, "_Stars-6-cover-src.jpg")

RUN_TITLE = "Retail Group Case Study"


def _prepare_cover_source():
    """Downscale the source photo (avoids a multi-hundred-MB embedded SVG image)
    and strip EXIF orientation — Chrome's SVG <image> honors EXIF rotation even
    though its CSS background-image path doesn't, which otherwise renders this
    photo sheared/misaligned. Re-run whenever the source photo changes."""
    if os.path.exists(STARS_SMALL):
        return
    from PIL import Image
    im = Image.open(STARS_SOURCE).convert("RGB")
    scale = 1600 / max(im.size)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    im.save(STARS_SMALL, quality=92, exif=b"")


def css_angle_dir(theta_deg):
    t = math.radians(theta_deg)
    return math.sin(t), -math.cos(t)


def grad_coords(theta_deg):
    dx, dy = css_angle_dir(theta_deg)
    return (0.5 - dx / 2, 0.5 - dy / 2, 0.5 + dx / 2, 0.5 + dy / 2)


def linear_gradient_def(gid, theta_deg, stops):
    x1, y1, x2, y2 = grad_coords(theta_deg)
    stop_tags = "".join(
        f'<stop offset="{off}" stop-color="{color}"' + (f' stop-opacity="{op}"' if op is not None else "") + "/>"
        for off, color, op in stops
    )
    return f'<linearGradient id="{gid}" x1="{x1:.4f}" y1="{y1:.4f}" x2="{x2:.4f}" y2="{y2:.4f}">{stop_tags}</linearGradient>'


def dot_pattern_def(pid, opacity=0.16, size=18, color="#ffffff"):
    return (f'<pattern id="{pid}" width="{size}" height="{size}" patternUnits="userSpaceOnUse">'
            f'<circle cx="{size/2}" cy="{size/2}" r="1" fill="{color}" fill-opacity="{opacity}"/></pattern>')


def wrap_svg(body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'width="{PAGE_W}" height="{PAGE_H}" viewBox="0 0 {PAGE_W} {PAGE_H}">'
            f'<defs>{defs}</defs>'
            f'<rect x="0" y="0" width="{PAGE_W}" height="{PAGE_H}" fill="{BG}"/>'
            f'{body}</svg>')


def embed_font_style():
    if not C.FONT_USAGE:
        return ""
    by_key = {}
    for family, weight, text in C.FONT_USAGE:
        by_key.setdefault((family, weight), []).append(text)
    specs = [(family, weight, "".join(texts)) for (family, weight), texts in by_key.items()]
    return fontembed.face_style(specs)


def closepanel(y_top, title, body_text, pill_text):
    pad = 26
    panel_bottom = PAGE_H
    panel_h = panel_bottom - y_top
    gid = "cta-grad"
    defs = linear_gradient_def(gid, 160, [("0%", BRAND_700, None), ("55%", BRAND, None), ("100%", BRAND_600, None)])
    pid = "cta-dots"
    defs += dot_pattern_def(pid)
    parts = [C.rect(CONTENT_X, y_top, CONTENT_W, panel_h, f"url(#{gid})", rx=16)]
    parts.append(f'<rect x="{CONTENT_X}" y="{y_top:.2f}" width="{CONTENT_W}" height="{panel_h:.2f}" rx="16" fill="url(#{pid})"/>')

    ty = y_top + pad
    title_svg, title_h = C.text_block(CONTENT_X + pad, ty, CONTENT_W - 2 * pad, title,
                                       "Nohemi", 700, 19, "#ffffff", 1.3)
    parts.append(title_svg)
    ty += title_h + 10
    body_svg, body_h = C.text_block(CONTENT_X + pad, ty, 560, body_text,
                                     "Gilroy", 400, 12.5, "rgba(255,255,255,0.88)", 1.55)
    parts.append(body_svg)
    ty += body_h + 16

    pill_pad_x = 22
    tw = text_width(pill_text, "Gilroy", 700, 12.5)
    C._use("Gilroy", 700, pill_text)
    pill_w = tw + 2 * pill_pad_x
    pill_h = 37
    parts.append(C.rect(CONTENT_X + pad, ty, pill_w, pill_h, "#ffffff", rx=999))
    parts.append(C.text_line(CONTENT_X + pad + pill_pad_x, ty + pill_h / 2 + 4.3, pill_text,
                              "Gilroy", 700, 12.5, BRAND_700))
    return "\n".join(parts), defs


def cover():
    C.reset_font_usage()
    title = "How a Leading Saudi Retail Group Prepared Millions of Invoices for ZATCA Phase 2"
    sub = ("3+ years of trusted partnership supporting 54M+ annual invoices — with zero invoice "
           "leakage and 100% business continuity, and real-time support absorbing peak retail "
           "volumes without operational slowdown.")

    _prepare_cover_source()
    from PIL import Image
    img_w, img_h = Image.open(STARS_SMALL).size
    scale = max(PAGE_W / img_w, PAGE_H / img_h)
    dw, dh = img_w * scale, img_h * scale
    b64 = base64.b64encode(open(STARS_SMALL, "rb").read()).decode()
    img_tag = f'<image x="0" y="0" width="{dw:.2f}" height="{dh:.2f}" href="data:image/jpeg;base64,{b64}"/>'

    scrim_gid = "cover-scrim"
    scrim_defs = linear_gradient_def(scrim_gid, 180, [
        ("0%", "#000000", 0.42), ("30%", "#000000", 0.18), ("60%", "#000000", 0.2), ("100%", "#000000", 0.55),
    ])
    scrim_rect = C.rect(0, 0, PAGE_W, PAGE_H, f"url(#{scrim_gid})")

    logo_svg = C.logo(MARGIN, 44, 32, dark=False)

    title_svg, title_h = C.text_block(MARGIN, 224, 668, title, "Nohemi", 700, 68, "#ffffff", 1.088,
                                       letter_spacing=-0.68)
    sub_top = 224 + title_h + 26
    sub_svg, _ = C.text_block(MARGIN, sub_top, 640, sub, "Gilroy", 500, 23, "#ffffff", 1.435)

    body = img_tag + scrim_rect + logo_svg + title_svg + sub_svg
    defs = scrim_defs
    svg = wrap_svg(body, defs)
    font_style = embed_font_style()
    svg = svg.replace(f'<defs>{defs}</defs>', f'<defs>{defs}</defs>{font_style}')
    return svg


def interior_page(page_num, blocks, footer=True):
    """blocks: list of callables taking y_cursor -> (svg, new_y_cursor)."""
    C.reset_font_usage()
    parts = [C.header_chrome(RUN_TITLE)]
    y = 130
    extra_defs = ""
    for b in blocks:
        result = b(y)
        if len(result) == 3:
            svg, y, defs = result
            extra_defs += defs
        else:
            svg, y = result
        parts.append(svg)
    if footer:
        parts.append(C.footer_chrome(page_num))
    body = "\n".join(parts)
    svg = wrap_svg(body, extra_defs)
    font_style = embed_font_style()
    svg = svg.replace(f'<defs>{extra_defs}</defs>', f'<defs>{extra_defs}</defs>{font_style}')
    return svg


def page2():
    def b1(y):
        return C.sec_head(y, "About the Company")
    def b2(y):
        return C.paragraph(y, "One of Saudi Arabia's leading retail groups operates a large network of "
                               "physical stores alongside a growing digital commerce business. Every year, "
                               "millions of customer transactions flow through its retail ecosystem, supported "
                               "by multiple business systems working together.")
    def b3(y):
        return C.stat_row(y, [
            ("54 Million+", "Annual B2C invoices"),
            ("250,000+", "Annual B2B invoices"),
            ("POS · ERP · E-commerce", "Multiple integrated business systems"),
        ])
    def b4(y):
        return C.paragraph(y, "The business relies on Oracle Retail Point-of-Sale systems for both B2C and "
                               "B2B transactions, along with e-commerce platforms and ERP systems such as OFIN "
                               "and RMS. These systems support different parts of the business while operating "
                               "under a single group VAT registration with multiple Commercial Registration "
                               "Numbers (CRNs).")
    def b5(y):
        return C.paragraph(y, "When ZATCA introduced Phase 2 of e-invoicing, the organisation had more to "
                               "prepare than just a compliance solution. Every invoice generated across every "
                               "business system had to meet regulatory requirements. At the same time, retail "
                               "operations had to continue without disruption. The engagement focused on "
                               "understanding the existing technology landscape, identifying compliance gaps and "
                               "building a roadmap for long-term regulatory readiness.")
    return interior_page(2, [b1, b2, b3, b4, b5])


def page3():
    def b1(y):
        return C.sec_head(y, "What Was the Requirement?")
    def b2(y):
        return C.paragraph(y, "On paper, the requirement looked simple. Prepare for ZATCA Phase 2. In reality, "
                               "it was far more complex.")
    def b3(y):
        return C.paragraph(y, "Invoices originated from multiple independent systems. Retail stores generated "
                               "invoices through Oracle Retail POS. Online orders followed a different journey. "
                               "ERP systems managed another part of the business. Every system handled data "
                               "differently, but all of them had to comply with the same regulatory "
                               "requirements.")
    def b4(y):
        return C.paragraph(y, "The scale of operations made the challenge even bigger. The organisation "
                               "processed up to 54 million B2C invoices and around 250,000 B2B invoices every "
                               "year. The compliance framework had to support these volumes without slowing "
                               "down business operations or affecting customer experience.")
    def b5(y):
        return C.paragraph(y, "The engagement also involved a Wave 1 entity. There were no previous "
                               "implementation references to follow. Business processes, invoice flows and "
                               "data requirements had to be analysed from the ground up before implementation "
                               "could begin.")
    def b6(y):
        return C.paragraph(y, "Retail-specific scenarios added another layer of complexity. Promotions, offers "
                               "and discount structures all required careful assessment to ensure they complied "
                               "with ZATCA requirements while continuing to support day-to-day business "
                               "operations.")
    def b7(y):
        return C.sub_head(y, "The Consequences It Had")
    def mk_row(title, desc):
        def f(y):
            return C.row_card(y, title, desc)
        return f
    blocks = [b1, b2, b3, b4, b5, b6, b7,
              mk_row("No single compliance view",
                     "Different systems generated invoices independently, making it difficult to monitor "
                     "compliance across the business."),
              mk_row("High operational complexity",
                     "Millions of invoices needed to be processed accurately without affecting business "
                     "performance."),
              mk_row("Implementation uncertainty",
                     "As a Wave 1 entity, there was no previous benchmark to follow, making planning and "
                     "regulatory interpretation even more critical."),
              mk_row("Risk of inconsistent compliance",
                     "Different business units and systems could interpret regulatory requirements differently "
                     "if not managed through a unified approach.")]
    return interior_page(3, blocks)


def page4():
    def b1(y):
        return C.sec_head(y, "How ClearTax Helped")
    def b2(y):
        return C.paragraph(y, "Rather than beginning with implementation, ClearTax started by understanding "
                               "the business.")
    def b3(y):
        return C.paragraph(y, "The team worked closely with both business and technical stakeholders to study "
                               "how invoices moved across the organisation. Every source system was analysed. "
                               "Business processes were reviewed. Data flows were mapped. This helped identify "
                               "where compliance gaps existed and what needed to change before implementation "
                               "could begin.")
    def b4(y):
        return C.paragraph(y, "The result was a structured roadmap that balanced regulatory compliance with "
                               "business continuity.")
    def b5(y):
        return C.flow_timeline(y, ["Business Assessment", "System & Data Analysis", "Gap Identification",
                                    "Compliance Blueprint", "Implementation", "Continuous Support"])
    def b6(y):
        return C.paragraph(y, "With a clear understanding of the business landscape, ClearTax designed a "
                               "scalable compliance blueprint aligned with ZATCA Phase 2 requirements. The "
                               "solution was built to support high transaction volumes while maintaining "
                               "operational efficiency across POS, ERP and e-commerce systems.")
    def b7(y):
        return C.paragraph(y, "Infrastructure was prepared to handle peak retail periods. End-to-end compliance "
                               "was built into invoice generation across every channel. The team also "
                               "implemented robust retry mechanisms to prevent invoice leakage and notification "
                               "systems that enabled timely corrective action whenever issues occurred.")
    return interior_page(4, [b1, b2, b3, b4, b5, b6, b7])


def page5():
    def b1(y):
        return C.sec_head(y, "How ClearTax Helped, Continued")
    def b2(y):
        return C.paragraph(y, "Support did not end after implementation. ClearTax continued to assist the "
                               "organisation during live operations, including ZATCA downtime scenarios. "
                               "Processes were redesigned to reduce dependency on manual intervention, helping "
                               "the organisation move towards a process-driven operating model.")
    def b3(y):
        return C.sub_head(y, "Everything That Came With ClearTax")
    def mk_row(title, desc):
        def f(y):
            return C.row_card(y, title, desc)
        return f
    blocks = [b1, b2, b3,
              mk_row("Dedicated implementation team",
                     "Worked closely with business and technical teams throughout the engagement."),
              mk_row("Regulatory expertise",
                     "Guided the organisation through complex ZATCA Phase 2 requirements and implementation "
                     "decisions."),
              mk_row("Reliable delivery",
                     "Built a scalable compliance framework without disrupting day-to-day retail operations."),
              mk_row("Continuous support",
                     "Assisted during live operations with monitoring, alerts and support during downtime "
                     "scenarios."),
              mk_row("Future assurance",
                     "Leveraged experience from multiple e-invoicing implementations to help the business stay "
                     "prepared for evolving regulatory requirements.")]
    return interior_page(5, blocks)


def page6():
    C.reset_font_usage()
    parts = [C.header_chrome(RUN_TITLE)]
    y = 130
    extra_defs = ""

    svg, y = C.sec_head(y, "The Result")
    parts.append(svg)

    svg, y = C.cmp_table(y, ("Before", "After"), [
        ("Independent systems with limited compliance visibility",
         "A structured compliance roadmap across business systems"),
        ("Compliance gaps yet to be identified",
         "Clear understanding of data, process and architectural requirements"),
        ("Infrastructure needed validation for high transaction volumes",
         "Scalable design prepared for peak retail operations"),
        ("Greater dependency on manual processes",
         "Process-driven execution supported by alerts and retry mechanisms"),
    ])
    parts.append(svg)

    svg, y = C.pullquote(y, "\"One of the strongest validations of the engagement came during the first-ever "
                             "ZATCA inspection of the organisation's stores.\"")
    parts.append(svg)

    svg, y = C.paragraph(y, "The authorities provided positive feedback on the organisation's compliance and "
                             "overall process execution — reflecting the strength of the planning, "
                             "implementation, and operational readiness established throughout the engagement.")
    parts.append(svg)

    svg, y = C.sub_head(y, "A Partnership Built on Expertise")
    parts.append(svg)

    svg, y = C.paragraph(y, "The engagement delivered far more than regulatory readiness. The organisation "
                             "gained a scalable compliance foundation designed to support one of Saudi Arabia's "
                             "largest retail operations — and, more importantly, the confidence of having an "
                             "experienced partner that understood both the regulation and the realities of "
                             "large-scale implementation.")
    parts.append(svg)

    svg, y = C.paragraph(y, "From the first assessment to post-go-live support, ClearTax remained closely "
                             "involved at every stage — providing guidance when challenges arose, supporting "
                             "business continuity during critical situations, and helping build processes that "
                             "would continue to support the organisation as regulations evolved. That is what "
                             "sets ClearTax apart: not just technology, but the expertise, delivery assurance, "
                             "and continuous support that help businesses stay compliant today while remaining "
                             "prepared for tomorrow.")
    parts.append(svg)

    panel_top = y + 16
    panel_svg, panel_defs = closepanel(panel_top, "Planning your ZATCA compliance journey?",
                                        "Partner with ClearTax to build a future-ready compliance framework and "
                                        "get the expert guidance, reliable delivery, and continuous support you "
                                        "need.", "Book a demo now")
    parts.append(panel_svg)
    extra_defs += panel_defs

    body = "\n".join(parts)
    svg = wrap_svg(body, extra_defs)
    font_style = embed_font_style()
    svg = svg.replace(f'<defs>{extra_defs}</defs>', f'<defs>{extra_defs}</defs>{font_style}')
    return svg


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    builders = {"1": cover, "2": page2, "3": page3, "4": page4, "5": page5, "6": page6}
    todo = builders.items() if which == "all" else [(which, builders[which])]
    for num, fn in todo:
        svg = fn()
        path = os.path.join(OUT_DIR, f"Leading Saudi Retail Group Case Study - Slide {num}.svg")
        open(path, "w").write(svg)
        print(path, len(svg), "bytes")
