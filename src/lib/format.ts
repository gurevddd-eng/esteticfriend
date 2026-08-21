export function formatPrice(value: number | string | { toString(): string } | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  const num = typeof value === "number" ? value : Number(value.toString());
  if (!Number.isFinite(num) || num <= 0) return null;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPhoneShort(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return phone;
  const local = digits.slice(-10);
  return `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`;
}

/** Russian plural forms: one / few / many */
export function pluralRu(count: number, one: string, few: string, many: string) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} ${few}`;
  }
  return `${count} ${many}`;
}

export function productsLabel(count: number) {
  return pluralRu(count, "аппарат", "аппарата", "аппаратов");
}

export function brandsLabel(count: number) {
  return pluralRu(count, "бренд", "бренда", "брендов");
}
