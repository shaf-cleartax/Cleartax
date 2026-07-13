---
name: asset-skill
description: Create Cleartax-branded visual assets (one-pagers, LinkedIn/social assets, compliance guides, portrait PDFs) using Cleartax's actual design system tokens, typography scale, and logo assets. Use whenever asked to create, recreate, or reskin an asset, brochure, one-pager, PDF, or LinkedIn/social visual for Cleartax.
---

# Cleartax Asset Skill

## Overview

Use this skill to produce finished portrait PDF assets that read as native Cleartax collateral — not a generic template, and not a clone of whatever visual style a reference file happened to use. Reskin content into Cleartax's current brand system every time, even when working from an existing asset (old brochure, competitor asset, previous campaign PDF) as a content/structure reference.

Typical asks this covers: "create a one-pager on X", "recreate this brochure with our design system", "build a LinkedIn asset for Y", "make a compliance guide like Z but on-brand".

## Required References

Read these instead of hardcoding values — they are the source of truth and can change. The vault has been reorganized before without notice (top-level content folders were consolidated into a `{Category}/{Design system, Output, Reference, Skill}` shape) — verify each path below still exists before relying on it, and re-locate it (e.g. `find . -iname "<filename>"`) if not:

- `Design system/Variables/Semantics.json` — color tokens (a single flat file; there is no separate file per market/geography)
- `Design system/Fonts/Typograpghy Style Guide.pdf` — the exact type scale (sizes, line-heights, weights) for Display, H1–H6, Paragraph, Label, and Overline (the misspelling "Typograpghy" is in the actual filename — match it exactly)
- `Design system/Variables/Spacing.json` and `Design system/Variables/Border.json` — spacing and radius scale
- `Design system/Fonts/Nohemi/Web-TT/*.woff2` and `Design system/Fonts/Gilroy - font/*.otf` — the two brand typefaces
- `Design system/Logo/Logo.svg` (white) and `Design system/Logo/Logo-dark.svg` (black) — vector logo marks. `Design system/Logo/Cleartax-logo-black.png` / `Cleartax-logo-white.png` are raster alternates. Never render the logo as typed text.
- `Design system/Background/Stars/Stars-<n>.jpg` (10 images) — the default cover background source (see Layout System below). `Design system/Background/Gradient/{Dark,Light}/<n>.jpg` are the secondary/alternative photographic-gradient backgrounds.
- `Asset/Script/` — reusable Python tooling for exporting a finished asset as editable-text SVG slides (see "Editable Figma Export" below). Not needed for a normal PDF build.

## Color Tokens (Cleartax brand, from Semantics)

- Brand: `#3355FF` — headings, accents, primary buttons/pills
- Brand hover/600: `#2944CC`, Brand pressed/700: `#1F3399` — gradients, darker accents
- Info subtle: `#D6DDFF` — light-blue highlight fills (callouts, table headers, tag chips)
- Ink: `#0D0D0D` — headings/emphasis text on white
- Body: `#4D4D4D` — default paragraph text
- Muted: `#808080` — footers, running headers, secondary labels
- Divider: `#E5E5E5` — hairlines, table borders
- Card background: `#F9FAFB` — neutral card fills
- Notice: `#FF8000`, Positive: `#66C285` — used sparingly as accent colors (e.g. in the spectrum bar), not as text colors
- Background: `#FFFFFF`

Always pull from the token file rather than reusing these numbers blindly — verify the file still defines them before a build.

## Typography — map every text style to a named token

Nohemi is used for Display and H1–H6 only. Gilroy is used for Paragraph, Label, and Overline. Never use an arbitrary in-between size (e.g. "21px" or "12.6px") — always round to the nearest defined token:

