export type LeadCartItem = {
  productId?: string;
  name: string;
  quantity: number;
};

export function parseLeadCartItems(itemsJson: string | null): LeadCartItem[] {
  if (!itemsJson) return [];
  try {
    const parsed = JSON.parse(itemsJson) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is LeadCartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as LeadCartItem).name === "string" &&
        typeof (item as LeadCartItem).quantity === "number",
    );
  } catch {
    return [];
  }
}

export function extractProductNameFromMessage(message: string | null): string | null {
  if (!message) return null;
  const match = message.match(/Интерес к аппарату:\s*([^.]+)/i);
  return match?.[1]?.trim() || null;
}

export function getLeadProductNames(lead: {
  product?: { name: string } | null;
  itemsJson: string | null;
  message: string | null;
}): string[] {
  const names: string[] = [];

  if (lead.product?.name) {
    names.push(lead.product.name);
  }

  for (const item of parseLeadCartItems(lead.itemsJson)) {
    if (item.name && !names.includes(item.name)) {
      names.push(item.name);
    }
  }

  const fromMessage = extractProductNameFromMessage(lead.message);
  if (fromMessage && !names.includes(fromMessage)) {
    names.push(fromMessage);
  }

  return names;
}

export function aggregateLeadProductCounts(
  leads: Array<{
    productId: string | null;
    product?: { id: string; name: string } | null;
    itemsJson: string | null;
    message: string | null;
  }>,
): Array<{ name: string; count: number }> {
  const counts = new Map<string, { name: string; count: number }>();

  const add = (key: string, name: string, amount = 1) => {
    const current = counts.get(key);
    if (current) {
      current.count += amount;
      return;
    }
    counts.set(key, { name, count: amount });
  };

  for (const lead of leads) {
    if (lead.productId && lead.product?.name) {
      add(lead.productId, lead.product.name);
      continue;
    }

    const cartItems = parseLeadCartItems(lead.itemsJson);
    if (cartItems.length > 0) {
      for (const item of cartItems) {
        const key = item.productId || `name:${item.name}`;
        add(key, item.name, item.quantity);
      }
      continue;
    }

    const fromMessage = extractProductNameFromMessage(lead.message);
    if (fromMessage) {
      add(`name:${fromMessage}`, fromMessage);
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count);
}
