"""Build tiny, self-contained @font-face CSS for a ClearTax ad.
 
Subsets each font to ONLY the characters used in the ad, encodes as base64 woff2,
and returns a <style> block to drop into the SVG <defs>. Keeps ads ~15-25KB total
instead of ~450KB when embedding full weights.
 
Font files live under ../assets/Typography/ relative to this script, grouped by family:
  Typography/Nohemi/Nohemi-<Weight>.ttf   weights: Thin100 ExtraLight200 Light300 Regular400
                                 Medium500 SemiBold600 Bold700 ExtraBold800 Black900
  Typography/Gilroy/Gilroy-<Weight>.otf   weights: Thin100 UltraLight200 Light300 Regular400
                                 Medium500 Semibold600 Bold700 Extrabold800 Black900 Heavy900
 
The family sub-folder is inferred from the filename prefix (before the first "-"), so callers
still just pass the bare filename, e.g. "Nohemi-ExtraBold.ttf".
 
Usage (inline in a build script):
 
    from fontembed import face_style
    css = face_style([
        ("Nohemi", 800, "Nohemi-ExtraBold.ttf", "Malaysia is live.Is your ERP?"),
        ("Gilroy", 500, "Gilroy-Medium.otf",     "Mandatory e-invoicing has started."),
        ("Gilroy", 600, "Gilroy-Semibold.otf",   "See the mandate timeline"),
    ])
    # -> "<style>@font-face{...}@font-face{...}</style>"
 
Then reference the families by name in <text>:
    <text font-family="Nohemi" font-weight="800" ...>
"""
import base64
import io
import os
from fontTools import subset
 
FONT_ROOT = os.path.join(os.path.dirname(__file__), "..", "assets", "Typography")
 
 
def _resolve(filename: str) -> str:
    """Map a bare font filename to its family sub-folder under Typography/.
    e.g. 'Nohemi-ExtraBold.ttf' -> '<root>/Typography/Nohemi/Nohemi-ExtraBold.ttf'."""
    family_dir = filename.split("-", 1)[0]
    return os.path.join(FONT_ROOT, family_dir, filename)
 
 
def _subset_woff2(path: str, text: str) -> bytes:
    opts = subset.Options(flavor="woff2", desubroutinize=True)
    opts.drop_tables += ["TTFA"]  # silence ttfautohint-table warning
    font = subset.load_font(path, opts)
    s = subset.Subsetter(options=opts)
    # include the glyphs for the given text plus a space
    s.populate(text=text + " ")
    s.subset(font)
    buf = io.BytesIO()
    font.save(buf)
    return buf.getvalue()
 
 
def face(family: str, weight: int, filename: str, text: str, style: str = "normal") -> str:
    path = filename if os.path.isabs(filename) else _resolve(filename)
    data = _subset_woff2(path, text)
    b64 = base64.b64encode(data).decode()
    return (
        "@font-face{font-family:'%s';font-style:%s;font-weight:%d;"
        "src:url(data:font/woff2;base64,%s) format('woff2');}"
        % (family, style, weight, b64)
    )
 
 
def face_style(specs) -> str:
    """specs: list of (family, weight, filename, text[, style]) tuples."""
    return "<style>" + "".join(face(*spec) for spec in specs) + "</style>"
 
 
if __name__ == "__main__":
    # tiny self-test
    css = face_style([("Nohemi", 800, "Nohemi-ExtraBold.ttf", "Test 123")])
    print("bytes:", len(css))
