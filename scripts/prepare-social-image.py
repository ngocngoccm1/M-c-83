"""Create compressed responsive copies and a JPEG for social crawlers from supplied photography."""
from pathlib import Path
from PIL import Image, ImageOps

assets = Path(__file__).resolve().parents[1] / 'public' / 'assets'
photo = Image.open(assets / 'sushi-gallery-02.webp').convert('RGB')
for width in (480, 640, 960, 1280):
    image = ImageOps.fit(photo, (width, round(width * 2 / 3)), Image.Resampling.LANCZOS, centering=(0.5, 0.57))
    image.save(assets / f'sushi-hero-{width}.webp', quality=76, method=6)
    image.save(assets / f'sushi-hero-{width}.avif', quality=48, speed=6)
ImageOps.fit(photo, (1200, 630), Image.Resampling.LANCZOS, centering=(0.5, 0.57)).save(assets / 'moc83-sushi-social.jpg', quality=83, optimize=True)
print('Prepared sushi hero and social sharing images from supplied restaurant photo.')
