import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { LeadsAdminClient } from "./LeadsAdminClient";

async function LeadsInner() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { product: { select: { id: true, name: true, slug: true } } },
  });

  return (
    <LeadsAdminClient
      leads={leads.map((lead) => ({
        ...lead,
        createdAt: lead.createdAt.toISOString(),
      }))}
    />
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={<p className="ea-sub">Загрузка заявок...</p>}>
      <LeadsInner />
    </Suspense>
  );
}
