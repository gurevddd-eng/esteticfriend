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
  return (
    <div
      className={`qty-stepper${compact ? " qty-stepper--compact" : ""}${className ? ` ${className}` : ""}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className="qty-stepper__btn"
        aria-label="Уменьшить количество"
        disabled={disableAtOne && quantity <= 1}
        onClick={onDecrease}
      >
        −
      </button>
      <span className="qty-stepper__value">{quantity}</span>
      <button
        type="button"
        className="qty-stepper__btn"
        aria-label="Увеличить количество"
        disabled={quantity >= 99}
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  );
}
