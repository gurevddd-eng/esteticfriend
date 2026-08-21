import { prisma } from "@/lib/prisma";

export type AmoCrmConfig = {
  enabled: boolean;
  domain: string;
  token: string;
  pipelineId: number | null;
  statusId: number | null;
  responsibleUserId: number | null;
};

export type AmoLeadPayload = {
  id: string;
  name: string;
  phone: string;
  message?: string | null;
  source?: string | null;
  productName?: string | null;
  itemsJson?: string | null;
};

const SETTING_KEYS = {
  enabled: "amocrm_enabled",
  domain: "amocrm_domain",
  token: "amocrm_token",
  pipelineId: "amocrm_pipeline_id",
  statusId: "amocrm_status_id",
  responsibleUserId: "amocrm_responsible_user_id",
} as const;

function normalizeDomain(raw: string) {
  let value = raw.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "");
  value = value.replace(/\/+$/, "");
  if (value && !value.includes(".")) {
    value = `${value}.amocrm.ru`;
  }
  return value;
}

function parseOptionalInt(value?: string | null) {
  if (!value?.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}

export async function getAmoCrmConfig(): Promise<AmoCrmConfig> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: Object.values(SETTING_KEYS) } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  const domain = normalizeDomain(
    process.env.AMOCRM_DOMAIN || map[SETTING_KEYS.domain] || "",
  );
  const token = (process.env.AMOCRM_ACCESS_TOKEN || map[SETTING_KEYS.token] || "").trim();
  const enabledFlag = (map[SETTING_KEYS.enabled] || "").trim() === "1";

  return {
    enabled: enabledFlag && Boolean(domain && token),
    domain,
    token,
    pipelineId: parseOptionalInt(map[SETTING_KEYS.pipelineId]),
    statusId: parseOptionalInt(map[SETTING_KEYS.statusId]),
    responsibleUserId: parseOptionalInt(map[SETTING_KEYS.responsibleUserId]),
  };
}

export function maskToken(token: string) {
  if (!token) return "";
  if (token.length <= 8) return "••••••••";
  return `${token.slice(0, 4)}…${token.slice(-4)}`;
}

async function amoFetch(
  config: Pick<AmoCrmConfig, "domain" | "token">,
  path: string,
  init?: RequestInit,
) {
  const url = `https://${config.domain}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }

  if (!res.ok) {
    const detail =
      typeof json === "object" && json && "title" in json
        ? String((json as { title?: string }).title)
        : text.slice(0, 240);
    throw new Error(`AmoCRM ${res.status}: ${detail || res.statusText}`);
  }

  return json;
}

export async function testAmoCrmConnection(config?: AmoCrmConfig) {
  const cfg = config || (await getAmoCrmConfig());
  if (!cfg.domain || !cfg.token) {
    return { ok: false as const, error: "Укажите домен и токен доступа" };
  }

  try {
    const account = (await amoFetch(cfg, "/api/v4/account")) as {
      name?: string;
      id?: number;
      subdomain?: string;
    };
    return {
      ok: true as const,
      accountName: account.name || account.subdomain || `ID ${account.id || "?"}`,
    };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Ошибка подключения",
    };
  }
}

function sourceLabel(source?: string | null) {
  const map: Record<string, string> = {
    "home-consult": "Консультация на главной",
    callback: "Обратный звонок",
    "buy-one-click": "Купить в 1 клик",
    cart: "Корзина",
    contacts: "Контакты",
    delivery: "Доставка",
    warranty: "Гарантия",
    training: "Обучение",
    certificates: "Сертификаты",
    brands: "Бренды",
    site: "Сайт",
  };
  if (!source) return "Сайт";
  return map[source] || source;
}

function buildLeadName(payload: AmoLeadPayload) {
  const base = payload.productName
    ? `Заявка: ${payload.productName}`
    : `Заявка с сайта — ${payload.name}`;
  return base.slice(0, 250);
}

function buildNoteText(payload: AmoLeadPayload) {
  const lines = [
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Источник: ${sourceLabel(payload.source)}`,
  ];
  if (payload.productName) lines.push(`Товар: ${payload.productName}`);
  if (payload.message) lines.push(`Сообщение: ${payload.message}`);
  if (payload.itemsJson) {
    try {
      const items = JSON.parse(payload.itemsJson) as Array<{
        name: string;
        quantity: number;
      }>;
      if (items.length) {
        lines.push("Состав заказа:");
        for (const item of items) {
          lines.push(`— ${item.name} × ${item.quantity}`);
        }
      }
    } catch {
      lines.push(`Корзина: ${payload.itemsJson}`);
    }
  }
  lines.push(`ID на сайте: ${payload.id}`);
  return lines.join("\n");
}

