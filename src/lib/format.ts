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
