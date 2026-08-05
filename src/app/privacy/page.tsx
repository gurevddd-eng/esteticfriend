import type { Metadata } from "next";
import { CmsContent } from "@/components/CmsContent";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
};

export default function PrivacyPage() {
  return (
    <div className="page">
      <article className="legal-page">
        <p className="section-kicker">Документы</p>
        <CmsContent
          slug="privacy"
          fallbackTitle="Политика конфиденциальности"
          fallbackHtml="<p>Оставляя заявку на сайте SEVENS, вы соглашаетесь на обработку персональных данных (имя, телефон и иные сведения, указанные в форме) с целью обратной связи и подготовки коммерческого предложения.</p><p>Данные не передаются третьим лицам, за исключением случаев, предусмотренных законодательством, и используются только для связи по вашей заявке.</p>"
        />
      </article>
    </div>
  );
}
