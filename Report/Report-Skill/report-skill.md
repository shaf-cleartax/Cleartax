---
name: report-skill
description: Build Cleartax-branded data/research reports (landscape, multi-page, e.g. "The Oman Fawtara Reality Index 2026") directly as native Figma pages using `use_figma`, applying the report-only typography remap, the V1.3 rebrand visual direction, and named Figma text/color styles. Use whenever asked to create, extend, audit, or fix a Cleartax report, index, or survey-findings deck built from a source markdown/content file. For portrait one-pagers/brochures use asset-skill, for 16:9 slide decks use deck-skill — this skill is specifically for landscape, page-numbered, footnoted "report" documents authored natively in Figma.
---

# Cleartax Report Skill

## Overview

A **report** in this vault (e.g. `Report/Content/July 2026_Oman e-Invoicing Survey Report.md` → the "Oman Fawtara Reality Index 2026" Figma file) is a multi-page, page-numbered, footer-branded landscape document built **directly as native Figma nodes** via the `use_figma` tool — not an HTML file, not a PDF export pipeline. Every page is its own top-level Figma frame on the canvas; there is no local source file to edit, the Figma file itself is the deliverable.

This is a different production model from `deck-skill` (self-contained HTML + `deck-stage.js`, exported to PDF/PPTX) and `asset-skill` (self-contained HTML, exported to PDF, optionally direct-built in Figma as an *option*). For reports, the direct Figma build is not an option, it's the only path — reports are conceived, edited, and reviewed live in Figma throughout the build.

Typical asks this covers: "build a report from this markdown", "add the missing section to the report", "audit the report against the source content", "renumber/insert a page in the report", "apply the visual direction to the report".

## Required References

Read these instead of hardcoding values — they are the source of truth and can change:

- **The source content markdown** (e.g. `Report/Content/July 2026_Oman e-Invoicing Survey Report.md`) — read it in full before building or auditing any page. Every stat, quote, attribution, and framing sentence must trace back to this file; never invent figures.
- **`Report/Typography-Report/Report-typography-system.md`** — the report-only type-scale remap (see Typography below). This diverges deliberately from the default Typography Style Guide and applies **only** to report builds, never to case studies, decks, or brochures.
- **`Design system/Fonts/Typograpghy Style Guide.pdf`** — the base guide the report scale remaps from. Re-confirm against this PDF before adding any new role to the report system; don't extend the remap from memory.
- **The report's own "Report Visual Direction" reference page inside the Figma file** (e.g. node `56:2` in `gnHY8v1oS8raXdaPM9pEKT`) — the actual V1.3 rebrand palette/shape/photography language to apply, kept live in-file specifically so it can't drift from what the rest of the vault's `Design system/` assets show. Treat it as more authoritative than a remembered hex list for this file.
- **`Design system/Variables/Semantics.json`** — base semantic color tokens, as a fallback source when a report needs a role the Visual Direction page doesn't explicitly demonstrate.
- **`Design system/Logo/Cleartax-logo-black.png`** — the real logo asset for report header chrome. Never render "cleartax" as typed text, even in a lowercase wordmark-style font that looks close.

## Font substitution

Figma's `use_figma` sandbox cannot load the real Cleartax report fonts (PPNeueMontreal-Variable / PPNeueMontrealText-Variable). Substitute:

| Role group | Real font | MCP substitute |
|---|---|---|
| Display / Heading (Display, H1, H2) | PPNeueMontreal-Variable | **Poppins** |
| Paragraph / Label (H3, H4, Paragraph) | PPNeueMontrealText-Variable | **Inter** |

This is a different substitution pair from `deck-skill`/`asset-skill` (which use Nohemi/Gilroy as the real fonts, also substituted with Poppins/Inter in the MCP sandbox) — reports use PPNeueMontreal as their real family, not Nohemi. Don't cross-apply Nohemi/Gilroy guidance to a report build.

## Typography — Report Typography System (report-only, do not reuse elsewhere)

