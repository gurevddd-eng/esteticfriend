/**
 * Restore valid cooling/system rows removed by an over-strict filter.
 */
const { PrismaClient } = require("@prisma/client");

const PATCHES = {
  fg2000d: [
    { label: "Тип излучателя", value: "диодный" },
    { label: "Система охлаждения", value: "Макроканальная: вода+воздух+ТЕС" },
  ],
  k17: [{ label: "Система охлаждения", value: "вода + воздух + TEC + компрессор" }],
  k18: [
    {
      label: "Система охлаждения",
      value: "компрессор (фреоновый чиллер) + вода + TEC + воздушное охлаждение",
    },
  ],
  "k18-pro": [
    {
      label: "Система охлаждения",
      value: "компрессорный чиллер + вода + TEC + воздушное охлаждение",
    },
  ],
  k800: [{ label: "Система охлаждения", value: "вода + воздух + TEC + компрессор" }],
};

async function main() {
  const prisma = new PrismaClient();
  for (const [slug, extras] of Object.entries(PATCHES)) {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, specs: true },
    });
    if (!product) {
      console.log("skip missing", slug);
      continue;
    }
    let rows = [];
    try {
      rows = product.specs?.startsWith("[") ? JSON.parse(product.specs) : [];
    } catch {
      rows = [];
    }
    const byLabel = new Map(rows.map((r) => [String(r.label).trim().toLowerCase(), r]));
    for (const extra of extras) {
      byLabel.set(extra.label.toLowerCase(), extra);
    }
    const next = JSON.stringify([...byLabel.values()]);
    await prisma.product.update({
      where: { id: product.id },
      data: { specs: next },
    });
    console.log(slug, "=>", byLabel.size, "rows");
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
