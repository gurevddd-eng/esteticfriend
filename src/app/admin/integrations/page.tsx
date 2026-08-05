import { prisma } from "@/lib/prisma";
import {
  AMOCRM_SETTING_KEYS,
  getAmoCrmConfig,
  maskToken,
} from "@/lib/amocrm";
import { IntegrationsAdminClient } from "./IntegrationsAdminClient";

export default async function AdminIntegrationsPage() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: Object.values(AMOCRM_SETTING_KEYS) } },
  });
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const config = await getAmoCrmConfig();
  const envToken = Boolean(process.env.AMOCRM_ACCESS_TOKEN?.trim());
  const envDomain = Boolean(process.env.AMOCRM_DOMAIN?.trim());

  return (
    <IntegrationsAdminClient
      amo={{
        enabled: settings[AMOCRM_SETTING_KEYS.enabled] === "1",
        domain: settings[AMOCRM_SETTING_KEYS.domain] || process.env.AMOCRM_DOMAIN || "",
        tokenMasked: maskToken(
          settings[AMOCRM_SETTING_KEYS.token] || process.env.AMOCRM_ACCESS_TOKEN || "",
        ),
        hasToken: Boolean(
          settings[AMOCRM_SETTING_KEYS.token]?.trim() || process.env.AMOCRM_ACCESS_TOKEN?.trim(),
        ),
        pipelineId: settings[AMOCRM_SETTING_KEYS.pipelineId] || "",
        statusId: settings[AMOCRM_SETTING_KEYS.statusId] || "",
        responsibleUserId: settings[AMOCRM_SETTING_KEYS.responsibleUserId] || "",
        liveEnabled: config.enabled,
        envOverrides: { token: envToken, domain: envDomain },
      }}
    />
  );
}
