"""Rewrite content.ts fallbacks by marker slicing (avoids broken-regex issues)."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(r"c:/Users/Дмитрий/Documents/esteticfriend")
DATA = json.loads((ROOT / "scripts" / "catalog-from-site.json").read_text(encoding="utf-8"))
CONTENT = ROOT / "src" / "lib" / "content.ts"


def js_str(value: object) -> str:
    return json.dumps(value, ensure_ascii=False)


def replace_block(text: str, start_marker: str, end_marker: str, new_block: str) -> str:
    start = text.find(start_marker)
    if start < 0:
        raise SystemExit(f"start marker not found: {start_marker}")
    end = text.find(end_marker, start)
    if end < 0:
        raise SystemExit(f"end marker not found after {start_marker}: {end_marker}")
    return text[:start] + new_block + text[end:]


def main() -> None:
    text = CONTENT.read_text(encoding="utf-8")

    brands = DATA["brands"] or ["Lefis", "Soprano"]
    brands_ts = (
        "export const BRANDS = [\n"
        + ",\n".join(f"  {js_str(b)}" for b in brands)
        + ",\n] as const;\n"
    )

    cat_lines = []
    for c in DATA["categories"]:
        cat_lines.append(
            "  {\n"
            f"    id: {js_str(c['id'])},\n"
            f"    slug: {js_str(c['slug'])},\n"
            f"    name: {js_str(c['name'])},\n"
            f"    description: {js_str(c['description'])},\n"
            f"    sortOrder: {c['sortOrder']},\n"
            f"    _count: {{ products: {c['_count']['products']} }},\n"
            "  }"
        )
    cats_ts = (
        "export const FALLBACK_CATEGORIES: CategoryDTO[] = [\n"
        + ",\n".join(cat_lines)
        + ",\n];\n"
    )

    prod_lines = []
    for p in DATA["products"]:
        prod_lines.append(
            "  {\n"
            f"    id: {js_str(p['id'])},\n"
            f"    slug: {js_str(p['slug'])},\n"
            f"    name: {js_str(p['name'])},\n"
            f"    shortDesc: {js_str(p['shortDesc'])},\n"
            f"    description: {js_str(p.get('description') or '')},\n"
            f"    specs: {js_str(p.get('specs') or '')},\n"
            f"    kit: {js_str(p.get('kit') or '')},\n"
            f"    advantages: {js_str(p.get('advantages') or '')},\n"
            f"    imageUrl: {js_str(p['imageUrl'])},\n"
            "    price: null,\n"
            "    inStock: true,\n"
            "    isNew: true,\n"
            f"    isHit: {'true' if p['isHit'] else 'false'},\n"
            f"    categoryId: {js_str(p['categoryId'])},\n"
            "    category: {"
            f" id: {js_str(p['categoryId'])},"
            f" slug: {js_str(p['categorySlug'])},"
            f" name: {js_str(p['categoryName'])}"
            " },\n"
            "  }"
        )
    prods_ts = (
        "export const FALLBACK_PRODUCTS: ProductDTO[] = [\n"
        + ",\n".join(prod_lines)
        + ",\n];\n"
    )

    featured_ts = (
        'export const FEATURED_CATEGORY_SLUGS = '
        '["lazernaya-epilyaciya", "rf-lifting"] as const;\n'
    )

    # Replace from FALLBACK_CATEGORIES through FALLBACK_PRODUCTS (until MANAGERS)
    start = text.find("export const FALLBACK_CATEGORIES")
    end = text.find("export const MANAGERS")
    if start < 0 or end < 0:
        raise SystemExit("markers FALLBACK_CATEGORIES/MANAGERS not found")
    text = text[:start] + cats_ts + "\n" + prods_ts + "\n" + text[end:]

    # BRANDS near end
    bstart = text.find("export const BRANDS")
    if bstart < 0:
        text += "\n" + brands_ts
    else:
        # replace until EOF or next export
        bend = text.find("\nexport ", bstart + 1)
        if bend < 0:
            text = text[:bstart] + brands_ts
        else:
            text = text[:bstart] + brands_ts + text[bend + 1 :]

    fstart = text.find("export const FEATURED_CATEGORY_SLUGS")
    if fstart >= 0:
        fend = text.find("\nexport ", fstart + 1)
        if fend < 0:
            text = text[:fstart] + featured_ts
        else:
            text = text[:fstart] + featured_ts + text[fend + 1 :]

    by_slug = {p["slug"]: p["imageUrl"] for p in DATA["products"] if p["imageUrl"]}
    for old, key in [
        ("/products/soprano.webp", "soprano-titanium"),
        ("/products/rf-explore.webp", "rf-explore"),
        ("/products/h8.webp", "k18"),
        ("/products/kls-116.webp", "klsi-116"),
        ("/products/7d-hifu.webp", "soprano-titanium"),
        ("/products/mbt-340.webp", "k800"),
        ("/products/omegy.webp", "fg2000d"),
        ("/products/anchorfree-v8c2.webp", "k17"),
        ("/products/oxygen-aqua-jet-peel.webp", "h1-lefis"),
    ]:
        new = by_slug.get(key)
        if new:
            text = text.replace(old, new)

    CONTENT.write_text(text, encoding="utf-8")
    chunk = text[text.find("FALLBACK_PRODUCTS") : text.find("FALLBACK_PRODUCTS") + 350]
    print(chunk)
    print("OK broken?", "\n<p>" in chunk)


if __name__ == "__main__":
    main()
