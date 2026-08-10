"use client";

import { usePathname } from "next/navigation";
import { AskQuestionFab } from "@/components/AskQuestionFab";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import type { ContactWidgetConfig, SiteInfo } from "@/lib/catalog";
import type { CategoryDTO } from "@/lib/content";

export function SiteChrome({
  categories,
  site,
  contactWidget,
  children,
}: {
  categories: CategoryDTO[];
  site: SiteInfo;
  contactWidget: ContactWidgetConfig;
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
      <AskQuestionFab contactWidget={contactWidget} />
      <ScrollToTop />
    </>
  );
}
