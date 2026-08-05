import Link from "next/link";
import { SITE } from "@/lib/content";

const SIZES = {
  sm: "text-sm md:text-base",
  md: "text-base md:text-lg",
  lg: "text-lg md:text-xl",
  xl: "text-2xl md:text-3xl",
} as const;

const IMAGE_SIZES = {
  sm: "brand-logo__img--sm",
  md: "brand-logo__img--md",
  lg: "brand-logo__img--lg",
  xl: "brand-logo__img--xl",
} as const;

export function BrandLogo({
  href = "/",
  className = "",
  size = "md",
  tone = "light",
  logoUrl = null,
}: {
  href?: string;
  className?: string;
  size?: keyof typeof SIZES;
  tone?: "light" | "dark";
  logoUrl?: string | null;
}) {
  const estetic = tone === "dark" ? "text-white" : "text-navy";
  const friend = tone === "dark" ? "text-frost" : "text-azure";

  if (logoUrl) {
    return (
      <Link
        href={href}
        className={`brand-logo brand-logo--image inline-flex shrink-0 items-center ${className}`}
        aria-label={SITE.name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={SITE.name}
          className={`brand-logo__img ${IMAGE_SIZES[size]}`}
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`brand-logo inline-flex shrink-0 items-baseline gap-[0.35em] font-[family-name:var(--font-syne)] tracking-[0.08em] uppercase ${SIZES[size]} ${className}`}
      aria-label={SITE.name}
    >
      <span className={estetic}>Estetic</span>
      <span className={`${friend} italic`}>Friend</span>
    </Link>
  );
}
