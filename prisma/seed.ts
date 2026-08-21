import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";
import {
  ADVANTAGES,
  BRANDS,
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  FAQ_ITEMS,
  HERO_SLIDES,
  PROMOS,
  SITE,
} from "../src/lib/content";
import { DEFAULT_CONTACT_WIDGET } from "../src/lib/contact-widget";
import { PRODUCT_COMPARE_AT_META } from "../src/lib/product-sort";
import {
  deserializeSpecs,
  serializeSpecs,
} from "../src/lib/product-sections";
import { slugify } from "../src/lib/slugify";

const prisma = new PrismaClient();

type ImportedPage = { slug: string; title: string; content: string };

function loadImportedPages(): ImportedPage[] {
  try {
    const raw = readFileSync(
      join(process.cwd(), "scripts", "pages-from-site.json"),
      "utf8",
    );
    return JSON.parse(raw) as ImportedPage[];
  } catch {
    return [];
  }
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@esteticfriend.local";
  const password = process.env.ADMIN_PASSWORD || "admin12345";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name: "Администратор" },
    create: { email, passwordHash, name: "Администратор" },
  });

  // Replace mock catalog with real products from САЙТ package.
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  const categoryIdMap = new Map<string, string>();

  for (const cat of FALLBACK_CATEGORIES) {
    const saved = await prisma.category.create({
      data: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });
    categoryIdMap.set(cat.id, saved.id);
  }

  const brandIdMap = new Map<string, string>();
  const wantedBrandSlugs = new Set(BRANDS.map((name) => slugify(name)));

  for (const [index, name] of BRANDS.entries()) {
    const slug = slugify(name);
    const saved = await prisma.brand.upsert({
      where: { slug },
      update: {
        name,
        sortOrder: index,
        isActive: true,
      },
      create: {
        slug,
        name,
        sortOrder: index,
        isActive: true,
      },
    });
    brandIdMap.set(name.toLowerCase(), saved.id);
  }

  // Hide brands that are no longer in the catalog package.
  await prisma.brand.updateMany({
    where: { slug: { notIn: [...wantedBrandSlugs] } },
    data: { isActive: false },
  });

  function detectBrandId(productName: string) {
    const lower = productName.toLowerCase();
    for (const name of BRANDS) {
      if (lower.includes(name.toLowerCase())) {
        return brandIdMap.get(name.toLowerCase()) ?? null;
      }
    }
    return null;
  }

  for (const product of FALLBACK_PRODUCTS) {
    const categoryId = categoryIdMap.get(product.categoryId);
    if (!categoryId) continue;

    const compareAtPrice = PRODUCT_COMPARE_AT_META[product.slug] ?? null;
    const brandId = detectBrandId(product.name);

    await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        shortDesc: product.shortDesc,
        description: product.description,
        specs: serializeSpecs(deserializeSpecs(product.specs || "")),
        kit: product.kit || "",
        advantages: product.advantages || "",
        imageUrl: product.imageUrl,
        price: product.price,
        compareAtPrice,
        inStock: product.inStock,
        isNew: product.isNew,
        isHit: product.isHit,
        isActive: true,
        categoryId,
        brandId,
      },
    });
  }

  const faqCount = await prisma.faqItem.count();
  if (faqCount === 0) {
    await prisma.faqItem.createMany({
      data: FAQ_ITEMS.map((item, index) => ({
        question: item.question,
        answer: item.answer,
        sortOrder: index,
        isActive: true,
      })),
    });
  }

  const advantageCount = await prisma.advantage.count();
  if (advantageCount === 0) {
    await prisma.advantage.createMany({
      data: ADVANTAGES.map((item, index) => ({
        title: item.title,
        text: item.text,
        sortOrder: index,
        isActive: true,
      })),
    });
  }

  for (const [index, promo] of PROMOS.entries()) {
    await prisma.promoBanner.upsert({
      where: { slug: promo.id },
      update: {
        eyebrow: promo.eyebrow,
        title: promo.title,
        text: promo.text,
        cta: promo.cta,
        href: promo.href,
        imageUrl: promo.imageUrl,
        tone: promo.tone,
        sortOrder: index,
        isActive: true,
      },
      create: {
        slug: promo.id,
        eyebrow: promo.eyebrow,
        title: promo.title,
        text: promo.text,
        cta: promo.cta,
        href: promo.href,
        imageUrl: promo.imageUrl,
        tone: promo.tone,
        sortOrder: index,
        isActive: true,
      },
    });
  }

  for (const [index, slide] of HERO_SLIDES.entries()) {
    await prisma.heroSlide.upsert({
      where: { slug: slide.id },
      update: {
        eyebrow: slide.eyebrow,
        title: slide.title,
        text: slide.text,
        note: slide.note,
        cta: slide.cta,
        href: slide.href,
        imageUrl: slide.imageUrl,
        tone: slide.tone,
        sortOrder: index,
        isActive: true,
      },
      create: {
        slug: slide.id,
        eyebrow: slide.eyebrow,
        title: slide.title,
        text: slide.text,
        note: slide.note,
        cta: slide.cta,
        href: slide.href,
        imageUrl: slide.imageUrl,
        tone: slide.tone,
        sortOrder: index,
        isActive: true,
      },
    });
  }

  const importedPages = loadImportedPages();
  const pages = [
    {
      slug: "delivery",
      title: "Доставка и оплата",
      content:
        "<p>Доставляем оборудование по России, Беларуси и Казахстану. Срок — от 1 до 40 дней.</p>",
    },
    {
      slug: "warranty",
      title: "Гарантия",
      content:
        "<p>На всё оборудование действует гарантия. Срок указан в гарантийном талоне. Также предоставляем постгарантийный ремонт.</p>",
    },
    {
      slug: "training",
      title: "Обучение",
      content:
        "<p>При покупке оборудования проводим обучение в подарок — очно или дистанционно. Можно пройти курс и без покупки аппарата.</p>",
    },
    {
      slug: "certificates",
      title: "Сертификаты",
      content:
        "<p>Сотрудничаем с проверенными заводами и поставляем оборудование, в качестве которого уверены. По запросу предоставим сертификаты и сопроводительные документы на интересующие аппараты.</p><ul><li>Сертификат соответствия</li><li>Паспорт оборудования</li><li>Инструкция</li><li>Гарантийный талон</li></ul>",
    },
    {
      slug: "privacy",
      title: "Политика конфиденциальности",
      content:
        "<p>Оставляя заявку на сайте SEVENS, вы соглашаетесь на обработку персональных данных (имя, телефон и иные сведения, указанные в форме) с целью обратной связи и подготовки коммерческого предложения.</p><p>Данные не передаются третьим лицам, за исключением случаев, предусмотренных законодательством, и используются только для связи по вашей заявке.</p>",
    },
    {
      slug: "terms",
      title: "Условия использования",
      content:
        "<p>Используя сайт, вы соглашаетесь с условиями оформления заявок и обработки персональных данных.</p><p>Информация об оборудовании на сайте носит справочный характер и уточняется менеджером при подготовке коммерческого предложения.</p>",
    },
  ];

  const pageBySlug = new Map(pages.map((page) => [page.slug, page]));
  for (const imported of importedPages) {
    pageBySlug.set(imported.slug, imported);
  }

  for (const page of pageBySlug.values()) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { title: page.title, content: page.content },
      create: page,
    });
  }

  const settings: Array<[string, string]> = [
    ["phone", SITE.phone],
    ["email", SITE.email],
    ["cities", SITE.cities],
    ["about", SITE.about],
    ["aboutExtra", SITE.aboutExtra],
    ["tagline", SITE.tagline],
    ["heroTitle", "Косметологические аппараты"],
    ["heroTitleLine", "для салонов красоты"],
    [
      "heroText",
      "Более 1000 специалистов уже работают на подобном оборудовании. Подберём аппарат под задачи вашего кабинета.",
    ],
    ["heroCtaPrimary", "Перейти в каталог"],
    ["heroCtaSecondary", "Получить консультацию"],
    ["brandsKicker", "Партнёры"],
    ["brandsTitle", "Письма о полномочиях"],
    [
      "brandsLead",
      "Работаем с проверенными заводами и по запросу предоставляем документы на оборудование.",
    ],
    ["brandsCta", "Смотреть сертификаты"],
    ["brandsCtaHref", "/certificates"],
    ["brandsSectionEnabled", "1"],
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
    ["faviconUrl", "/brand/favicon.svg"],
    ["contactWidget", JSON.stringify(DEFAULT_CONTACT_WIDGET)],
  ];

  for (const [key, value] of settings) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  console.log("Seed completed");
  console.log(`Admin: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
