from pathlib import Path
import json,re
p=Path('src/menu.json'); sections=json.loads(p.read_text(encoding='utf-8'))
for section in sections:
 blocks=[]
 for line in section['lines']:
  ishead=bool(re.match(r'^(\d{1,3}\s*\.|Menu\s+\d|Set\s+\d)',line))
  if section['title'].startswith('Kleine Suppen'): ishead=line.startswith(('Miso suppe','Tom Kha Gai','Tom Yum','Glasnudelsuppe','Wan Tan suppe'))
  if line.startswith('Xào Sốt Thái'): ishead=True
  if ishead or not blocks: blocks.append([])
  blocks[-1].append(line)
 section['blocks']=blocks
p.write_text(json.dumps(sections,ensure_ascii=False,indent=2),encoding='utf-8')
print('Grouped menu into',sum(len(s['blocks']) for s in sections),'blocks')
