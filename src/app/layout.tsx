import type { Metadata } from "next";
import { Tenor_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SiteChrome } from "@/components/SiteChrome";
import { getCategories, getSettings, getSiteInfo } from "@/lib/catalog";
import { SITE } from "@/lib/content";
import "./globals.css";

const tenorSans = Tenor_Sans({
  weight: "400",
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic", "latin-ext"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const favicon = settings.faviconUrl?.trim() || "/favicon.ico";
  const apple = settings.logoUrl?.trim() || settings.faviconUrl?.trim() || "/favicon.ico";

  return {
    title: {
      default: `${SITE.name} — профессиональное косметическое оборудование`,
      template: `%s · ${SITE.name}`,
    },
    description:
      "Поставка профессионального косметического оборудования. Офисы в Москве и Санкт-Петербурге, доставка по России и СНГ, обучение и сервис.",
    icons: {
      icon: [{ url: favicon }],
      shortcut: favicon,
      apple,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, site] = await Promise.all([getCategories(), getSiteInfo()]);

  return (
    <html
      lang="ru"
      className={`${tenorSans.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col antialiased">
        <Providers>
          <SiteChrome categories={categories} site={site}>
            {children}
          </SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
