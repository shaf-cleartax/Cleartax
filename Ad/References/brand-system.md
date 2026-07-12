ClearTax LinkedIn Ad — Brand System
Everything below is derived from three approved ClearTax LinkedIn ads. Follow it exactly
when building. Read this file in full before writing any ad markup.
Canvas

Size: 900 × 900 px (1:1). Always build the SVG at exactly this size (viewBox="0 0 900 900").
Safe margin: keep all logo, text, and CTA content inside a ~60px margin from every edge.
The gradient background fills the whole canvas; the hero photo occupies the reserved right /
bottom-right zone (see Hero).
Layout zones (900 canvas):

Logo: top-left, left edge at 60px, top edge ~54px. Size fixed at 217×49 (see Logo rules).
Headline block: left-aligned, starts ~200px from top.
Subhead: directly under headline, ~20–34px gap.
CTA pill (if used): below subhead, ~40px gap.
Hero photo: right third to right half, or bottom-right quadrant, kept clear of text.


Headline sizes below are given for the 900 canvas. If you ever need another size, scale all
values proportionally.

Logo rules

Files: assets/logo/logo-white.svg (for dark/gradient backgrounds) and
assets/logo/logo-black.svg (for light backgrounds).
Never recolor, stretch, add effects, or box the logo. Preserve aspect ratio.
Size: 217×49 px (source viewBox 218×50 → scale(0.995)), placed top-left at the 60px margin:
<g transform="translate(60,54) scale(0.995)">…logo paths…</g>.
Pick the version by background luminance: light bg → black logo; dark/saturated bg → white logo.

Typography

Headline font: Nohemi — heavy, tight, geometric. Weights 600–900. Use it big.
Body/subhead/CTA font: Gilroy — Medium (500) for subheads, SemiBold (600) for CTA labels.
The real font files ship with this skill under assets/Typography/ (grouped by family:
Typography/Nohemi/ and Typography/Gilroy/). Embed them — do NOT rely on
fallback stacks. Each build must be a self-contained SVG that renders correctly anywhere
(browser preview and Figma) with no local font install.
How to embed (use the bundled helper): scripts/fontembed.py subsets each font to only
the characters the ad uses, encodes as base64 woff2, and returns a ready <style> block. This
keeps a full ad ~15-30KB instead of ~450KB. Call it from a small build script:

python  import sys; sys.path.insert(0, "scripts")
  from fontembed import face_style
  style = face_style([
      ("Nohemi", 800, "Nohemi-ExtraBold.ttf", "<all headline text>"),
      ("Gilroy", 500, "Gilroy-Medium.otf",     "<all subhead text>"),
      ("Gilroy", 600, "Gilroy-Semibold.otf",   "<CTA label>"),
  ])
  # drop `style` into the SVG <defs>, then reference families by name:
  #   <text font-family="Nohemi" font-weight="800" ...>
Pass the EXACT text each weight renders (the subsetter only includes those glyphs). Embed only
the weights used.
Nohemi (TTF) weight → filename: Thin 100, ExtraLight 200, Light 300, Regular 400,
Medium 500, SemiBold 600, Bold 700, ExtraBold 800, Black 900 → Typography/Nohemi/Nohemi-<Name>.ttf.
Gilroy (OTF) weight → filename (note lowercase b): Thin 100, UltraLight 200, Light 300,
Regular 400, Medium 500, Semibold 600, Bold 700, Extrabold 800, Black/Heavy 900 →
Typography/Gilroy/Gilroy-<Name>.otf. Italics exist (-<Name>Italic.otf) but ads don't use them.
Ads use: Nohemi ExtraBold/Black for headlines; Gilroy Medium for subheads, Semibold for CTA.

Headline sizing: roughly 96–120px depending on length. Aim for 2–4 lines that fill the
upper-left. Tight leading (line-height ~0.98–1.05). Tight letter-spacing (~-0.02em).
Two-tone / two-weight headline is a signature move: split the headline so part is one
color/weight and part is another (e.g. white → light-blue, or navy → indigo). Use it often.
Subhead: ~36–44px, Gilroy Medium, line-height ~1.15.

