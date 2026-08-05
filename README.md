# SEVENS

Сайт поставщика профессионального косметического оборудования.

**Стек:** Next.js 16 · React 19 · Tailwind CSS 4 · PostgreSQL · Prisma

## Быстрый старт

```bash
npm install
# PostgreSQL должен быть доступен (см. .env.example)
npx prisma db push
npm run db:seed
npm run dev
```

- Сайт: http://localhost:3000  
- Админка: http://localhost:3000/admin/login  
- Логин по умолчанию: `admin@esteticfriend.local` / `admin12345`

## Админ-панель

- Категории и товары (CRUD, загрузка фото, новинка/хит/наличие)
- Заявки с сайта и из корзины
- Отзывы
- Тексты страниц (доставка, гарантия, обучение и др.)
- Настройки контактов и блока «О компании»

## Страницы сайта

- `/` — главная  
- `/catalog`, `/product/[slug]` — каталог  
- `/cart` — корзина и оформление заказа  
- `/delivery`, `/warranty`, `/certificates`, `/training`, `/contacts`