| Report role | Maps to guide token | Size / line-height | Weight | Font |
|---|---|---|---|---|
| Display | Display / Semibold / Large | 52 / 56 | Semibold | Poppins |
| H1 | H3 / Semibold / Mobile | 28 / 36 | Semibold | Poppins |
| H2 | H6 / Semibold / Mobile | 18 / 24 | Semibold | Poppins |
| H3 | Label / Medium / Medium | 14 / 16 | Medium | Inter |
| H4 | Label / Small / Medium | 12 / 14 | Medium | Inter |
| Paragraph *(merged, report-only)* | Paragraph/Small + XX Small merged | 8 / 12 | Medium | Inter |

H3/H4 are a **font-family swap**, not just a size change — they drop out of the Heading/Poppins family entirely onto the Label/Inter scale, reading closer to a bold caption than a heading. Every other role (Paragraph/Large/Medium, Overline, the Label family used directly) is unchanged from the default guide.

**Do not invent a new size or role for a report page.** If a page genuinely needs something the table doesn't cover, propose the new/merged tier explicitly and get it confirmed before using it — the 8/12 merged Paragraph tier above was added this way, not assumed. Keep `Report-typography-system.md` in sync any time the table changes; it is the single source of truth, this skill file only mirrors it.

**Named Figma styles**: create/reuse `Report/Display`, `Report/H1`, `Report/H2`, `Report/H3`, `Report/H4`, `Report/Paragraph` text styles in the report file and apply via `setTextStyleIdAsync` — don't set raw `fontName`/`fontSize` per node once a style exists for that role, it silently drifts from the table over time.

## Visual Direction — V1.3 rebrand palette

- **Midnight Blue** `#05022A` — primary dark background wash where the report calls for one.
- **Indigo** `#5446FF` — the dominant headline accent. Highlight one keyword per headline in indigo; do not color the full headline.
- **Lime** `#C8F006` — sparing highlight only (a single stat, a single tag). Never the default accent — indigo carries that job. Don't let green/lime dominate headings.
- Semantic tint families for stat categorization (positive/green, notice/orange, progress/blue, indigo tint) — used as card background washes to visually group related stats (e.g. a "what went right" vs "what went wrong" two-column split), not as text colors.

Create named **paint styles** per semantic role (Ink, Indigo, Indigo tint, Positive subtle, Notice subtle, Progress subtle, etc.) the first time each is used, and apply everywhere after via `setFillStyleIdAsync` / `setRangeFillStyleIdAsync` (the latter for per-character-range highlighting, e.g. one indigo word inside an otherwise-black headline) — never a scattered raw hex per node.

## Layout System

- **Canvas: 842×595px** (A4 landscape), one Figma frame per page, laid out left-to-right on the canvas spaced by frame-width + 120px gap.
- **Margins**: 40–56px depending on content density; confirm against neighboring pages rather than picking a number cold.
- **Header chrome** (every content page): real logo image top-left + uppercase running report title top-right (muted) + a 1px divider rule beneath (~y=84).
- **Footer chrome**: a 1px divider rule + `cleartax.com` bottom-left + page number bottom-right, both muted. Content must never cross the footer's divider line (`footerY`, typically `595 − 56 = 539`) — this is the hard constraint every page layout is checked against.
- Divider/back-cover/section-break pages intentionally carry no footer page number — don't add one just for consistency.
- Content starts around y≈88–112, directly beneath the header divider.

## Known `use_figma` bugs and gotchas (learned the hard way — don't re-discover these)

