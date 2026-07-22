export type CategoryDTO = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  _count?: { products: number };
};

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  imageUrl: string | null;
  inStock: boolean;
  isNew: boolean;
  isHit: boolean;
  categoryId: string;
  category?: Pick<CategoryDTO, "id" | "slug" | "name">;
};

export type ReviewDTO = {
  id: string;
  author: string;
  age: number | null;
  title: string;
  text: string;
  sortOrder: number;
};

export const SITE = {
  name: "ESTETIC FRIEND",
  phone: "+7 (911) 929-77-47",
  phoneHref: "tel:+79119297747",
  email: "info@esteticfriend.com",
  cities: "Москва и Санкт-Петербург",
  tagline: "Профессиональное косметическое оборудование",
  about:
    "Наша компания занимается поставкой качественного оборудования для эстетической косметологии. Мы сотрудничаем только с проверенными заводами, в которых уверены и знаем, что работа аппаратов вас не подведёт.",
  aboutExtra:
    "Мы работаем в двух ведущих городах страны, в Санкт-Петербурге и Москве. Осуществляем доставку по всей России, Республике Беларусь и Казахстану. Также мы занимаемся обучением аппаратным методикам и предоставляем гарантийный и постгарантийный ремонт.",
} as const;

export const ADVANTAGES = [
  {
    title: "Офисы в Москве и Санкт-Петербурге",
    text: "Работаем в ведущих городах страны — можно лично познакомиться с оборудованием.",
  },
  {
    title: "Доставка по России, СНГ и Китаю",
    text: "Организуем поставку оборудования по всей России, Беларуси, Казахстану и дальше.",
  },
  {
    title: "Бесплатное сертифицированное обучение",
    text: "При покупке аппарата проводим обучение аппаратным методикам.",
  },
  {
    title: "Гарантийный и постгарантийный ремонт",
    text: "Сопровождаем оборудование после покупки и после окончания гарантии.",
  },
] as const;

export const NAV_LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/delivery", label: "Доставка и оплата" },
  { href: "/warranty", label: "Гарантия" },
  { href: "/certificates", label: "Сертификаты" },
  { href: "/training", label: "Обучение" },
  { href: "/contacts", label: "Контакты" },
] as const;

export const FALLBACK_CATEGORIES: CategoryDTO[] = [
  { id: "c1", slug: "novinki", name: "Новинки", description: "Свежие поступления", sortOrder: 0, _count: { products: 9 } },
  { id: "c2", slug: "ems", name: "EMS", description: "Электромагнитная миостимуляция", sortOrder: 1, _count: { products: 0 } },
  { id: "c3", slug: "opt-ipl-shr", name: "OPT/IPL/SHR", description: "Фотоэпиляция и фотоомоложение", sortOrder: 2, _count: { products: 0 } },
  { id: "c4", slug: "smas", name: "SMAS", description: "SMAS-лифтинг и HIFU", sortOrder: 3, _count: { products: 1 } },
  { id: "c5", slug: "sosudy", name: "Удаление сосудов", description: "Сосудистые патологии", sortOrder: 4, _count: { products: 0 } },
  { id: "c6", slug: "lazernaya-epilyaciya", name: "Лазерная эпиляция", description: "Лазеры для эпиляции", sortOrder: 5, _count: { products: 3 } },
  { id: "c7", slug: "kombajny-lico", name: "Комбайны по лицу", description: "Многофункциональные аппараты", sortOrder: 6, _count: { products: 1 } },
  { id: "c8", slug: "kombajny-telo", name: "Комбайны по телу", description: "Коррекция фигуры", sortOrder: 7, _count: { products: 1 } },
  { id: "c9", slug: "kriolipoliz", name: "Криолиполиз", description: "Криолиполиз", sortOrder: 8, _count: { products: 1 } },
  { id: "c10", slug: "massazh", name: "Массаж", description: "Массажные аппараты", sortOrder: 9, _count: { products: 0 } },
  { id: "c11", slug: "rf-lifting", name: "RF-лифтинг", description: "Радиочастотный лифтинг", sortOrder: 10, _count: { products: 2 } },
  { id: "c12", slug: "pressoterapiya", name: "Прессотерапия", description: "Лимфодренаж", sortOrder: 11, _count: { products: 0 } },
];

