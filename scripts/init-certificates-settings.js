/**
 * Upsert certificates page SiteSetting defaults (safe, no wipe).
 */
const { PrismaClient } = require("@prisma/client");

const DEFAULTS = [
  ["certificatesKicker", "Документы"],
  ["certificatesTitle", "Сертификаты"],
  [
    "certificatesLead",
    "Сотрудничаем с проверенными заводами и поставляем оборудование, в качестве которого уверены. По запросу пришлём документы на интересующие аппараты.",
  ],
  [
    "certificatesDocs",
    JSON.stringify([
      "Сертификат соответствия",
      "Паспорт оборудования",
      "Инструкция",
      "Гарантийный талон",
    ]),
  ],
  ["certificatesFormTitle", "Запросить документы"],
  [
    "certificatesFormLead",
    "Укажите аппарат — пришлём доступные сертификаты и материалы.",
  ],
];

async function main() {
  const prisma = new PrismaClient();
  for (const [key, value] of DEFAULTS) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log("certificates settings ready");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
