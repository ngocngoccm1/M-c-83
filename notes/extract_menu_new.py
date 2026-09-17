from pathlib import Path
import json
import re

from docx import Document


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Menu-new.docx"
TARGET = ROOT / "src" / "menu.json"


SECTION_TITLES = {
    "Kleine Suppen / Small Soups",
    "Salate",
    "Vorspeisen",
    "Hauptgerichte",
    "Kids Menu ( Nur Für Kinder)",
    "Nachtisch",
    "BEILAGEN",
    "Nigiri ( je 1 Stück)",
    "Vegetarische Maki ( 6 Stück)",
    "Maki ( 6 Stück)",
    "Inside –Out ( 8 Stück)",
    "Sushi Spezial Rollen ( 4 Stück)",
    "Futo Maki (5 Stück)",
    "Sashimi",
    "Gebackene Rolle ( 6 Stück)",
    "Sushi Menüs",
    "Softdrinks",
    "Juices",
    "Homemade Drinks",
    "Lassi",
    "Tea",
    "COFFE",
    "Non- alkoholische DRINKS",
    "Alkoholische Drinks",
    "COCKTAILS",
    "SPIRITOUSEN/ LIQUOR 2cl",
    "BIER",
    "WEISSWEIN",
    "ROSÉ",
    "ROTWEIN",
    "Allergene und Zusatzstoffe",
}


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("\xa0", " ")).strip()


def rich_line(paragraph):
    chars = []
    for run in paragraph.runs:
        superscript = run.font.superscript is True
        for char in run.text.replace("\xa0", " "):
            chars.append((char, superscript and not char.isspace()))

    collapsed = []
    pending_space = False
    for char, superscript in chars:
        if char.isspace():
            pending_space = bool(collapsed)
            continue
        if pending_space:
            collapsed.append((" ", False))
            pending_space = False
        collapsed.append((char, superscript))

    parts = []
    for char, superscript in collapsed:
        if not parts or parts[-1]["sup"] != superscript:
            parts.append({"text": char, "sup": superscript})
        else:
            parts[-1]["text"] += char

    text = "".join(part["text"] for part in parts).strip()
    if not text:
        return None

    # Pull the final menu price away from the dish name. When two bare prices
    # finish a drinks row, keep them together as a compact price column.
    match = re.search(r"(?:\s|^)((?:\d{1,2}[,.]\d{1,2}\s+)?\d{1,2}[,.]\d{1,2})\s*$", text)
    price = match.group(1).replace(" ", " · ") if match else ""
    body = text[: match.start(1)].rstrip() if match else text

    body_parts = []
    remaining = len(body)
    for part in parts:
        if remaining <= 0:
            break
        snippet = part["text"][:remaining]
        if snippet:
            body_parts.append({"text": snippet, "sup": part["sup"]})
        remaining -= len(snippet)

    return {"text": text, "body": body, "price": price, "parts": body_parts}


def is_dish_heading(line, font_size):
    text = line["text"]
    return bool(
        font_size >= 18
        or re.match(r"^(?:\d{1,3}\s*\.|Menu\s+\d|Set\s+\d)", text, re.I)
        or text.startswith(("Miso suppe", "Tom Kha Gai", "Tom Yum", "Glasnudelsuppe", "Wan Tan suppe", "Xào Sốt Thái"))
    )


document = Document(SOURCE)
sections = []
current = None

for paragraph in document.paragraphs:
    plain = clean_text(paragraph.text)
    if not plain:
        continue

    if plain in SECTION_TITLES:
        current = {"title": plain, "lines": [], "blocks": []}
        sections.append(current)
        continue

    if current is None:
        continue

    line = rich_line(paragraph)
    if line is None:
        continue

    sizes = [run.font.size.pt for run in paragraph.runs if run.font.size]
    font_size = max(sizes, default=0)
    current["lines"].append(line["text"])
    if not current["blocks"] or is_dish_heading(line, font_size):
        current["blocks"].append([])
    current["blocks"][-1].append(line)

TARGET.write_text(json.dumps(sections, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Extracted {sum(len(section['lines']) for section in sections)} lines in {len(sections)} sections")
