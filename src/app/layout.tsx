import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SiteChrome } from "@/components/SiteChrome";
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
        <Providers>
          <SiteChrome categories={categories}>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
