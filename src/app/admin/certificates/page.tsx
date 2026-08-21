import { prisma } from "@/lib/prisma";
import { getCertificatesPageConfig } from "@/lib/catalog";
import { CertificatesAdminClient } from "./CertificatesAdminClient";

export default async function AdminCertificatesPage() {
  const [items, page] = await Promise.all([
    prisma.certificate.findMany({ orderBy: { sortOrder: "asc" } }),
    getCertificatesPageConfig(),
  ]);

  return (
    <CertificatesAdminClient
      items={items}
      page={{
        ...page,
        docsText: page.docs.join("\n"),
      }}
    />
  );
}
