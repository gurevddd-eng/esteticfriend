import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пользовательское соглашение",
};

export default function TermsPage() {
  return (
    <div className="section-pad">
      <div className="container-shell max-w-3xl">
        <h1 className="section-title">Пользовательское соглашение</h1>
        <p className="mt-8 text-muted leading-relaxed">
          Материалы сайта носят информационный характер и не являются публичной
          офертой. Актуальные цены, наличие и условия поставки уточняются у
          менеджера ESTETIC FRIEND.
        </p>
      </div>
    </div>
  );
}
