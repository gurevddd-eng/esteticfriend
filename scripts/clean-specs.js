/**
 * Clean Product.specs: keep only real label/value pairs for each product.
 */
const { PrismaClient } = require("@prisma/client");

function cleanLabel(value) {
  return String(value || "")
    .replace(/^[-–—•*\s]+/, "")
    .replace(/[.;:\s]+$/g, "")
    .trim();
}

function cleanValue(value) {
  return String(value || "")
    .replace(/[;]+$/g, "")
    .trim();
}

function looksLikeSpecValue(value) {
  const words = String(value).split(/\s+/).filter(Boolean);
  if (words.length >= 3 && /^[а-яёa-z]/.test(value) && /[.!?]$/.test(value)) {
    return false;
  }
  return true;
}

function normalize(rows) {
  return (rows || [])
    .map((row) => ({
      label: cleanLabel(row.label),
      value: cleanValue(row.value),
    }))
    .filter((row) => {
      if (!row.label || !row.value) return false;
      if (row.label.length > 80) return false;
      if (/[.!?]$/.test(row.label)) return false;
      if (row.label.split(/\s+/).length > 6 && !/\d/.test(row.value)) return false;
      if (!looksLikeSpecValue(row.value)) return false;
      return true;
    });
}

function parsePlain(text) {
  const rows = [];
  for (const rawLine of String(text || "").replace(/\r/g, "").split("\n")) {
    let line = rawLine.trim();
    if (!line) continue;
    line = line
      .replace(/^[-–—•*]\s+/, "")
      .replace(/^\d+[.)]\s+/, "")
      .replace(/^•\s*/, "")
      .trim();
    if (!line) continue;
    if (line.length > 90 && !/[:：]/.test(line) && /[.!?]$/.test(line)) continue;

    const colon = line.match(/^(.+?)\s*[:：]\s+(.+)$/);
    if (colon) {
      rows.push({ label: colon[1], value: colon[2] });
      continue;
    }
    const dash = line.match(/^(.{2,60}?)\s+[–—]\s+(.+)$/);
    if (dash) {
      rows.push({ label: dash[1], value: dash[2] });
      continue;
    }
    const unitish = line.match(
      /^([A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9\s/()."«»-]{1,50}?)\s+(\d.*)$/u,
    );
    if (unitish) {
      rows.push({ label: unitish[1], value: unitish[2] });
    }
  }
  return normalize(rows);
}

async function main() {
  const prisma = new PrismaClient();
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, specs: true },
  });

  let updated = 0;
  for (const product of products) {
    const raw = (product.specs || "").trim();
    let rows = [];
    if (!raw) {
      continue;
    }
    if (raw.startsWith("[")) {
      try {
        rows = normalize(JSON.parse(raw));
      } catch {
        rows = parsePlain(raw);
      }
    } else {
      rows = parsePlain(raw);
    }

    const next = rows.length ? JSON.stringify(rows) : "";
    if (next === raw) continue;
    await prisma.product.update({
      where: { id: product.id },
      data: { specs: next },
    });
    updated += 1;
    console.log(product.slug, "=>", rows.length, "rows");
  }

  console.log("DONE updated", updated);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
