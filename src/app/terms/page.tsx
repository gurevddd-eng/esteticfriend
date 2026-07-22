import type { Metadata } from "next";
import { CmsContent } from "@/components/CmsContent";

export const metadata: Metadata = {
  title: "Условия использования",
};

export default function TermsPage() {
  return (
    <div className="section-pad">
      <div className="container-shell max-w-3xl">
        <p className="section-kicker">Документы</p>
        <CmsContent
          slug="terms"
          fallbackTitle="Условия использования"
          fallbackHtml="<p>Материалы сайта носят информационный характер и не являются публичной офертой. Актуальные цены, наличие и условия поставки уточняются у менеджера.</p>"
        />
      </div>
    </div>
  );
}
