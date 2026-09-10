from pathlib import Path
import zipfile,xml.etree.ElementTree as ET,json,re
root=Path.cwd(); w='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
with zipfile.ZipFile(root/'Menu4.docx') as z:
 doc=ET.fromstring(z.read('word/document.xml'))
 ps=[''.join((n.text or '') if n.tag==w+'t' else '  ' if n.tag==w+'tab' else '\n' if n.tag==w+'br' else '' for n in p.iter()) for p in doc.iter(w+'p')]
(root/'notes'/'Menu4.txt').write_text('\n'.join(ps),encoding='utf-8')
