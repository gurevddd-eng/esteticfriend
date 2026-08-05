import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageEditor } from "../PageEditor";

type Props = { params: Promise<{ slug: string }> };

export default async function EditPageAdminPage({ params }: Props) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) notFound();

  return (
    <PageEditor
      page={{
        slug: page.slug,
        title: page.title,
        content: page.content,
        updatedAt: page.updatedAt.toISOString(),
      }}
    />
  );
}
