import type { Metadata } from "next";
import { FavoritesView } from "@/components/FavoritesView";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Сохранённые аппараты ESTETIC FRIEND",
};

export default function FavoritesPage() {
  return (
    <div className="page">
      <header className="page__head">
        <p className="section-kicker">Подборка</p>
        <h1 className="section-title mt-3">Избранное</h1>
        <p className="page__lead">
          Аппараты, которые вы отметили для себя. Список хранится в браузере.
        </p>
      </header>
      <FavoritesView />
    </div>
  );
}
