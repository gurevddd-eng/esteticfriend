const { PrismaClient } = require("@prisma/client");

async function main() {
  const p = new PrismaClient();
  const rows = await p.product.findMany({
    select: {
      slug: true,
      name: true,
      specs: true,
      kit: true,
      advantages: true,
      description: true,
    },
    orderBy: { slug: "asc" },
  });

  for (const r of rows) {
    let parsed = null;
    try {
      parsed = JSON.parse(r.specs || "");
    } catch {}
    console.log("====", r.slug);
    if (Array.isArray(parsed)) {
      console.log("spec rows:", parsed.length);
      for (const row of parsed) {
        console.log(" -", JSON.stringify(row.label), "=>", JSON.stringify(row.value));
      }
    } else {
      console.log("specs raw:", (r.specs || "").slice(0, 180));
    }
    console.log("kit?", Boolean((r.kit || "").trim()), "adv?", Boolean((r.advantages || "").trim()));
  }

  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
