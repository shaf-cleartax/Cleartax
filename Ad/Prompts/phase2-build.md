Phase 2 — Build the selected 1:1 ad
Read this once the user picks a concept (and any edits). Follow references/brand-system.md
throughout — it is the source of truth for the canvas, logo rules, typography, moods, CTA, and
hero handling.
Build steps

Build the ad at exactly 900×900 as self-contained SVG, following
references/brand-system.md: embed one of the bundled gradient backgrounds via
scripts/bgembed.py (add left_scrim() if text contrast is marginal), correct logo version
for that background, safe margins, the chosen mood's text/CTA palette, two-tone headline,
CTA pill, and hero handling.

Embed the real Nohemi/Gilroy weights used, via scripts/fontembed.py (subsets to the
glyphs used + base64 woff2). See brand-system for the one-liner. Never ship fallback fonts.
Inline the logo by pasting the SVG path from the correct file in assets/logo/ (don't link to it).
Reserve the hero zone clear (right / bottom-right, background only) — no placeholder
box, border, or label. State the intended photo direction in the chat text, per
brand-system. (Only build a code-drawn hero if the user explicitly asked for one.)


Show it inline using the visualizer so the user sees the rendered mockup immediately.
Save the file to /mnt/user-data/outputs/ (e.g. cleartax-ad-<slug>.svg) and present it
with present_files so the user can download and open it in Figma.
Remind the user in one line that the ad is self-contained (fonts + gradient embedded) and
the photo hero is dropped into the reserved zone in Figma.

Then offer to iterate: tweak copy, swap mood, adjust hero, or produce sibling variations
(e.g. the same concept for another country).
Rendering notes

Everything is one self-contained file — the logo is inlined and the Nohemi/Gilroy weights
used are embedded as base64, so text renders in the true fonts with no local install.
Text must stay inside the safe margin and never overlap the hero awkwardly. Left-align the
logo, headline, subhead, and CTA to the same left margin.
If a headline is long, reduce size before letting it wrap past 4 lines.

Quick self-check before delivering

 Bundled gradient background embedded (+ left scrim if needed); logo version matches its luminance
 Exactly 900×900
 Correct logo version for the background, top-left, undistorted
 Headline in Nohemi stack, tight, two-tone where it helps
 Mood palette applied consistently (bg, text, CTA)
 CTA pill fully rounded, accent fill, white label (if used)
 Hero zone left clear in right / bottom-right (no placeholder drawn); photo direction stated in chat (or a code-drawn hero if explicitly requested)
 All text inside the safe margin
 Shown inline AND saved to outputs + presented
