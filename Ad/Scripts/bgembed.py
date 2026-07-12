"""Embed one of the bundled gradient backgrounds into an ad SVG.
 
Returns an <image> element (base64 JPEG) that covers the full canvas (default 900x900).
Backgrounds live in ../assets/backgrounds/gradient/<name>.jpg (square, scaled to fit the canvas).
 
See assets/backgrounds/INDEX.md for the full list of background names plus the
recommended logo colour, text treatment, and whether a left scrim is needed.
 
Usage:
    from bgembed import background_image, left_scrim
    img = background_image("light-beam")   # -> '<image .../>'
    # optionally add a legibility scrim behind left-aligned text:
    scrim = left_scrim()                    # dark left-to-transparent overlay
    svg = f'<svg ...><defs>...</defs>{img}{scrim}<text>...'
"""
import base64
import os
 
BG_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "backgrounds", "gradient")
 
 
def background_image(name: str, size: int = 900) -> str:
    path = os.path.join(BG_DIR, name + ".jpg")
    b64 = base64.b64encode(open(path, "rb").read()).decode()
    return (
        '<image x="0" y="0" width="%d" height="%d" '
        'preserveAspectRatio="xMidYMid slice" '
        'href="data:image/jpeg;base64,%s"/>' % (size, size, b64)
    )
 
 
def left_scrim(opacity: float = 0.45, size: int = 900) -> str:
    """Dark gradient from left edge fading to transparent — improves text contrast
    over busier / lighter backgrounds. Drop the <linearGradient> into <defs> and the
    <rect> onto the canvas (after the background image, before the text)."""
    return (
        '<defs><linearGradient id="scrim" x1="0%" y1="0%" x2="100%" y2="0%">'
        '<stop offset="0%" stop-color="#000000" stop-opacity="%.2f"/>'
        '<stop offset="55%" stop-color="#000000" stop-opacity="0"/>'
        '</linearGradient></defs>'
        '<rect x="0" y="0" width="%d" height="%d" fill="url(#scrim)"/>' % (opacity, size, size)
    )
