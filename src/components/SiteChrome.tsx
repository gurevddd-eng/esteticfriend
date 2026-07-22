"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { CategoryDTO } from "@/lib/content";

export function SiteChrome({
  categories,
  children,
}: {
  categories: CategoryDTO[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </>
  );
}
