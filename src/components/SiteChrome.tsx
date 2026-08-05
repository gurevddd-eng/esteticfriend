"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import type { SiteInfo } from "@/lib/catalog";
import type { CategoryDTO } from "@/lib/content";

export function SiteChrome({
  categories,
  site,
  children,
}: {
  categories: CategoryDTO[];
  site: SiteInfo;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header categories={categories} site={site} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} site={site} />
      <ScrollToTop />
    </>
  );
}
