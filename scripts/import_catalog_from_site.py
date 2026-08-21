"""Import products/categories from Downloads/САЙТ into JSON + webp uploads."""

from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from PIL import Image

DOWNLOADS = Path(r"c:/Users/Дмитрий/Downloads")
OUT_ROOT = Path(r"c:/Users/Дмитрий/Documents/esteticfriend")
IMG_OUT = OUT_ROOT / "public" / "uploads" / "products"
JSON_OUT = OUT_ROOT / "scripts" / "catalog-from-site.json"

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff"}

SECTION_HEADS = {
    "описание",
    "принцип действия",
    "принцип работы",
    "особенности аппарата",
    "отличительные особенности",
    "технические характеристики",
    "комплектация",
    "показания к процедуре",
    "показания",
    "преимущества",
    "основные преимущества",
    "характеристики насадок",
    "особенности игл",
}


def find_site_root() -> Path:
    root = next(p for p in DOWNLOADS.iterdir() if p.is_dir() and "СА" in p.name)
    children = [p for p in root.iterdir() if p.is_dir()]
    return children[0] if len(children) == 1 else root


def slugify(text: str) -> str:
    mapping = {
        "а": "a",
        "б": "b",
        "в": "v",
        "г": "g",
        "д": "d",
        "е": "e",
        "ё": "e",
        "ж": "zh",
        "з": "z",
        "и": "i",
        "й": "y",
        "к": "k",
        "л": "l",
        "м": "m",
        "н": "n",
        "о": "o",
        "п": "p",
        "р": "r",
        "с": "s",
        "т": "t",
        "у": "u",
        "ф": "f",
        "х": "h",
        "ц": "ts",
        "ч": "ch",
        "ш": "sh",
        "щ": "sch",
        "ъ": "",
        "ы": "y",
        "ь": "",
        "э": "e",
        "ю": "yu",
        "я": "ya",
        "+": "plus",
    }
    s = "".join(mapping.get(ch, ch) for ch in text.lower())
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return re.sub(r"-+", "-", s).strip("-")


def docx_paras(path: Path) -> list[str]:
    with zipfile.ZipFile(path) as zf:
        xml = zf.read("word/document.xml")
    root = ET.fromstring(xml)
    paras: list[str] = []
    for p in root.iter(f"{W}p"):
        texts = [t.text or "" for t in p.iter(f"{W}t")]
        line = re.sub(r"\s+", " ", "".join(texts)).strip()
        if line:
            paras.append(line)
    return paras


def clean_name(folder: str) -> str:
    name = re.sub(r"\s+", " ", folder.strip())
    name = re.sub(r"\(([^)]+)\)", r" (\1)", name)
    name = name.replace("KLSI - 116", "KLSI-116")
    name = name.replace("K18PRO", "K18 PRO")
    return name.strip()


def pick_short(paras: list[str]) -> str:
    for i, p in enumerate(paras):
        low = p.lower()
        if low.startswith("описание") and i + 1 < len(paras):
            nxt = paras[i + 1]
            if len(nxt) > 40 and not nxt.lower().startswith(
                ("особенности", "техническ", "комплектац", "принцип")
            ):
                return (nxt[:220].rstrip(" .") + ".") if not nxt.endswith(".") else nxt[:221]
            rest = p[8:].strip(" -—:")
            if len(rest) > 40:
                return (rest[:220].rstrip(" .") + ".") if not rest.endswith(".") else rest[:221]
    for p in paras:
        low = p.lower()
        if low.startswith(
            (
                "техническ",
                "комплектац",
                "особенности",
                "показан",
                "преимуществ",
                "характеристик",
            )
        ):
            continue
        if len(p) >= 60:
            return (p[:220].rstrip(" .") + ".") if not p.endswith(".") else p[:221]
    base = paras[0] if paras else "Профессиональное косметологическое оборудование."
    return base[:220]


