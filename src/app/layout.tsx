import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCategories } from "@/lib/catalog";
import { SITE } from "@/lib/content";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const unbounded = Unbounded({
  variable: "--font-syne",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — профессиональное косметическое оборудование`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Поставка профессионального косметического оборудования. Офисы в Москве и Санкт-Петербурге, доставка по России и СНГ, обучение и сервис.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <Header categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
