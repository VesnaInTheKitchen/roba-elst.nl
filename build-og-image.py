"""Build a 1200x630 Open Graph image from assets/hero.jpg with headline + CTA baked in.

Run after editing the headline/CTA constants below, or after replacing hero.jpg.
Output: assets/og-image.jpg
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SRC = "assets/hero.jpg"
DST = "assets/og-image.jpg"

W, H = 1200, 630
HEADLINE = "Roba Bouwbedrijf Elst"
SUBLINE = "Verbouw · Renovatie · Badkamers · Huisliften"
CTA = "roba-elst.nl  ·  06-20 356 519"

# Fonts (macOS system)
FONT_BOLD = "/System/Library/Fonts/HelveticaNeue.ttc"  # index 1 = Bold
FONT_REG = "/System/Library/Fonts/HelveticaNeue.ttc"

# 1. Load hero, cover-fit to 1200x630
src = Image.open(SRC).convert("RGB")
sw, sh = src.size
scale = max(W / sw, H / sh)
nw, nh = int(sw * scale), int(sh * scale)
src = src.resize((nw, nh), Image.LANCZOS)
# Center crop
left = (nw - W) // 2
top = (nh - H) // 2
img = src.crop((left, top, left + W, top + H))

# 2. Darken + left-side gradient for legibility
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
# Solid darken
od.rectangle([0, 0, W, H], fill=(0, 0, 0, 90))
# Left gradient — stronger on the left where text sits
grad = Image.new("L", (W, 1), 0)
for x in range(W):
    t = x / W
    # 200 alpha at x=0, 0 at x≈0.7
    a = max(0, int(220 * (1 - t / 0.7)))
    grad.putpixel((x, 0), a)
grad = grad.resize((W, H))
black = Image.new("RGBA", (W, H), (0, 0, 0, 255))
black.putalpha(grad)
img = img.convert("RGBA")
img = Image.alpha_composite(img, overlay)
img = Image.alpha_composite(img, black)

# 3. Red accent bar
draw = ImageDraw.Draw(img)
draw.rectangle([60, 120, 70, 230], fill=(209, 43, 43, 255))

# 4. Text
try:
    f_head = ImageFont.truetype(FONT_BOLD, 78, index=1)
except Exception:
    f_head = ImageFont.truetype(FONT_BOLD, 78)
try:
    f_sub = ImageFont.truetype(FONT_REG, 34, index=0)
except Exception:
    f_sub = ImageFont.truetype(FONT_REG, 34)
try:
    f_cta = ImageFont.truetype(FONT_BOLD, 28, index=1)
except Exception:
    f_cta = ImageFont.truetype(FONT_BOLD, 28)

# Eyebrow label
draw.text((100, 110), "BOUWBEDRIJF · ELST", font=f_cta, fill=(209, 43, 43, 255))
# Headline
draw.text((98, 155), HEADLINE, font=f_head, fill=(245, 240, 232, 255))
# Subline
draw.text((100, 260), SUBLINE, font=f_sub, fill=(220, 215, 205, 255))

# CTA pill bottom-left
cta_x, cta_y = 100, 510
bbox = draw.textbbox((cta_x, cta_y), CTA, font=f_cta)
pad_x, pad_y = 22, 14
draw.rounded_rectangle(
    [bbox[0] - pad_x, bbox[1] - pad_y, bbox[2] + pad_x, bbox[3] + pad_y],
    radius=8,
    fill=(209, 43, 43, 255),
)
draw.text((cta_x, cta_y), CTA, font=f_cta, fill=(255, 255, 255, 255))

# 5. Save as JPG
img.convert("RGB").save(DST, "JPEG", quality=85, optimize=True, progressive=True)
print(f"Wrote {DST} ({W}x{H})")