export async function createAmoCrmLead(
  payload: AmoLeadPayload,
  config?: AmoCrmConfig,
) {
  const cfg = config || (await getAmoCrmConfig());
  if (!cfg.enabled) {
    return { ok: false as const, skipped: true as const, error: "Интеграция выключена" };
  }

  const body: Record<string, unknown> = {
    name: buildLeadName(payload),
    _embedded: {
      contacts: [
        {
          name: payload.name,
          custom_fields_values: [
            {
              field_code: "PHONE",
              values: [{ value: payload.phone, enum_code: "WORK" }],
            },
          ],
        },
      ],
    },
  };

  if (cfg.pipelineId) body.pipeline_id = cfg.pipelineId;
  if (cfg.statusId) body.status_id = cfg.statusId;
  if (cfg.responsibleUserId) body.responsible_user_id = cfg.responsibleUserId;

  const created = (await amoFetch(cfg, "/api/v4/leads/complex", {
    method: "POST",
    body: JSON.stringify([body]),
  })) as Array<{ id?: number; contact_id?: number }>;

  const amoLeadId = created?.[0]?.id;
  if (!amoLeadId) {
    throw new Error("AmoCRM не вернул ID сделки");
  }

  try {
    await amoFetch(cfg, "/api/v4/leads/notes", {
      method: "POST",
      body: JSON.stringify([
        {
          entity_id: amoLeadId,
          note_type: "common",
          params: { text: buildNoteText(payload) },
        },
      ]),
    });
  } catch {
    // note is optional — lead already created
  }

  return { ok: true as const, amoLeadId: String(amoLeadId) };
}

export async function syncLeadToAmoCrm(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { product: { select: { name: true } } },
  });
  if (!lead) {
    return { ok: false as const, error: "Заявка не найдена" };
  }
  if (lead.amoLeadId) {
    return { ok: true as const, amoLeadId: lead.amoLeadId, alreadySynced: true as const };
  }

  const config = await getAmoCrmConfig();
  if (!config.enabled) {
    return { ok: false as const, skipped: true as const, error: "AmoCRM выключен или не настроен" };
  }

  try {
    const result = await createAmoCrmLead(
      {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        message: lead.message,
        source: lead.source,
        productName: lead.product?.name ?? null,
        itemsJson: lead.itemsJson,
      },
      config,
    );

    if (!result.ok || !("amoLeadId" in result) || !result.amoLeadId) {
      const error = "error" in result ? result.error : "Не удалось создать сделку";
      await prisma.lead.update({
        where: { id: lead.id },
        data: { amoSyncError: error },
      });
      return { ok: false as const, error };
    }

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        amoLeadId: result.amoLeadId,
        amoSyncedAt: new Date(),
        amoSyncError: null,
      },
    });

    return { ok: true as const, amoLeadId: result.amoLeadId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка синхронизации";
    await prisma.lead.update({
      where: { id: lead.id },
      data: { amoSyncError: message.slice(0, 500) },
    });
    return { ok: false as const, error: message };
  }
}

export { SETTING_KEYS as AMOCRM_SETTING_KEYS };