def to_html(paras: list[str]) -> str:
    blocks: list[str] = []
    buf: list[str] = []
    current_title: str | None = None

    def flush(title: str | None = None) -> None:
        nonlocal buf
        if not buf and not title:
            return
        if title:
            blocks.append(f"<h3>{title}</h3>")
        if buf and len(buf) >= 2 and all(
            re.match(r"^[-–—•]|\d+\.", x) or len(x) < 90 for x in buf
        ):
            items = "".join(
                f"<li>{re.sub(r'^[-–—•]\s*', '', x)}</li>" for x in buf
            )
            blocks.append(f"<ul>{items}</ul>")
        else:
            for x in buf:
                blocks.append(f"<p>{x}</p>")
        buf = []

    for p in paras:
        key = p.lower().rstrip(":")
        if key in SECTION_HEADS or (
            len(p) < 45 and any(key.startswith(h) for h in SECTION_HEADS)
        ):
            flush(current_title)
            current_title = p.rstrip(":")
            if key.startswith("описание") and len(p) > 20:
                rest = re.sub(r"^описание\s*[-—:]?\s*", "", p, flags=re.I).strip()
                if rest:
                    buf.append(rest)
                    flush(current_title)
                    current_title = None
            continue
        if key.startswith("описание") and len(p) > 20:
            flush(current_title)
            current_title = "Описание"
            rest = re.sub(r"^описание\s*[-—:]?\s*", "", p, flags=re.I).strip()
            if rest:
                buf.append(rest)
            continue
        buf.append(p)
    flush(current_title)
    return "\n".join(blocks) if blocks else "<p>Описание уточняется у менеджера.</p>"


def convert_image(src: Path, dest: Path, max_side: int = 1600) -> bool:
    try:
        im = Image.open(src).convert("RGB")
        w, h = im.size
        scale = min(1.0, max_side / max(w, h))
        if scale < 1:
            im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
        dest.parent.mkdir(parents=True, exist_ok=True)
        im.save(dest, "WEBP", quality=82, method=6)
        return True
    except Exception as exc:  # noqa: BLE001
        print("IMG FAIL", src, exc)
        return False


def score_image(path: Path) -> int:
    size = path.stat().st_size
    name = path.name.lower()
    score = 0
    if path.suffix.lower() in {".jpg", ".jpeg"}:
        score += 20
    if "screenshot" in name:
        score -= 50
    if "mmexport" in name and size > 5_000_000:
        score -= 10
    if 30_000 < size < 2_500_000:
        score += 30
    elif size >= 2_500_000:
        score += 5
    else:
        score += 10
    if re.match(r"^\d", path.name):
        score += 15
    if "img_" in name:
        score += 15
    return score


