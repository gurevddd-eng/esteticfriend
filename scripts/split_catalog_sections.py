"""Split catalog-from-site.json HTML descriptions into plain-text sections."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(r"c:/Users/Дмитрий/Documents/esteticfriend")
JSON_PATH = ROOT / "scripts" / "catalog-from-site.json"

ALIASES = {
    "description": [
        "описание",
        "принцип действия",
        "принцип работы",
        "показания",
        "показания к процедуре",
    ],
    "specs": [
        "технические характеристики",
        "характеристики",
        "характеристики насадок",
        "особенности игл",
    ],
    "kit": ["комплектация"],
    "advantages": [
        "преимущества",
        "основные преимущества",
        "особенности аппарата",
        "отличительные особенности",
    ],
}


def strip_tags(html: str) -> str:
    html = re.sub(r"<\s*br\s*/?>", "\n", html, flags=re.I)
    html = re.sub(r"</\s*p\s*>", "\n", html, flags=re.I)
    html = re.sub(r"</\s*li\s*>", "\n", html, flags=re.I)
    html = re.sub(r"<\s*li[^>]*>", "- ", html, flags=re.I)
    html = re.sub(r"<[^>]+>", "", html)
    html = (
        html.replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .replace("&#39;", "'")
    )
    html = re.sub(r"[ \t]+\n", "\n", html)
    html = re.sub(r"\n{3,}", "\n\n", html)
    return html.strip()


def match_section(title: str) -> str:
    key = re.sub(r"[:.]", "", title.lower()).strip()
    for section, aliases in ALIASES.items():
        if any(key == a or key.startswith(a) for a in aliases):
            return section
    return "description"


def split_sections(raw: str) -> dict[str, str]:
    buckets = {"description": "", "specs": "", "kit": "", "advantages": ""}
    if not raw.strip():
        return buckets
    if not re.search(r"<\s*h3", raw, flags=re.I):
        buckets["description"] = strip_tags(raw)
        return buckets

    parts = re.split(r"<\s*h3[^>]*>", raw, flags=re.I)
    preface = strip_tags(parts[0] or "")
    if preface:
        buckets["description"] = preface

    for chunk in parts[1:]:
        m = re.search(r"(.*?)<\s*/\s*h3\s*>", chunk, flags=re.I | re.S)
        if not m:
            continue
        title = strip_tags(m.group(1))
        body = strip_tags(chunk[m.end() :])
        section = match_section(title)
        buckets[section] = "\n\n".join(x for x in [buckets[section], body] if x)

    if not any(buckets.values()):
        buckets["description"] = strip_tags(raw)
    return buckets


def main() -> None:
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    for product in data["products"]:
        sections = split_sections(product.get("description") or "")
        product["description"] = sections["description"]
        product["specs"] = sections["specs"]
        product["kit"] = sections["kit"]
        product["advantages"] = sections["advantages"]
        print(
            product["slug"],
            "desc",
            len(sections["description"]),
            "specs",
            len(sections["specs"]),
            "kit",
            len(sections["kit"]),
            "adv",
            len(sections["advantages"]),
        )
    JSON_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print("updated", JSON_PATH)


if __name__ == "__main__":
    main()