export const FALLBACK_PRODUCTS: ProductDTO[] = [
  {
    id: "p1",
    slug: "rf-explore",
    name: "RF EXPLORE",
    shortDesc:
      "Микроигольчатый RF-лифтинг: омоложение кожи, улучшение метаболизма и повышение упругости",
    description:
      "Профессиональный аппарат для игольчатого фракционного RF-лифтинга. Радиочастотное воздействие прогревает ткани и запускает обновление кожи: повышает упругость, улучшает метаболизм и помогает в anti-age программах для лица.",
    imageUrl: "/products/rf-explore.png",
    inStock: true,
    isNew: true,
    isHit: true,
    categoryId: "c11",
    category: { id: "c11", slug: "rf-lifting", name: "RF-лифтинг" },
  },
  {
    id: "p2",
    slug: "anchorfree-v8c2",
    name: "AnchorFree V8C2",
    shortDesc:
      "Многофункциональный комбайн для коррекции фигуры и улучшения качества кожи",
    description:
      "Аппарат нового поколения для моделирования контуров тела и работы с кожей лица. Сочетает несколько физических факторов, активирует обменные процессы в коже и подкожно-жировой клетчатке, помогает в программах лифтинга и коррекции фигуры.",
    imageUrl: "/products/anchorfree-v8c2.png",
    inStock: true,
    isNew: true,
    isHit: true,
    categoryId: "c8",
    category: { id: "c8", slug: "kombajny-telo", name: "Комбайны по телу" },
  },
  {
    id: "p3",
    slug: "mbt-340",
    name: "MBT-340",
    shortDesc:
      "Аппарат криолиполиза для уменьшения локальных жировых отложений",
    description:
      "Обновлённая версия аппарата криолиполиза MBT для работы с локальными жировыми зонами, в том числе труднодоступными. Метод основан на контролируемом охлаждении жировой ткани. Подходит для салонов, кабинетов и клиник эстетической косметологии.",
    imageUrl: "/products/mbt-340.jpg",
    inStock: true,
    isNew: true,
    isHit: false,
    categoryId: "c9",
    category: { id: "c9", slug: "kriolipoliz", name: "Криолиполиз" },
  },
  {
    id: "p4",
    slug: "oxygen-aqua-jet-peel",
    name: "Oxygen Aqua Jet Peel",
    shortDesc:
      "Многофункциональный комбайн с газожидкостным пилингом и очищением кожи",
    description:
      "Аппарат для бережного очищения и обновления кожи: газожидкостный гидропилинг, алмазная дермабразия, ультразвуковой скраббер и воздушная кисть. Отшелушивает ороговевшие клетки, активирует кровообращение и подготавливает кожу к дальнейшему уходу.",
    imageUrl: "/products/oxygen-aqua-jet-peel.png",
    inStock: true,
    isNew: true,
    isHit: false,
    categoryId: "c7",
    category: { id: "c7", slug: "kombajny-lico", name: "Комбайны по лицу" },
  },
  {
    id: "p5",
    slug: "soprano",
    name: "SOPRANO",
    shortDesc:
      "Гибридный диодный лазер для эпиляции с эффективной системой охлаждения",
    description:
      "Диодный лазер для удаления волос с длинами волн 755/808/1064 нм и фреоновой микроканальной системой охлаждения. Обеспечивает комфортные процедуры, ресурс излучателя до десятков миллионов вспышек и удобство ежедневной работы специалиста.",
    imageUrl: "/products/soprano.png",
    inStock: true,
    isNew: true,
    isHit: true,
    categoryId: "c6",
    category: { id: "c6", slug: "lazernaya-epilyaciya", name: "Лазерная эпиляция" },
  },
  {
    id: "p6",
    slug: "omegy",
    name: "Omegy",
    shortDesc:
      "Надёжный диодный лазер MBT для лазерной эпиляции 755/808/1064 нм",
    description:
      "Диодный лазер завода MBT с гибридным излучателем 755/808/1064 нм. Предназначен для лазерной эпиляции: интуитивный русскоязычный интерфейс, удобное обслуживание и стабильная работа в потоковом режиме салона или клиники.",
    imageUrl: "/products/omegy.png",
    inStock: true,
    isNew: true,
    isHit: false,
    categoryId: "c6",
    category: { id: "c6", slug: "lazernaya-epilyaciya", name: "Лазерная эпиляция" },
  },
  {
    id: "p7",
    slug: "kls-116",
    name: "KLS-116",
    shortDesc:
      "Микроигольчатый RF-аппарат для активации коллагена и омоложения кожи",
    description:
      "Профессиональный аппарат игольчатого фракционного RF-лифтинга. Стимулирует выработку коллагена, повышает упругость кожи и используется в программах омоложения лица и зон с возрастными изменениями.",
    imageUrl: "/products/kls-116.png",
    inStock: true,
    isNew: true,
    isHit: true,
    categoryId: "c11",
    category: { id: "c11", slug: "rf-lifting", name: "RF-лифтинг" },
  },
  {
    id: "p8",
    slug: "7d-hifu",
    name: "7D HIFU",
    shortDesc:
      "HIFU-аппарат для SMAS-лифтинга лица и повышения упругости тканей тела",
    description:
      "Аппарат высокоинтенсивного сфокусированного ультразвука (HIFU) для коррекции возрастных изменений лица, шеи и декольте, а также для повышения упругости зон тела. Даёт выраженный лифтинг-эффект без длительной реабилитации.",
    imageUrl: "/products/7d-hifu.png",
    inStock: true,
    isNew: true,
    isHit: true,
    categoryId: "c4",
    category: { id: "c4", slug: "smas", name: "SMAS" },
  },
  {
    id: "p9",
    slug: "h8",
    name: "H8",
    shortDesc:
      "Диодный лазер для удаления волос с системой охлаждения и счётчиком вспышек",
    description:
      "Усовершенствованная версия диодного лазера H8 для эпиляции. Длина волны 808 нм (доступны варианты 755/808/1064 нм), система охлаждения для комфортных процедур, счётчик вспышек и ресурс излучателя до 20 млн вспышек — удобно для интенсивной загрузки кабинета.",
    imageUrl: "/products/h8.png",
    inStock: true,
    isNew: true,
    isHit: false,
    categoryId: "c6",
    category: { id: "c6", slug: "lazernaya-epilyaciya", name: "Лазерная эпиляция" },
  },
];