- **Measure after resize, not before.** `textAutoResize = 'HEIGHT'` must be set (and the font loaded) *before* reading `.height` on a text node — otherwise you get a stale/default height and wrapped multi-line text silently overlaps whatever comes next.
- **Don't use a mutated live property as your own loop threshold.** E.g. looping while comparing against `node.y` after the same loop iteration just reassigned `node.y` corrupts the comparison. Capture primitive values into a plain variable before the loop starts.
- **Stacked/segmented bar charts**: only round the *outer-facing* corners — `topLeftRadius`/`bottomLeftRadius` on the first segment, `topRightRadius`/`bottomRightRadius` on the last, zero on every segment in between. A uniform `cornerRadius` (e.g. 999) applied to every segment turns narrow inner segments into disconnected circles instead of one continuous rounded bar.
- **`upload_assets` + `nodeId` targeting can silently create a stray frame** instead of filling the intended node. Workaround: reuse the returned `imageHash` and set `fills` directly on the target node yourself rather than trusting the nodeId param to land correctly.
- **Always verify visually, not just by return value.** After any layout change, call `get_screenshot`, `curl` the returned URL to a local PNG (short-lived URL — download immediately), and `Read` the image. Treat a clean-looking set of returned y-coordinates as unverified until you've actually seen the render — overflow past the footer line is easy to miscalculate on paper and easy to spot in a screenshot.
- **Page insertion/renumbering**: when a page is inserted or removed, every subsequent frame needs (a) its x-position shifted by ± one frame-width + gap to stay in reading-order on the canvas, (b) its frame name's leading page number updated, and (c) its footer page-number text node's `.characters` updated — do this via an explicit per-frame `[nodeId, oldNumber, newNumber]` mapping applied with direct node references, not a single regex/find-replace sweep across the whole file (too easy to corrupt an unrelated match, e.g. a number appearing inside body copy).
- **Content-completeness isn't "does every section exist."** Cross-check every built page against the *full* source markdown at the end of a build, not just at section-level — quote framing sentences, per-item context/analysis notes, and attribution venue suffixes are exactly the kind of detail that gets trimmed under space pressure and then quietly forgotten. Do this as an explicit final audit pass, and re-verify with a screenshot after any fix.

## Production Workflow

1. **Read the full source markdown** before building or modifying any page — content, stats, and quotes all come from there, never invented.
2. **Confirm the Figma file key and existing page count** before starting (`figma.currentPage.children`) — don't assume a fresh build; a report is usually extended/audited/fixed incrementally across sessions.
3. **Learn the Report Visual Direction page in-file** before applying any color — if only asked to learn it, don't also start recoloring pages in the same turn; those are separate asks.
4. **Create named text/color styles the first time each role is needed**, then apply via style IDs everywhere after — don't let raw hex/font values creep back in once a style exists.
5. **Build page by page** at 842×595, header/footer chrome first, then content, matching whichever archetype the source content shape calls for (two-column stat comparison, quote grid, stacked bar chart, scorecard, etc.) — vary composition across pages the way `deck-skill` varies archetypes across slides.
6. **Screenshot and visually verify every page** after building or editing it — download and `Read` the PNG, don't trust calculated coordinates alone.
7. **Run a full content-completeness audit** against the source markdown once the page set is "done" — check for missing sections *and* trimmed details within existing sections (framing sentences, context notes, attribution details).
8. **Fix anything the audit finds**, inserting new pages with the renumbering procedure above if a whole section was missing, then re-screenshot and re-verify.
9. **Deliver in place** — the Figma file is the deliverable; there is no local export step by default. Only produce a PDF/PNG export if explicitly asked.

## Design Guardrails

- Never apply the Report Typography System to a non-report asset (case study, deck, brochure) — it's a deliberate, documented divergence scoped to reports only.
- Never invent a new report typography size on the fly — extend `Report-typography-system.md` explicitly and get it confirmed first.
- Indigo is the dominant headline accent; lime and green are sparing highlights, never the default.
- Real logo image asset only, top-left, never typed "cleartax" text.
- Every page must visually fit within its 842×595 frame with content clearing the footer divider — verified by screenshot, not just arithmetic.
- One visual system per report: don't mix in a different reference report's visual language (e.g. a UAE reference report analyzed purely for content/layout patterns) — reskin fully into this report's own Visual Direction page.

## Quality Checklist (verify before considering a report page/build done)

- [ ] Every stat, quote, and attribution traces back to the source markdown — nothing invented
- [ ] Every text node uses a named `Report/*` text style, not raw font/size values
- [ ] Every color uses a named paint style, not a raw hex fill
- [ ] Indigo carries the headline accent; lime/green used sparingly, not dominant
- [ ] Real logo image asset in header, never typed text
- [ ] Content clears the footer divider line on every page — confirmed via downloaded screenshot, not just calculated y-values
- [ ] Page numbers and frame names are sequential and correct after any insertion/removal
- [ ] A full content-completeness audit against the source markdown has been run at least once before calling the report finished
