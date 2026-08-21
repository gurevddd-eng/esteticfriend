import type { Metadata } from "next";
import { CertificatesGallery } from "@/components/CertificatesGallery";
import { LeadForm } from "@/components/LeadForm";
import { PageFormPanel } from "@/components/PageFormPanel";
import { getCertificates, getCertificatesPageConfig } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Сертификаты",
  description:
    "Сертификаты и сопроводительные документы на косметологическое оборудование SEVENS. По запросу пришлём материалы на интересующие аппараты.",
};

export default async function CertificatesPage() {
  const [page, certificates] = await Promise.all([
    getCertificatesPageConfig(),
    getCertificates(),
  ]);

  return (
    <div className="page">
      <div className="page__layout">
        <div className="page__content">
          <p className="section-kicker">{page.kicker}</p>
          <h1 className="section-title mt-3">{page.title}</h1>
          <p className="page__lead">{page.lead}</p>

          {page.docs.length ? (
            <section className="delivery-block" aria-labelledby="cert-docs">
              <h2 id="cert-docs" className="delivery-block__title">
                Какие документы предоставляем
              </h2>
              <ul className="delivery-pay">
                {page.docs.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {certificates.length ? (
            <section className="delivery-block" aria-labelledby="cert-gallery">
              <h2 id="cert-gallery" className="delivery-block__title">
                Сертификаты
              </h2>
              <CertificatesGallery items={certificates} />
            </section>
          ) : (
            <section className="delivery-block">
              <p className="delivery-note">
                Фото сертификатов скоро появятся. Пока можете запросить документы
                через форму — пришлём на интересующий аппарат.
              </p>
            </section>
          )}
        </div>

        <PageFormPanel title={page.formTitle} lead={page.formLead}>
          <LeadForm source="certificates" compact />
        </PageFormPanel>
      </div>
    </div>
  );
}
