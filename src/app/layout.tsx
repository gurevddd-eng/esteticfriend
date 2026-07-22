import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SiteChrome } from "@/components/SiteChrome";
import { getCategories } from "@/lib/catalog";
import { getSiteConfig } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const unbounded = Unbounded({
  variable: "--font-syne",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s · ${site.name}`,
    },
    description: site.about,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, site] = await Promise.all([getCategories(), getSiteConfig()]);

  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable} h-full`}>
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
