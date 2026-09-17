from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SUSHI = ROOT / "sushi"
ASSETS = ROOT / "public" / "assets"
CONTACT = ROOT / "notes" / "sushi-contact-sheet.jpg"


def fit(image, size):
    image = image.convert("RGB")
    ratio = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.Resampling.LANCZOS)
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


files = sorted(SUSHI.glob("*.jpeg"))
thumb_w, thumb_h, label_h = 360, 250, 42
sheet = Image.new("RGB", (thumb_w * 3, (thumb_h + label_h) * 5), "#171612")
draw = ImageDraw.Draw(sheet)

for index, path in enumerate(files):
    image = Image.open(path)
    x = index % 3 * thumb_w
    y = index // 3 * (thumb_h + label_h)
    sheet.paste(fit(image, (thumb_w, thumb_h)), (x, y))
    draw.text((x + 12, y + thumb_h + 10), f"{index + 1:02d} · {path.name[-18:]}", fill="#f3ecdf")

CONTACT.parent.mkdir(exist_ok=True)
sheet.save(CONTACT, quality=88, optimize=True)

# The supplied pho image replaces every existing pho crop.
pho_source = Path(r"C:\Users\noc\AppData\Local\Temp\codex-clipboard-c9f19297-5468-4cc5-b5f5-2d7a81f6a1a4.png")
pho = Image.open(pho_source).convert("RGB")
for width, name in ((640, "pho-640.webp"), (960, "pho-960.webp"), (1254, "pho.webp")):
    height = round(pho.height * min(width, pho.width) / pho.width)
    out = pho.resize((min(width, pho.width), height), Image.Resampling.LANCZOS)
    out.save(ASSETS / name, "WEBP", quality=84, method=6)

# A compact set mixes generous platters with close details. The order follows
# the visual rhythm used by the landing-page gallery.
selected = [files[index] for index in (0, 3, 4, 6, 7, 9)]
for index, path in enumerate(selected, start=1):
    image = Image.open(path).convert("RGB")
    max_width = 1400
    if image.width > max_width:
        image = image.resize((max_width, round(image.height * max_width / image.width)), Image.Resampling.LANCZOS)
    image.save(ASSETS / f"sushi-gallery-{index:02d}.webp", "WEBP", quality=84, method=6)

print(f"Prepared contact sheet, {len(selected)} gallery images, and refreshed pho images")
