"""Patch content.ts FALLBACK_* from scripts/catalog-from-site.json."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(r"c:/Users/Дмитрий/Documents/esteticfriend")
DATA = json.loads((ROOT / "scripts" / "catalog-from-site.json").read_text(encoding="utf-8"))
CONTENT = ROOT / "src" / "lib" / "content.ts"


def esc(value: object) -> str:
    return json.dumps(value, ensure_ascii=False)


def main() -> None:
    text = CONTENT.read_text(encoding="utf-8")

    brands = DATA["brands"] or ["Lefis", "Soprano"]
    brands_ts = (
        "export const BRANDS = [\n"
        + ",\n".join(f"  {esc(b)}" for b in brands)
        + ",\n] as const;"
    )

    cats = []
    for c in DATA["categories"]:
        cats.append(
            "  {\n"
            f"    id: {esc(c['id'])},\n"
            f"    slug: {esc(c['slug'])},\n"
            f"    name: {esc(c['name'])},\n"
            f"    description: {esc(c['description'])},\n"
            f"    sortOrder: {c['sortOrder']},\n"
            f"    _count: {{ products: {c['_count']['products']} }},\n"
            "  }"
        )
    cats_ts = (
        "export const FALLBACK_CATEGORIES: CategoryDTO[] = [\n"
        + ",\n".join(cats)
        + ",\n];"
    )

    prods = []
    for p in DATA["products"]:
        is_hit = "true" if p["isHit"] else "false"
        prods.append(
            "  {\n"
            f"    id: {esc(p['id'])},\n"
            f"    slug: {esc(p['slug'])},\n"
            f"    name: {esc(p['name'])},\n"
            f"    shortDesc:\n      {esc(p['shortDesc'])},\n"
            f"    description:\n      {esc(p['description'])},\n"
            f"    imageUrl: {esc(p['imageUrl'])},\n"
            "    price: null,\n"
            "    inStock: true,\n"
            "    isNew: true,\n"
            f"    isHit: {is_hit},\n"
            f"    categoryId: {esc(p['categoryId'])},\n"
            "    category: {"
            f" id: {esc(p['categoryId'])},"
            f" slug: {esc(p['categorySlug'])},"
            f" name: {esc(p['categoryName'])}"
            " },\n"
            "  }"
        )
    prods_ts = (
        "export const FALLBACK_PRODUCTS: ProductDTO[] = [\n"
        + ",\n".join(prods)
        + ",\n];"
    )

    text = re.sub(
        r"export const BRANDS = \[[\s\S]*?\] as const;",
        brands_ts,
        text,
        count=1,
    )
    text = re.sub(
        r"export const FALLBACK_CATEGORIES: CategoryDTO\[\] = \[[\s\S]*?\];",
        cats_ts,
        text,
        count=1,
    )
    text = re.sub(
        r"export const FALLBACK_PRODUCTS: ProductDTO\[\] = \[[\s\S]*?\];",
        prods_ts,
        text,
        count=1,
    )

    by_slug = {p["slug"]: p["imageUrl"] for p in DATA["products"] if p["imageUrl"]}
    replacements = {
        "/products/soprano.webp": by_slug.get("soprano-titanium"),
        "/products/rf-explore.webp": by_slug.get("rf-explore"),
        "/products/h8.webp": by_slug.get("k18"),
        "/products/kls-116.webp": by_slug.get("klsi-116"),
        "/products/7d-hifu.webp": by_slug.get("soprano-titanium"),
        "/products/mbt-340.webp": by_slug.get("k800"),
        "/products/omegy.webp": by_slug.get("fg2000d"),
        "/products/anchorfree-v8c2.webp": by_slug.get("k17"),
        "/products/oxygen-aqua-jet-peel.webp": by_slug.get("h1-lefis"),
    }
    for old, new in replacements.items():
        if new:
            text = text.replace(old, new)

    CONTENT.write_text(text, encoding="utf-8")
    (ROOT / "scripts" / "pages-from-site.json").write_text(
        json.dumps(DATA["pages"], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print("Patched", CONTENT)


if __name__ == "__main__":
    main()
