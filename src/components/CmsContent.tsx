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
        className="mt-8 space-y-6 text-muted leading-relaxed [&_p]:mb-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}