Backgrounds — use the bundled gradients (preferred)
The skill ships a library of premium dark mesh gradients in assets/backgrounds/gradient/ (square JPEGs,
scaled to fill the canvas). Prefer these over flat CSS gradients — they give the ads their
polished look. Embed the chosen one with scripts/bgembed.py:
pythonimport sys; sys.path.insert(0, "scripts")
from bgembed import background_image, left_scrim
img   = background_image("light-beam")   # full-canvas <image> (default 900)
scrim = left_scrim(0.45)                  # optional dark left overlay for text contrast
# order inside <svg>: {img} then (optional) {scrim} then logo/headline/subhead/CTA
Pick from assets/backgrounds/INDEX.md. That file lists every background with its character
and computed defaults: which logo version to use, whether text should be white or a dark
(light-background) treatment, and whether to add a left_scrim(). Read it and follow the row for
your chosen background. Rules of thumb the index encodes:

Dark head-zone + scrim=no → cleanest white-text ads (e.g. crimson-flare, magenta-orb,
nightfall-blue, twilight-glow, verdant-night, deep-ocean, ember-sunset).
text=dark or logo=black rows have a light top-left → use the black logo and a navy/indigo
(Mood B) headline instead of white.
scrim=yes rows → add left_scrim() so the headline stays legible.

Match gradient to concept mood: urgency → crimson-flare/ember-sunset/amber-sweep;
aspirational → dusk-gold/twilight-cool-warm/sunset-rose; tech/product →
light-beam/magenta-orb/prism-beam/aurora-streak; clean/credibility →
violet-dawn/rose-cobalt. Always eyeball text legibility over the top-left and add a scrim if
marginal.
The three moods (A warm / B light / C dark) still describe the palette language for
headline/subhead/CTA colours; the gradients are the backgrounds that carry them.
Color moods (palette language for text + CTA)
Mood A — Warm / Aspirational (ref: "Oman")

Background: diagonal gradient magenta #B4295E → coral-orange #E1602C → violet #6E3FA6.
Text: white #FFFFFF, with a soft blush tint #FBE3E0 available for a second headline tone.
Use for: "big moment," country-opportunity, future-facing narratives.
Logo: white.

Mood B — Clean / Light (ref: "Six countries")

Background: near-white lavender #EFEBFB, optionally a very soft radial toward #E3DCFA.
Headline: deep navy #0E1A47 transitioning to royal indigo #4B3FD1 (top→bottom or word-by-word).
CTA pill: solid indigo #4B3FD1, white label.
Use for: product/coverage, credibility, feature-forward messages.
Logo: black.

Mood C — Dark / Tech (ref: "Belgium/Germany")

Background: deep navy #0A1633 (optionally a subtle darker vignette to corners).
Headline: light steel-blue #AFC7EE for the first part, pure white #FFFFFF for the emphasis part.
Subhead: light-blue #7FA8DC.
CTA pill: bright blue #1E6BFF, white label.
Use for: urgency, deadlines, "went live / is next," technical mandates.
Logo: white.

CTA pill

Fully rounded ends (border-radius = half the height). Height ~80px.
Horizontal padding ~54px. Label in Gilroy SemiBold ~34px.
Filled with the mood's accent color; label always white.
Left-aligned to the same left margin as the headline.

Hero visual — photographic (default)
Ads use a photographic hero image as the main visual (like the doorway/skyline and the
hourglass-on-circuit refs). These are shot or sourced, then composited in Figma — they can't be
generated in this environment. So the build leaves the hero area clear (background only) and
the user drops the real photo into that space in Figma:

Reserve the right third / right half or the bottom-right quadrant for the photo. Do NOT
draw a placeholder box, border, caption, or "HERO IMAGE" label — leave the zone empty so the
background (gradient/navy/lavender) simply shows through.
Keep all text (logo, headline, subhead, CTA) inside the left/upper area and clear of that
reserved zone, so nothing overlaps the photo once it's added.
State the intended photo direction (subject, setting, mood) in the chat response accompanying
the ad — not on the canvas.
Everything else is fully finished, so the only Figma work is dropping in the image.

If — and only if — the user explicitly asks for a non-photographic hero, code-drawable options
(3D-style world map with glowing nodes à la "Six countries", abstract networks, geometric fields)
can be built directly in SVG instead.
E-invoicing content guidance
Ads promote ClearTax e-invoicing across countries and drive product adoption. Concepts should
lean on: country go-live moments, multi-country coverage, compliance mandates/deadlines,
"one platform / one team" consolidation, and readiness ("Are you ready?"). CTAs are action-first
and specific: "Explore global e-invoicing," "Discover now," "See the mandate timeline," etc.
