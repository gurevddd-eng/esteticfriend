import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  FALLBACK_REVIEWS,
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

  for (const review of FALLBACK_REVIEWS) {
    const existing = await prisma.review.findFirst({
      where: { author: review.author, title: review.title },
    });
    if (existing) {
      await prisma.review.update({
        where: { id: existing.id },
        data: {
          age: review.age,
          text: review.text,
          sortOrder: review.sortOrder,
          isActive: true,
        },
      });
    } else {
      await prisma.review.create({
        data: {
          author: review.author,
          age: review.age,
          title: review.title,
          text: review.text,
          sortOrder: review.sortOrder,
          isActive: true,
        },
      });
    }
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
        "<p>Материалы сайта носят информационный характер и не являются публичной офертой. Актуальные цены, наличие и условия поставки уточняются у менеджера ESTETIC FRIEND.</p><p>Используя сайт, вы соглашаетесь с условиями оформления заявок и обработки персональных данных.</p>",
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { title: page.title, content: page.content },
      create: page,
    });
  }

  const settings: Array<[string, string]> = [
    ["name", SITE.name],
    ["tagline", SITE.tagline],
    ["phone", SITE.phone],
    ["email", SITE.email],
    ["cities", SITE.cities],
    ["about", SITE.about],
    ["aboutExtra", SITE.aboutExtra],
    [
      "footerText",
      "Профессиональное косметическое оборудование для салонов и клиник.",
    ],
  ];

  for (const [key, value] of settings) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  // Seed homepage JSON only if missing, so admin edits are preserved on re-seed
  const existingHome = await prisma.siteSetting.findUnique({
    where: { key: "homepage" },
  });
  if (!existingHome) {
    const { DEFAULT_HOMEPAGE } = await import("../src/lib/site");
    await prisma.siteSetting.create({
      data: { key: "homepage", value: JSON.stringify(DEFAULT_HOMEPAGE) },
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
