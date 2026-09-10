from PIL import Image
from pathlib import Path
p=Path('public/assets')
for name in ['sushi','pho','drinks']:
 im=Image.open(p/f'{name}.webp')
 for size in [640,960]:
  small=im.copy();small.thumbnail((size,size));small.save(p/f'{name}-{size}.webp',quality=82)
im=Image.open(p/'logo.jpg');im.thumbnail((144,144));im.save(p/'logo-small.webp',quality=88)