export const FALLBACK_REVIEWS: ReviewDTO[] = [
  {
    id: "r1",
    author: "Александра Иванова",
    age: 23,
    title: "Это любовь",
    text: "От себя с удовольствием выражаю благодарность компании! Аппарат in-motion d1 надежный, мощный, современный, удобный и стильный! Это любовь с первого взгляда!",
    sortOrder: 0,
  },
  {
    id: "r2",
    author: "Лилия Маркова",
    age: 28,
    title: "Качество на уровне!",
    text: "Все очень круто, аппарат оказался в наличии, не то, что у большинства. Качество топ, привезли вовремя, помогли собрать. Также в стоимость вошло первоклассное обучение.",
    sortOrder: 1,
  },
  {
    id: "r3",
    author: "Светлана Ткаченко",
    age: 22,
    title: "В восторге!",
    text: "Оборудование отличного качества. Очень удобная доставка, хорошее оборудование. Честно, даже не ожидала такого. Супер менеджер, спасибо!",
    sortOrder: 2,
  },
  {
    id: "r4",
    author: "Наталья Сорокина",
    age: 24,
    title: "Буду рекомендовать!",
    text: "Покупала 2 аппарата и все были в отличном качестве. Отзывчивый, приятный менеджер помог определиться с выбором. Рассказала всем и буду рекомендовать!",
    sortOrder: 3,
  },
];

export const FEATURED_CATEGORY_SLUGS = ["ems", "smas", "sosudy", "opt-ipl-shr"] as const;
