import type { Metadata } from "next";
import { Tenor_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SiteChrome } from "@/components/SiteChrome";
import { getCategories, getContactWidgetConfig, getSettings, getSiteInfo } from "@/lib/catalog";
import { SITE } from "@/lib/content";
import "./globals.css";

const tenorSans = Tenor_Sans({
  weight: "400",
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic", "latin-ext"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const favicon = settings.faviconUrl?.trim() || "/brand/sevens.ico";
  const apple =
    settings.faviconUrl?.trim() || settings.logoUrl?.trim() || "/brand/apple-touch-icon.png";

  return {
    title: {
      default: `${SITE.name} — профессиональное косметическое оборудование`,
      template: `%s · ${SITE.name}`,
    },
    description:
      "Поставка профессионального косметического оборудования. Офисы в Москве и Санкт-Петербурге, доставка по России и СНГ, обучение и сервис.",
    icons: {
      icon: [
        { url: favicon, sizes: "any" },
        { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: favicon,
      apple: [{ url: apple, sizes: "180x180", type: "image/png" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, site, contactWidget] = await Promise.all([
    getCategories(),
    getSiteInfo(),
    getContactWidgetConfig(),
  ]);

  return (
    <html
      lang="ru"
      className={`${tenorSans.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col antialiased">
        <Providers>
          <SiteChrome categories={categories} site={site} contactWidget={contactWidget}>
            {children}
          </SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
