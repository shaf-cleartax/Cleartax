# Report Typography System

A separate, report-only remapping of `Design system/Fonts/Typography style guide.pdf`, used exclusively for Cleartax **report** builds (e.g. the Oman Fawtara Reality Index 2026). It intentionally diverges from the default Typography Style Guide — do not apply this mapping to case studies, decks, brochures, or any other asset type.

All sizes below were confirmed directly against the official PDF (`Design system/Fonts/Typography style guide.pdf`), not invented, except the one row explicitly marked new.

## Font families

| Role group | Real Cleartax font | Figma MCP substitute (Nohemi/Gilroy/PPNeueMontreal not loadable there) |
|---|---|---|
| Display / Heading (Display, H1, H2) | PPNeueMontreal-Variable | Poppins |
| Paragraph / Label (H3, H4, Paragraph/XX Small) | PPNeueMontrealText-Variable | Inter |

**H3 and H4 are the exception to "Heading roles use the Display font":** they've been remapped onto the **Label** family/scale, not the Heading scale, so they render in Inter (PPNeueMontrealText), not Poppins. Weight for both was defaulted to **Medium** (the guide token names the size tier "Medium"/"Small" separately from a Medium/Semi Bold weight choice within each) — flag if Semi Bold was actually intended.

## Role → Token map

| Report role | Maps to guide token | Size / Line-height | Weight |
|---|---|---|---|
| **Display** | Display / Semibold / Large | 52px / 56px | Semibold |
| **H1** | H3 / Semibold / Mobile | 28px / 36px | Semibold |
| **H2** | H6 / Semibold / Mobile | 18px / 24px | Semibold |
| **H3** | Label / Medium / Medium | 14px / 16px | Medium |
| **H4** | Label / Small / Medium | 12px / 14px | Medium |
| **Paragraph** *(merged, report-only)* | Paragraph/Small + XX Small merged | 8px / 12px | Medium |

## What changed vs. the default system

- **H1 and H2 stay in the Heading family, shifted down tiers**: H1 renders at the guide's H3 size (28px/36px, Semibold), H2 at H6/Semibold (18px/24px). Report headings read visually smaller than the same role name in any other Cleartax asset, though H1 keeps Semibold weight rather than dropping all the way to Medium.
- **H3 and H4 drop out of the Heading family entirely and onto the Label scale**: H3 = Label/Medium (14px/16px), H4 = Label/Small (12px/14px). This is a font-family change, not just a size change — H3/H4 now render in Inter (PPNeueMontrealText) instead of Poppins (PPNeueMontreal). At these sizes they read closer to a bold caption/label than a heading.
- **Weight drops from Bold to Medium/Semibold** across every role that still uses the Heading family (Display, H1, H2). Report headlines are lighter-weight than the default Bold treatment used elsewhere.
- **All body copy is one merged "Paragraph" role at 8px / 12px, Medium** — the earlier two-step process (override Paragraph/Small to 8px for print, then add a separate new XX Small tier at 8px/12px) collapsed into a single style once both landed on the same 8px size. There is no more a "Small" vs "XX Small" distinction in this report system — every plain body paragraph uses this one role. Reserve it for body copy only; it is close to the practical legibility floor for print.
- **Everything else is unchanged**: Paragraph/Large/Medium, Overline, and the Label family used directly (Large/Medium/Small/XSmall) still follow the default Typography Style Guide exactly — this report system overrides Display, H1–H4, and replaces Paragraph/Small with the merged Paragraph role above.

## Quick reference (px, whole numbers only)

```
Display                          52 / 56   Semibold   (Poppins)
H1                                28 / 36   Semibold   (Poppins)
H2                                18 / 24   Semibold   (Poppins)
H3                                14 / 16   Medium     (Inter — Label/Medium)
H4                                12 / 14   Medium     (Inter — Label/Small)
Paragraph                         8 / 12   Medium      (Inter, merged Small + XX Small)
```

## Figma text styles

Named text styles exist in the report Figma file (`gnHY8v1oS8raXdaPM9pEKT`) and are applied directly to the corresponding nodes — not just documented here:

| Style name | Value | Applied to |
|---|---|---|
| `Report/Display` | Poppins Semibold 52/56 | Cover masthead |
| `Report/H1` | Poppins Semibold 28/36 | Cover stat numbers (4) + every page's primary blue heading (4) |
| `Report/H2` | Poppins Semibold 18/24 | Page 2's "A Note Before You Read This" |
| `Report/H3` | Inter Medium 14/16 | Created, not yet used on any current page — reserved for a future smaller heading |
| `Report/Paragraph` | Inter Medium 8/12 | Every plain body paragraph across all 5 pages (7 nodes) |

H4 has no Figma style yet (not requested, not used in current content).
