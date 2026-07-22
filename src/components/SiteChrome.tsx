"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { CategoryDTO } from "@/lib/content";
import type { SiteConfig } from "@/lib/site";

export function SiteChrome({
  categories,
  site,
  children,
}: {
  categories: CategoryDTO[];
  site: SiteConfig;
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
    </>
  );
}
