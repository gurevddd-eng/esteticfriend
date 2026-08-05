import type { Metadata } from "next";
import { CompareView } from "@/components/CompareView";

export const metadata: Metadata = {
  title: "Сравнение",
  description: "Сравнение косметологического оборудования ESTETIC FRIEND",
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
