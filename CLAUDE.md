# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this directory is

This is **not a software codebase** — it's Cleartax's marketing/design working directory (not a git repo at the root). It holds brand assets, decks, brochures, website mockups, and a small number of vendored tool repos used to *produce* that content. Most files are binary/media (PDF, PNG, JPG, MP4, fonts) with no build step. Treat requests here as content/design tasks unless they clearly target one of the code pockets below.

## Code pockets

### `B2B/New Page Template/` — Figma plugin (TypeScript)
The only hand-written buildable code in this tree. Source is `code.ts`, compiled to `code.js` (the file Figma actually loads — regenerate it after editing `code.ts`, don't hand-edit `code.js`).
```
npm install         # first time only
npm run build        # compile code.ts -> code.js
npm run watch         # recompile on save
npm run lint / lint:fix
```

### `html-presentation-templates/beautiful-html-templates/` — vendored repo (own `.git`)
A cloned library of 34 self-contained HTML slide-deck templates (`templates/<slug>/template.html` + sibling CSS/JS/assets), each described in the root `index.json` (mood, occasion, tone, best_for). **`AGENTS.md` is the operating manual** for using it — the required flow is: ask the user for occasion + mood → shortlist 3 templates from `index.json` → build a one-slide title preview of each and open them for the user to compare → clone the chosen template and adapt its slides, extending its existing design system for any layout it lacks (never mixing in a different template's visual language). Follow that doc rather than improvising when asked to build a deck from this library.

### `Skills/skills/` — vendored repo (own `.git`)
A clone of `anthropics/skills`, Anthropic's public Agent Skills examples/spec. Reference-only; treat as upstream, don't repurpose it as the place to add Cleartax-specific skills.

### `Deck/Prompt/fable-skill/` — vendored repo (own `.git`)
Contains the `fable-prompt` skill (`fable-prompt/SKILL.md`): an unknowns-first workflow (discover → brainstorm/prototype → interview → plan → implement → review) for turning a rough deck/prompt idea into a clarified plan before building. It asks one high-leverage question at a time and won't implement without an approved plan — follow that discipline if invoked via `/fable-prompt`.

Do not modify files inside these three vendored `.git` folders as if they were project source — they're pulled-in tools, not Cleartax deliverables. If Cleartax-specific customization is needed, do it in a sibling file/folder, not by patching the vendored source.

## Content structure

- `Design system/` — the Figma source (`Cleartax - Design System.fig`) plus exported design tokens as zips under `Variables/` (Primitives, Semantics, Typography, Spacing, Layout, Border, Components) and gradient backgrounds under `BG Archive/`. This is the source of truth for brand colors/type/spacing — check here before inventing new values for a mockup.
- `Clear website/<Country>/` (Global, UAE, Oman, Spain, Malaysia, Philippines, Germany, and the `Cleartax - revamp`) — per-market website work, typically holding a flow PDF, hero video/image assets, a moodboard, and sometimes raw `html/` mockups.
- `Fonts/` — Gilroy and Nohemi type families (otf/ttf/woff/woff2); `Assets/Fonts` duplicates a subset.
- `Deck/`, `Brochures/`, `Booth wall/`, `Testimonials/`, `UAE Report/`, `Clear India 2026/`, `Clear International 2026/` — campaign/output folders of finished or in-progress PDFs, decks, and image assets, generally organized by event/market rather than by asset type.
- `Assets/asset-design-system/`, `Assets/Reference/`, `Logo/`, `Deck/Logo/` — logo files and reusable brand asset references.

When asked to build a new brochure/deck/page mockup, pull typography and color values from `Design system/` and existing fonts from `Fonts/` rather than guessing, and look for a matching country/campaign folder before creating a new top-level one.
