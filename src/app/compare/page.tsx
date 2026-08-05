import type { Metadata } from "next";
import { CompareView } from "@/components/CompareView";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Сравнение",
  description: `Сравнение косметологического оборудования ${SITE.name}`,
};

export default function ComparePage() {
  return (
    <div className="page">
      <header className="page__head">
        <p className="section-kicker">Подборка</p>
        <h1 className="section-title mt-3">Сравнение</h1>
        <p className="page__lead">
          Сопоставьте характеристики выбранных аппаратов рядом.
        </p>
      </header>
      <CompareView />
    </div>
  );
}
