#!/usr/bin/env node
/**
 * Convert legacy plain-text Product.specs into JSON [{label,value}] rows.
 */
const { PrismaClient } = require("@prisma/client");

function parseSpecRows(text) {
  const rows = [];
  for (const rawLine of String(text || "").replace(/\r/g, "").split("\n")) {
    let line = rawLine.trim();
    if (!line) continue;
    line = line.replace(/^[-–—•*]\s+/, "").replace(/^\d+[.)]\s+/, "").trim();
    if (!line) continue;
    const split = line.match(/^(.+?)\s*[:：–—\-]\s+(.+)$/);
    if (split) {
      rows.push({ label: split[1].trim(), value: split[2].trim() });
      continue;
    }
    const spaced = line.match(/^(.{2,48}?)\s{2,}(.+)$/);
    if (spaced) {
      rows.push({ label: spaced[1].trim(), value: spaced[2].trim() });
      continue;
    }
    rows.push({ label: line, value: "" });
  }
  return rows;
}

async function main() {
  const prisma = new PrismaClient();
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, specs: true },
  });
  let updated = 0;
  for (const product of products) {
    const raw = (product.specs || "").trim();
    if (!raw) continue;
    if (raw.startsWith("[")) continue;
    const rows = parseSpecRows(raw);
    if (!rows.length) continue;
    await prisma.product.update({
      where: { id: product.id },
      data: { specs: JSON.stringify(rows) },
    });
    updated += 1;
    console.log("updated", product.slug, rows.length, "rows");
  }
  console.log("DONE", updated);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
