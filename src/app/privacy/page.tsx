import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
};

export default function PrivacyPage() {
  return (
    <div className="section-pad">
      <div className="container-shell max-w-3xl prose-like">
        <h1 className="section-title">Политика конфиденциальности</h1>
        <p className="mt-8 text-muted leading-relaxed">
          Оставляя заявку на сайте ESTETIC FRIEND, вы соглашаетесь на обработку
          персональных данных (имя, телефон и иные сведения, указанные в форме)
          с целью обратной связи и подготовки коммерческого предложения.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          Данные не передаются третьим лицам, за исключением случаев, предусмотренных
          законодательством, и используются только для связи по вашей заявке.
        </p>
      </div>
    </div>
  );
}
