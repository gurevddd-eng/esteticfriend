import { getPage } from "@/lib/catalog";

export async function CmsContent({
  slug,
  fallbackTitle,
  fallbackHtml,
}: {
  slug: string;
  fallbackTitle: string;
  fallbackHtml: string;
}) {
  const page = await getPage(slug);
  const title = page?.title || fallbackTitle;
  const content = page?.content || fallbackHtml;

  return (
    <>
      <h1 className="section-title mt-3">{title}</h1>
      <div
        className="page__prose legal-page__body [&_p]:mb-0 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