| Token | Font / weight | Size / line-height |
|---|---|---|
| Cover/Hero/Bold | Nohemi Bold | 68 / 74 |
| Cover/Subtitle/Medium | Gilroy Medium | 23 / 33 |
| Display/Extrabold/Large | Nohemi ExtraBold | 52 / 56 |
| H4/Extrabold/Desktop | Nohemi ExtraBold | 28 / 36 |
| H5/Bold/Desktop | Nohemi Bold | 24 / 32 |
| H5/Semibold/Desktop | Nohemi SemiBold | 24 / 32 |
| H6/Bold/Desktop | Nohemi Bold | 20 / 28 |
| Paragraph/Small/Regular | Gilroy Regular | 14 / 20 |
| Paragraph/XSmall/Regular, Medium, Semibold | Gilroy | 12 / 20 |
| Label/XSmall/Regular, Medium, Semibold | Gilroy | 10 / 14 |
| Overline/Small | Gilroy Semibold | 12 / 20 |
| Overline/Large | Gilroy Semibold | 14 / 20 |

Practical mapping used across built assets: page section headings → H5/Bold/Desktop; body copy/table cells/card text → Paragraph/XSmall; running header, table headers, "key insight"-style labels, chip text → Overline/Small or Label/XSmall; big stat numbers → H4/Extrabold/Desktop; **cover headline → Cover/Hero/Bold (68/74), tight tracking (-0.01em); cover subtitle → Cover/Subtitle/Medium (23/33) directly beneath it.** This is the standard for every cover page going forward — deliberately larger than the general Display token (52/56) so the cover reads as a hero moment rather than just the biggest heading in the deck. Reserve Display/Extrabold/Large for non-cover uses (e.g. a large in-page stat or standalone statement). Both cover title and subtitle render as solid white (`#ffffff`), no text-shadow — not a gradient text-fill either; a diagonal white-to-white-alpha gradient fill was tested and rejected in favor of plain white. A blurred `text-shadow` (e.g. `0 2px 16px rgba(0,0,0,0.25)`) was also tested and rejected: some PDF renderers (e.g. macOS Preview/Quartz) rasterize Chrome print-to-pdf's text-shadow blur as a visible semi-opaque rectangle behind the glyphs instead of a soft blur — a real bug, not a one-off rendering quirk, so avoid blurred text-shadow on cover type entirely. The bottom-weighted black scrim already provides enough contrast for white text without it.

## Layout System

