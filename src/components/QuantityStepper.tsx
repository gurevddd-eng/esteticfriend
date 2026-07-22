"use client";

type Props = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  label?: string;
  /** When true, − at quantity 1 is disabled (cart page). When false, − removes the item. */
  disableAtOne?: boolean;
  className?: string;
  compact?: boolean;
};

export function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  label = "Количество",
  disableAtOne = false,
  className = "",
  compact = false,
}: Props) {
  const size = compact ? "h-9 w-9 text-base" : "h-10 w-10 text-lg";
  const valueMin = compact ? "min-w-7 text-sm" : "min-w-8 text-sm";

  return (
    <div
      className={`inline-flex items-center rounded-full border border-[var(--line)] bg-pearl/60 ${className}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={`flex items-center justify-center rounded-full font-semibold text-navy transition hover:bg-white disabled:opacity-40 ${size}`}
        aria-label="Уменьшить количество"
        disabled={disableAtOne && quantity <= 1}
        onClick={onDecrease}
      >
        −
      </button>
      <span className={`text-center font-bold tabular-nums text-navy ${valueMin}`}>
        {quantity}
      </span>
      <button
        type="button"
        className={`flex items-center justify-center rounded-full font-semibold text-navy transition hover:bg-white disabled:opacity-40 ${size}`}
        aria-label="Увеличить количество"
        disabled={quantity >= 99}
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  );
}
