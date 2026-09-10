from PIL import Image
from pathlib import Path
import json,re
root=Path.cwd()
imgs=Path(r'C:\Users\noc\.codex\generated_images\01a08b6b-b49a-72a2-9563-76bad57c2d92')
for file,name in [('exec-f42676e1-91a9-49d8-8fcd-5ec8c0b34efe.png','sushi'),('exec-dddf1af0-90a9-4b54-bcae-73b5004f54fa.png','pho'),('exec-03163828-05a1-4c6c-b496-5190ed28593c.png','drinks')]:
 im=Image.open(imgs/file).convert('RGB'); im.save(root/'public'/'assets'/f'{name}.webp',quality=87)
text=(root/'notes'/'Menu4.txt').read_text(encoding='utf-8-sig')
heads=['Kleine Suppen / Small Soups','Salate','Vorspeisen','Hauptgerichte','Kids Menu ( Nur Für Kinder)','Nachtisch','BEILAGEN','Nigiri ( je 1 Stück)','Vegetarische Maki ( 6 Stück)','Maki ( 6 Stück)','Inside –Out ( 8 Stück)','Sushi Spezial Rollen ( 4 Stück)','Futo Maki (5 Stück)','Sashimi','Gebackene Rolle ( 6 Stück)','Sushi Menüs','Softdrinks','Juices','Homemade Drinks','Lassi','Tea','COFFE','Non- alkoholische  DRINKS','Alkoholische Drinks','COCKTAILS','SPIRITOUSEN/ LIQUOR 2cl','BIER','WEISSWEIN','ROSÉ','ROTWEIN','Allergene und Zusatzstoffe']
sections=[]
for line in text.splitlines():
 line=line.strip().replace('—','-').replace('–','-')
 if not line: continue
 normalized=re.sub(r'\s+',' ',line)
 match=next((h for h in heads if normalized==re.sub(r'\s+',' ',h.replace('–','-')) or (h=='ROSÉ' and normalized.startswith('ROSÉ'))),None)
 if match:
  sections.append({'title':match.replace('–','-'),'lines':[]})
 elif sections and normalized!='Drinks':
  sections[-1]['lines'].append(re.sub(r'\s{3,}','  ',line))
(root/'src'/'menu.json').write_text(json.dumps(sections,ensure_ascii=False,indent=2),encoding='utf-8')
print('Menu sections:',len(sections))
print('Images:',[(p.name,p.stat().st_size) for p in (root/'public'/'assets').glob('*.webp')])