- Canvas: A4 portrait, `794×1123px` at 96dpi (`@page { size: 794px 1123px; margin: 0; }`) — matches 595×842pt when printed
- Margins: 56px on all sides
- **Cover page — standard recipe**: background is a photo from `Design system/Background/Stars/Stars-<n>.jpg` (default choice going forward — night-sky/star-trail photography, chosen over the flat CSS brand gradient and the Gradient-folder photos, which are now secondary alternatives, see below) + a bottom-weighted black scrim (`linear-gradient(180deg, rgba(0,0,0,.42) 0%, rgba(0,0,0,.18) 30%, rgba(0,0,0,.2) 60%, rgba(0,0,0,.55) 100%)`) + logo (white) top-left, sized larger than interior-page logos at **32px tall** (not ~20px) + title/subtitle block, top-aligned. No eyebrow chip/pill — the standard recipe is logo → gap → title → subtitle only.
  - **Title/subtitle placement**: top-aligned, not vertically centered. Exact gap: logo's top edge is at `top:44px`; with a 32px-tall logo (bottom edge ≈76px), the title's top edge sits **160px below the logo's bottom edge** (`top:224px` in the standard 56px-margin layout). Eyebrow removed, so nothing sits in that gap — it's clear space. Title and subtitle stack in normal flow directly beneath (title `margin-bottom:26px`), so the block reflows correctly if the title wraps to a different number of lines.
  - **Stars source images are portrait**, unlike the Gradient-folder photos (which are landscape). On the portrait cover canvas, `background-size:cover` still crops one axis — check each image individually and pick `background-position` (top/center/bottom) so the calmest, darkest region of that specific photo sits behind the logo and title; don't assume one position works for all 10 Stars images (some have a bright star-trail swirl or Milky Way core that needs to be cropped away from the text area).
  - **Legacy/alternative backgrounds** (use only if the brief calls for a different mood than night-sky photography): the flat Cleartax brand gradient (`linear-gradient(160deg, #1F3399 0%, #3355FF 55%, #2944CC 100%)` + dot-grid + one abstract geometric graphic + 8px bottom spectrum bar), or `Design system/Background/Gradient/{Dark,Light}/<n>.jpg` (landscape photographic gradients — orient so the darkest region lands at the top behind the logo/title, since `cover`-fit always shows the image's full vertical range on these). Same scrim principle applies either way. When testing multiple candidates for any of these, render one mockup per option plus a contact-sheet thumbnail grid so they can be compared at a glance before picking one.
- **Interior page chrome**: logo-dark top-left (~20px tall) + uppercase running title top-right (Overline/Small, muted) + 1px divider rule beneath (y≈84) + content starting at y≈130 + a 1px footer rule + footer row (`cleartax.com` left, page number right, Label/XSmall)
- **Section heading**: H5/Bold/Desktop in brand blue, followed by a short 38×4px brand-blue rounded rule
- If the asset closes on a CTA/product-suite page, bookend it with a second gradient+dot panel matching the cover, rather than ending flat on white

## Component Library

Reuse these rather than inventing new patterns per asset:

- **Pull-quote** — 4px brand-blue left border + H5/Bold/Desktop text in brand-700. Always reuses a sentence already present in the source copy; never invented filler.
- **Pill-banner** — solid brand-blue rounded pill, white Nohemi Medium text, for short declarative statements.
- **Tag-chip grid** — 2×2 (or more) neutral/dark rounded chips for short label phrases.
- **Quote-card** — card-bg rounded box holding multiple italic quoted lines, dashed dividers between lines.
- **Info-card** — info-subtle rounded box holding a bullet list (brand-blue bullet dot, dashed dividers).
- **Icon-badge card** — circular badge (info-subtle fill, brand-blue stroke SVG line icon) + text, used solo in a 2×2 grid or stacked as a feature list.
- **Comparison table** (2 or 3 col) — header row info-subtle bg with Overline-style brand-blue uppercase labels; body rows Paragraph/XSmall; alternate zebra striping via card-bg; an "emphasis" column can be bolded + card-bg tinted.
- **Stat-strip** — 3-column grid of card-bg boxes, each with a big H4/Extrabold number and a Paragraph/XSmall label underneath.
- **Callout / key-insight box** — info-subtle bg, 4px brand-blue left border, Overline label + Paragraph/XSmall body.

Use pull-quotes, stat-strips, and icon-badge cards as the go-to tools for balancing a page that reads too sparse — never by inflating font sizes past their token or inventing new marketing copy.

## Design Guardrails

- Only use colors from the token files — never invent a hex value.
- No stock photography or moody/dark imagery. Use abstract geometric graphics instead (dot-patterns, node networks, radar rings, skyline silhouettes) even if the source reference material used photography.
- Always embed the real logo SVG/PNG — never a hand-typed "cleartax" text wordmark.
- When recreating an existing asset, preserve its content/copy and page structure, but always reskin the *visual* system into current Cleartax brand — don't clone a legacy asset's palette, typeface, or photographic treatment even if that's what the reference file used.
- One visual system per asset: don't mix in a different palette or typeface partway through.
- Section headings are one level deep per page (H5/Bold) — don't introduce ad hoc heading sizes for sub-points; use bold inline text or Overline labels instead.
- Every text style must map to a named typography token — no arbitrary sizes. **Watch table/card components specifically**: when a table or grid feels too tight, the instinct is to shrink its font (e.g. 11.3px, 10.8px) to force-fit content — this silently breaks token compliance. Instead, either accept the larger token size and let the table run onto a second page, or trim/redistribute rows. In one build, tables and cert-cards drifted to off-token sizes (11.3–11.5px) under exactly this pressure; correcting them back to Paragraph/XSmall (12/20) not only fixed the violation but *also* fixed several pages that had read as too sparse — the undersized text had been leaving real estate unused. Token-compliance and page balance are the same problem, not a trade-off.

## Production Workflow

0. **Verify paths first.** Before building, confirm every path in "Required References" and every path below still resolves — this vault gets reorganized without notice, and a stale path fails silently as a missing font/logo/token rather than a loud error.
1. **Read the full source** (every page of the reference asset, if one exists) before writing any HTML — content and structure come from there, visuals do not.
2. **Set up `Asset/Working/<project-name>/index.html`** as a single self-contained file: one shared `<style>` block, one `<section class="page">` per page. (Create `Asset/Working/` if it doesn't exist — it has been wiped by vault reorganization before, even though `Asset/Output/` survived.)
3. **Embed fonts** via `@font-face` using absolute `file://` paths into `Design system/Fonts/Nohemi/Web-TT/*.woff2` and `Design system/Fonts/Gilroy - font/*.otf` (Nohemi has woff2; Gilroy is otf-only).
4. **Build shared chrome/components first** (CSS variables from the token files, header/footer chrome, section heading, paragraph styles, card/table components), then fill in page content.
5. **QA-render to PNG** with headless Chrome (`--headless --screenshot` at the page's pixel width, stacked height = pages × 1123). Split the tall screenshot per-page (e.g. with Python/PIL) and visually review every page.
6. **Fix overflow and imbalance** — dense and sparse pages should feel equally intentional. Prefer pull-quotes/stat-strips/icon cards over stretching font sizes or leaving large dead space.
7. **Render the final PDF**: `chrome --headless --disable-gpu --no-pdf-header-footer --print-to-pdf-no-header --print-to-pdf="<name>.pdf" --virtual-time-budget=3000 --run-all-compositor-stages-before-draw file://<path>/index.html`. Confirm page count and page size (`pdfinfo`) — should be A4, 595×842pt.
8. **Rasterize and re-verify the actual PDF** (`pdftoppm -png -r 120`) — print rendering can differ subtly from the screenshot QA, so re-check fonts/gradients/spacing on the real output, not just the preview.
9. **Deliver**: copy the final PDF to `Asset/Output/`. Keep the HTML source in `Asset/Working/<project-name>/` for future edits — note this source has been lost to vault reorganization before, so don't treat it as guaranteed durable storage for anything critical. Clean up intermediate QA PNGs from the working folder before finishing.

Tools used throughout: Google Chrome headless (`--screenshot` and `--print-to-pdf`), `pdfinfo`/`pdftoppm` (poppler, for inspecting and rasterizing the output), Python3 + PIL (for splitting a stacked multi-page QA screenshot into per-page images).

## Editable Figma Export (SVG)

If the user wants the asset as something they can drop into Figma and edit — not just view — the format choice matters:

- **If retypable text isn't required**, hand them the per-page PDF (split the final PDF with `pdfseparate`). Figma's native PDF import reads the PDF's real text objects directly and creates genuine editable text layers, as long as the source PDF has real embedded fonts (Chrome's `--print-to-pdf` output qualifies — verify with `pdftotext`). This is the cheap option and needs no extra tooling.
- **Do not** route through `pdftocairo -svg` for this purpose — it outlines every glyph into vector paths (`<use>`/`<path>` in `<defs>`, zero `<text>` elements). The result imports into Figma fine visually but text is not retypable.
- **For a hand-authored SVG with genuinely editable `<text>`**, use `Asset/Script/` (`build.py`, `components.py`, `fontembed.py`, `wrap.py`). This mirrors the technique in `Ad/Scripts/`: real `<text>` per line (not outlined), fonts subset to only the glyphs used and embedded as base64 woff2 (`fontembed.py`), photos embedded as base64 JPEG, and the logo inlined as raw vector paths copied from `Design system/Logo/*.svg`. Line-wrapping is computed with real font metrics (`wrap.py`, via PIL) so breaks match what the browser would have rendered. Run with `python3 build.py <page-number|all>`; content and per-page layout are currently hardcoded per asset in `build.py` — adapt the block calls for a new asset's copy.
  - **Margin collapsing must be replicated by hand.** CSS collapses adjacent block margins to `max(prev-bottom, next-top)`; the Python layout cursor does not do this automatically — each component that adds its own top gap (e.g. a sub-heading after a paragraph) must top up only the *difference* over the previous block's trailing gap, not add its full margin on top of it. Getting this wrong silently pushes content into the footer with no error.
  - **Strip EXIF orientation from any embedded photo.** Chrome's SVG `<image>` renderer honors an EXIF rotation tag even though its CSS `background-image` path does not — embedding a photo with an orientation tag intact renders sheared/misaligned in the SVG despite looking correct in every HTML/PDF build. Downscale and re-save with `exif=b""` (Pillow) before embedding, keeping the raw pixel orientation as-is (don't bake in the EXIF-implied rotation, since that would no longer match the crop already validated in the HTML build).
