import type { Metadata } from "next";
import { CmsContent } from "@/components/CmsContent";

export const metadata: Metadata = {
  title: "Условия использования",
};

export default function TermsPage() {
  return (
    <div className="page">
      <article className="legal-page">
        <p className="section-kicker">Документы</p>
        <CmsContent
          slug="terms"
          fallbackTitle="Условия использования"
          fallbackHtml="<p>Материалы сайта носят информационный характер и не являются публичной офертой. Актуальные цены, наличие и условия поставки уточняются у менеджера SEVENS.</p><p>Используя сайт, вы соглашаетесь с условиями оформления заявок и обработки персональных данных.</p>"
        />
      </article>
    </div>
  );
}
