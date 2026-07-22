import {
  ADVANTAGES,
  MANAGERS,
  PROMOS,
  SITE,
} from "@/lib/content";
import { getSettings } from "@/lib/catalog";

export type SiteConfig = {
  name: string;
  phone: string;
  phoneHref: string;
  email: string;
  cities: string;
  tagline: string;
  about: string;
  aboutExtra: string;
  footerText: string;
};

export type HomepageContent = {
  hero: {
    brand: string;
    title: string;
    text: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    videoSrc: string;
  };
  promos: Array<{ title: string; text: string; cta: string; href: string }>;
  hits: { kicker: string; title: string; ctaLabel: string };
  categories: { kicker: string; title: string; ctaLabel: string };
  managers: {
    kicker: string;
    title: string;
    items: Array<{ name: string; role: string }>;
  };
  advantages: {
    kicker: string;
    title: string;
    items: Array<{ title: string; text: string }>;
  };
  reviews: { kicker: string; title: string };
  consult: { kicker: string; title: string; text: string };
};

export const DEFAULT_HOMEPAGE: HomepageContent = {
  hero: {
    brand: SITE.name,
    title: "Косметологические аппараты для салонов красоты",
    text: "Более 1000 специалистов уже работают на подобном оборудовании. Подберём аппарат под задачи вашего кабинета.",
    primaryCtaLabel: "Перейти в каталог",
    primaryCtaHref: "/catalog",
    secondaryCtaLabel: "Получить консультацию",
    secondaryCtaHref: "/#consult",
    videoSrc: "/hero/main.mp4",
  },
  promos: PROMOS.map((p) => ({ ...p })),
  hits: {
    kicker: "Хиты продаж",
    title: "Популярное оборудование",
    ctaLabel: "Смотреть каталог",
  },
  categories: {
    kicker: "Категории аппаратов",
    title: "Направления каталога",
    ctaLabel: "Весь каталог",
  },
  managers: {
    kicker: "Команда",
    title: "Наши специалисты отдела продаж",
    items: MANAGERS.map((m) => ({ ...m })),
  },
  advantages: {
    kicker: "Преимущества компании",
    title: "Почему выбирают ESTETIC FRIEND",
    items: ADVANTAGES.map((a) => ({ ...a })),
  },
  reviews: {
    kicker: "Отзывы",
    title: "Отзывы наших клиентов",
  },
  consult: {
    kicker: "Свяжитесь с нами",
    title: "Оставьте заявку — подготовим подходящее предложение",
    text: "Наши менеджеры ответят в ближайшее время и помогут выбрать аппарат под задачи вашего салона или клиники.",
  },
};

export function phoneToHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "tel:";
  return digits.startsWith("8") && digits.length === 11
    ? `tel:+7${digits.slice(1)}`
    : `tel:+${digits}`;
}

export function mergeSiteConfig(settings: Record<string, string>): SiteConfig {
  const phone = settings.phone || SITE.phone;
  return {
    name: settings.name || SITE.name,
    phone,
    phoneHref: phoneToHref(phone),
    email: settings.email || SITE.email,
    cities: settings.cities || SITE.cities,
    tagline: settings.tagline || SITE.tagline,
    about: settings.about || SITE.about,
    aboutExtra: settings.aboutExtra || SITE.aboutExtra,
    footerText:
      settings.footerText ||
      "Профессиональное косметическое оборудование для салонов и клиник.",
  };
}

export function parseHomepage(raw?: string | null): HomepageContent {
  if (!raw) return structuredClone(DEFAULT_HOMEPAGE);
  try {
    const parsed = JSON.parse(raw) as Partial<HomepageContent>;
    return {
      hero: { ...DEFAULT_HOMEPAGE.hero, ...parsed.hero },
      promos:
        Array.isArray(parsed.promos) && parsed.promos.length > 0
          ? parsed.promos
          : DEFAULT_HOMEPAGE.promos,
      hits: { ...DEFAULT_HOMEPAGE.hits, ...parsed.hits },
      categories: { ...DEFAULT_HOMEPAGE.categories, ...parsed.categories },
      managers: {
        ...DEFAULT_HOMEPAGE.managers,
        ...parsed.managers,
        items:
          Array.isArray(parsed.managers?.items) && parsed.managers.items.length > 0
            ? parsed.managers.items
            : DEFAULT_HOMEPAGE.managers.items,
      },
      advantages: {
        ...DEFAULT_HOMEPAGE.advantages,
        ...parsed.advantages,
        items:
          Array.isArray(parsed.advantages?.items) && parsed.advantages.items.length > 0
            ? parsed.advantages.items
            : DEFAULT_HOMEPAGE.advantages.items,
      },
      reviews: { ...DEFAULT_HOMEPAGE.reviews, ...parsed.reviews },
      consult: { ...DEFAULT_HOMEPAGE.consult, ...parsed.consult },
    };
  } catch {
    return structuredClone(DEFAULT_HOMEPAGE);
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const settings = await getSettings();
  return mergeSiteConfig(settings);
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const settings = await getSettings();
  return parseHomepage(settings.homepage);
}
