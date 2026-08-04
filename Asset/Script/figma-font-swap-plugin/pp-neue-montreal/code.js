// Cleartax Font Swap — run this from Figma's desktop app (Plugins > Development)
// with the target file open. Swaps placeholder Poppins/Space Grotesk (heading)
// and Inter (body) text — used as stand-ins because the real fonts aren't
// loadable through the remote use_figma MCP session — to the real PP Neue
// Montreal Variable / PP Neue Montreal Text Variable fonts, which ARE loadable
// here because this plugin runs in your local Figma desktop session where the
// fonts are installed and synced.
//
// Both are variable fonts with named fvar instances (Regular, Medium, Semibold,
// Bold, etc., plus " Italic" variants) — Figma exposes each named instance as
// its own font-style, so no legacy per-weight family split is needed (unlike
// the old Nohemi files, which used one-off family names per weight).
const HEADING_FAMILY = 'PP Neue Montreal Variable';
const BODY_FAMILY = 'PP Neue Montreal Text Variable';

function norm(s) {
  return s.toLowerCase().replace(/[\s-]/g, '');
}

// Placeholder (family, style) -> target (family, weightKeyword)
const MAPPING = [
  [['Poppins', 'Bold'], [HEADING_FAMILY, 'Bold']],
  [['Poppins', 'SemiBold'], [HEADING_FAMILY, 'Semibold']],
  [['Poppins', 'Medium'], [HEADING_FAMILY, 'Medium']],
  [['Poppins', 'Regular'], [HEADING_FAMILY, 'Regular']],
  [['Poppins', 'ExtraBold'], [HEADING_FAMILY, 'Extrabold']],
  [['Space Grotesk', 'Bold'], [HEADING_FAMILY, 'Bold']],
  [['Space Grotesk', 'Medium'], [HEADING_FAMILY, 'Medium']],
  [['Space Grotesk', 'Regular'], [HEADING_FAMILY, 'Regular']],
  [['Space Grotesk', 'Light'], [HEADING_FAMILY, 'Light']],
  [['Inter', 'Regular'], [BODY_FAMILY, 'Regular']],
  [['Inter', 'Medium'], [BODY_FAMILY, 'Medium']],
  [['Inter', 'Semi Bold'], [BODY_FAMILY, 'Semibold']],
  [['Inter', 'Bold'], [BODY_FAMILY, 'Bold']],
  [['Inter', 'Extra Bold'], [BODY_FAMILY, 'Extrabold']],
  [['Inter', 'Medium Italic'], [BODY_FAMILY, 'Medium Italic']],
];

function findMapping(family, style) {
  return MAPPING.find(([[f, s]]) => f === family && norm(s) === norm(style));
}

function findRealFont(fonts, targetFamily, weightKeyword) {
  const want = norm(weightKeyword);
  const exact = fonts.find(f => norm(f.fontName.family) === norm(targetFamily) && norm(f.fontName.style) === want);
  if (exact) return exact.fontName;
  // Loose fallback: family starts with target and style fuzzy-contains the weight
  const loose = fonts.find(f => norm(f.fontName.family).startsWith(norm(targetFamily)) && norm(f.fontName.style).includes(want));
  if (loose) return loose.fontName;
  return null;
}

async function run() {
  const fonts = await figma.listAvailableFontsAsync();
  let changed = 0;
  let skipped = 0;
  const missing = new Set();
  const loadedCache = new Set();

  async function ensureLoaded(fontName) {
    const key = fontName.family + '::' + fontName.style;
    if (loadedCache.has(key)) return;
    await figma.loadFontAsync(fontName);
    loadedCache.add(key);
  }

  for (const page of figma.root.children) {
    await figma.setCurrentPageAsync(page);
    const textNodes = page.findAllWithCriteria({ types: ['TEXT'] });
    for (const node of textNodes) {
      let segments;
      try {
        segments = node.getStyledTextSegments(['fontName']);
      } catch (e) {
        continue;
      }
      for (const seg of segments) {
        const cur = seg.fontName;
        const mapping = findMapping(cur.family, cur.style);
        if (!mapping) { skipped++; continue; }
        const [, [targetFamily, weightKeyword]] = mapping;
        const targetFont = findRealFont(fonts, targetFamily, weightKeyword);
        if (!targetFont) {
          missing.add(targetFamily + ' ' + weightKeyword);
          skipped++;
          continue;
        }
        await ensureLoaded(cur);
        await ensureLoaded(targetFont);
        node.setRangeFontName(seg.start, seg.end, targetFont);
        changed++;
      }
    }
  }

  const parts = [`Font swap done: ${changed} text ranges updated`];
  if (skipped) parts.push(`${skipped} skipped`);
  if (missing.size) parts.push(`missing target fonts: ${[...missing].join(', ')}`);
  const msg = parts.join(' — ');
  console.log(msg);
  figma.notify(msg, { timeout: 8000 });
  figma.closePlugin();
}

run().catch((e) => {
  console.error(e);
  figma.notify('Font swap failed: ' + e.message, { error: true, timeout: 8000 });
  figma.closePlugin();
});
