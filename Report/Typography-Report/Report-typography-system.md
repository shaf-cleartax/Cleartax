# Report Typography System

A separate, report-only remapping of `Design system/Fonts/Typography style guide.pdf`, used exclusively for Cleartax **report** builds (e.g. the Oman Fawtara Reality Index 2026). It intentionally diverges from the default Typography Style Guide — do not apply this mapping to case studies, decks, brochures, or any other asset type.

All sizes below were confirmed directly against the official PDF (`Design system/Fonts/Typography style guide.pdf`), not invented, except the one row explicitly marked new.

## Font families

| Role group | Real Cleartax font | Figma MCP substitute (Nohemi/Gilroy/PPNeueMontreal not loadable there) |
|---|---|---|
| Display / Heading | PPNeueMontreal-Variable | Poppins |
| Paragraph / Label | PPNeueMontrealText-Variable | Inter |

## Role → Token map

| Report role | Maps to guide token | Size / Line-height | Weight |
|---|---|---|---|
| **Display** | Display / Semibold / Large | 52px / 56px | Semibold |
| **H1** | H3 / Medium / Mobile | 28px / 36px | Medium |
| **H2** | H4 / Medium / Mobile | 24px / 32px | Medium |
| **H3** | H5 / Medium / Mobile | 20px / 28px | Medium |
| **H4** | H6 / Medium / Mobile | 18px / 24px | Medium |
| **Paragraph / XX Small / Medium** *(new, report-only)* | — not in the guide — | 8px / 16px | Medium |

## What changed vs. the default system

- **Every Heading role shifts down two tiers**: H1 now renders at the guide's H3 size, H2 at H4, H3 at H5, H4 at H6. Report headings read visually smaller and quieter than the same role name in any other Cleartax asset.
- **Weight drops from Bold to Medium/Semibold** across Display and every Heading level. Report headlines are lighter-weight than the default Bold treatment.
- **A new "Paragraph / XX Small / Medium" tier (8px / 16px)** is added below the guide's smallest existing paragraph size (Paragraph/XSmall, 12px/20px). This size does not exist in the official PDF — it was created specifically for this report system per explicit request. The 16px line-height (a clean 2× multiple) was chosen for baseline legibility, since the guide sets no precedent to interpolate from at this size. Treat 8px as close to the practical legibility floor — reserve it for the smallest fine-print/footnote use only, never for anything a reader is meant to read comfortably.
- **Everything else is unchanged**: Paragraph/Large/Medium/Small, Overline, and the full Label family (Large/Medium/Small/XSmall) still follow the default Typography Style Guide exactly — this report system only overrides Display, H1–H4, and adds the one new XX Small row above.

## Quick reference (px, whole numbers only)

```
Display                          52 / 56   Semibold
H1                                28 / 36   Medium
H2                                24 / 32   Medium
H3                                20 / 28   Medium
H4                                18 / 24   Medium
Paragraph / XX Small / Medium     8 / 16   Medium   (new — report only)
```

See `Report-typography-chart.png` in this folder for a rendered visual specimen of every row above.
