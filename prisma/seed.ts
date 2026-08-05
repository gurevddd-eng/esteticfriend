import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
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

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@esteticfriend.local";
  const password = process.env.ADMIN_PASSWORD || "admin12345";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name: "Администратор" },
    create: { email, passwordHash, name: "Администратор" },
  });

  const categoryIdMap = new Map<string, string>();

  for (const cat of FALLBACK_CATEGORIES) {
    const saved = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });
    categoryIdMap.set(cat.id, saved.id);
  }

  for (const product of FALLBACK_PRODUCTS) {
    const categoryId = categoryIdMap.get(product.categoryId);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDesc: product.shortDesc,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        inStock: product.inStock,
        isNew: product.isNew,
        isHit: product.isHit,
        isActive: true,
        categoryId,
      },
      create: {
        slug: product.slug,
        name: product.name,
        shortDesc: product.shortDesc,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        inStock: product.inStock,
        isNew: product.isNew,
        isHit: product.isHit,
        isActive: true,
        categoryId,
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

  const brandCount = await prisma.brand.count();
  if (brandCount === 0) {
    await prisma.brand.createMany({
      data: BRANDS.map((name, index) => ({
        name,
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

  const pages = [
    {
      slug: "delivery",
      title: "Доставка и оплата",
      content:
        "<p>Доставляем оборудование по всей России, в Республику Беларусь, Казахстан и Китай.</p><p>Офисы в Москве и Санкт-Петербурге — можно согласовать самовывоз.</p><p>Условия оплаты и сроки поставки уточняются менеджером.</p>",
    },
    {
      slug: "warranty",
      title: "Гарантия",
      content:
        "<p>Предоставляем гарантийный и постгарантийный ремонт оборудования.</p><p>Условия гарантии зависят от конкретного аппарата и уточняются при покупке.</p>",
    },
    {
      slug: "training",
      title: "Обучение",
      content:
        "<p>При покупке аппарата проводим бесплатное сертифицированное обучение аппаратным методикам.</p>",
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
        "<p>Оставляя заявку на сайте ESTETIC FRIEND, вы соглашаетесь на обработку персональных данных (имя, телефон и иные сведения, указанные в форме) с целью обратной связи и подготовки коммерческого предложения.</p><p>Данные не передаются третьим лицам, за исключением случаев, предусмотренных законодательством, и используются только для связи по вашей заявке.</p>",
    },
    {
      slug: "terms",
      title: "Условия использования",
      content:
        "<p>Используя сайт, вы соглашаетесь с условиями оформления заявок и обработки персональных данных.</p><p>Информация об оборудовании на сайте носит справочный характер и уточняется менеджером при подготовке коммерческого предложения.</p>",
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
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