def main() -> None:
    site = find_site_root()
    IMG_OUT.mkdir(parents=True, exist_ok=True)

    categories: list[dict] = []
    products: list[dict] = []
    pages: list[dict] = []
    brands: set[str] = set()

    cat_dirs = sorted([p for p in site.iterdir() if p.is_dir()], key=lambda p: p.name)
    for ci, cat_dir in enumerate(cat_dirs):
        if cat_dir.name == "Документы":
            for doc in cat_dir.glob("*.docx"):
                paras = docx_paras(doc)
                title = doc.stem
                slug_map = {
                    "гарантия": ("warranty", "Гарантия"),
                    "доставка": ("delivery", "Доставка и оплата"),
                    "обучение": ("training", "Обучение"),
                }
                mapped = None
                low = title.lower()
                for key, value in slug_map.items():
                    if key in low:
                        mapped = value
                        break
                if not mapped:
                    mapped = (slugify(title), title)
                pages.append(
                    {
                        "slug": mapped[0],
                        "title": mapped[1],
                        "content": to_html(paras),
                    }
                )
            continue

        raw_slug = slugify(cat_dir.name)
        if "lazern" in raw_slug or "epilyac" in raw_slug:
            cat_slug = "lazernaya-epilyaciya"
            cat_name = "Лазерная эпиляция"
            cat_desc = "Диодные и гибридные лазеры для эпиляции"
        elif "rf" in raw_slug or "mikroigol" in raw_slug:
            cat_slug = "rf-lifting"
            cat_name = "Микроигольчатый RF-лифтинг"
            cat_desc = "Аппараты микроигольчатого RF-лифтинга"
        else:
            cat_slug = raw_slug
            cat_name = cat_dir.name
            cat_desc = cat_dir.name

        cat_id = f"c{ci + 1}"
        categories.append(
            {
                "id": cat_id,
                "slug": cat_slug,
                "name": cat_name,
                "description": cat_desc,
                "sortOrder": ci,
            }
        )

        prod_dirs = sorted(
            [p for p in cat_dir.iterdir() if p.is_dir()],
            key=lambda p: p.name.lower(),
        )
        for prod_dir in prod_dirs:
            name = clean_name(prod_dir.name)
            slug = slugify(name)
            docs = list(prod_dir.glob("*.docx"))
            paras = docx_paras(docs[0]) if docs else []
            short = (
                pick_short(paras)
                if paras
                else f"{name} — профессиональное оборудование для косметологии."
            )
            html = to_html(paras) if paras else f"<p>{short}</p>"

            brand = None
            blob = f"{name} {short}".lower()
            if "lefis" in blob:
                brand = "Lefis"
                brands.add("Lefis")
            if "soprano" in blob:
                brand = "Soprano"
                brands.add("Soprano")

            images = [
                f
                for f in prod_dir.iterdir()
                if f.is_file() and f.suffix.lower() in IMG_EXT
            ]
            images = sorted(images, key=score_image, reverse=True)
            dest_dir = IMG_OUT / slug
            if dest_dir.exists():
                for old in dest_dir.glob("*"):
                    old.unlink()
            saved_urls: list[str] = []
            for idx, src in enumerate(images[:8]):
                dest = dest_dir / f"{idx + 1}.webp"
                if convert_image(src, dest):
                    saved_urls.append(f"/uploads/products/{slug}/{idx + 1}.webp")

            is_hit = slug in {
                "soprano-titanium",
                "rf-explore",
                "k18",
                "k18-pro",
                "klsi-116",
                "k17",
                "fg2000d-plus",
            }
            products.append(
                {
                    "id": f"p{len(products) + 1}",
                    "slug": slug,
                    "name": name,
                    "shortDesc": short,
                    "description": html,
                    "imageUrl": saved_urls[0] if saved_urls else None,
                    "gallery": saved_urls,
                    "price": None,
                    "inStock": True,
                    "isNew": True,
                    "isHit": is_hit,
                    "categoryId": cat_id,
                    "categorySlug": cat_slug,
                    "categoryName": cat_name,
                    "brandName": brand,
                }
            )
            print("OK", cat_name, "->", name, "imgs", len(saved_urls), "hit", is_hit)

    by_slug = {p["slug"]: p for p in products}
    if (
        by_slug.get("k18-pro")
        and not by_slug["k18-pro"]["imageUrl"]
        and by_slug.get("k18", {}).get("imageUrl")
    ):
        donor = by_slug["k18"]
        by_slug["k18-pro"]["imageUrl"] = donor["imageUrl"]
        by_slug["k18-pro"]["gallery"] = donor["gallery"][:4]
        print("K18 PRO borrowed images from K18")

    counts: dict[str, int] = {}
    for p in products:
        counts[p["categoryId"]] = counts.get(p["categoryId"], 0) + 1
    for c in categories:
        c["_count"] = {"products": counts.get(c["id"], 0)}

    data = {
        "categories": categories,
        "products": products,
        "brands": sorted(brands),
        "pages": pages,
    }
    JSON_OUT.parent.mkdir(exist_ok=True)
    JSON_OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print("WROTE", JSON_OUT)
    print("categories", len(categories), "products", len(products), "pages", len(pages))


if __name__ == "__main__":
    main()
