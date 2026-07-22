import { prisma } from "@/lib/prisma";
import { LeadsAdminClient } from "./LeadsAdminClient";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <LeadsAdminClient
      leads={leads.map((l) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        message: l.message,
        source: l.source,
        itemsJson: l.itemsJson,
        createdAt: l.createdAt.toISOString(),
        product: l.product,
      }))}
    />
  );
}
