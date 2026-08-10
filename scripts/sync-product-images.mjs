import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("public/products");
const SOURCE_DIR = path.resolve("scripts/product-sources");
const SIZE = 1200;
const PADDING = 88;
const BG = { r: 255, g: 242, b: 224 }; // --pearl

/** Priority-ordered sources per catalog slug: url or local filename. */
const CATALOG = {
  "rf-explore": ["local:rf-explore.png"],
  "anchorfree-v8c2": [
    "https://www.midis-centr.ru/assets/cache_image/resources/249/v8c2-midis-(1)_1280x0_29a.png",
  ],
  "mbt-340": ["local:mbt-340.jpg"],
  "oxygen-aqua-jet-peel": ["local:omegy.png"],
  soprano: ["local:soprano.png"],
  omegy: ["local:oxygen-aqua-jet-peel.png"],
  "kls-116": [
    "https://dlaser-company.ru/upload/iblock/7b0/ft6kaes8r3rulmiaju39ebxmnesrdiiu.jpg",
    "local:kls-116.png",
  ],
  "7d-hifu": ["local:7d-hifu.png"],
  h8: ["local:h8.png"],
};

async function loadSource(source) {
  if (source.startsWith("local:")) {
    return fs.readFile(path.join(SOURCE_DIR, source.slice(6)));
  }
  const res = await fetch(source, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.startsWith("image/")) throw new Error(`Unexpected content-type ${ct}`);
  return Buffer.from(await res.arrayBuffer());
}

async function normalize(input, outPath, { flip = false } = {}) {
  const inner = SIZE - PADDING * 2;
  let base = sharp(input).rotate();
  if (flip) base = base.flop();

  let trimmed = await base.toBuffer();
  for (const background of ["#ffffff", "#000000"]) {
    try {
      trimmed = await sharp(trimmed)
        .trim({ threshold: 14, background })
        .toBuffer();
    } catch {
      // try next background
    }
  }

  const processed = await sharp(trimmed)
    .resize({
      width: inner,
      height: inner,
      fit: "contain",
      background: BG,
    })
    .modulate({ saturation: 0.84, brightness: 1.03 })
    .extend({
      top: PADDING,
      bottom: PADDING,
      left: PADDING,
      right: PADDING,
      background: BG,
    })
    .webp({ quality: 88, effort: 5 })
    .toBuffer();

  await fs.writeFile(outPath, processed);
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const [slug, sources] of Object.entries(CATALOG)) {
    const outPath = path.join(OUT_DIR, `${slug}.webp`);
    let saved = false;

    for (const source of sources) {
      try {
        const buf = await loadSource(source);
        await normalize(buf, outPath, {
          flip: slug === "oxygen-aqua-jet-peel",
        });
        console.log(`OK ${slug} <= ${source}`);
        saved = true;
        break;
      } catch (err) {
        console.warn(`skip ${slug} ${source}: ${err.message}`);
      }
    }

    if (!saved) console.error(`FAILED ${slug}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
