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
