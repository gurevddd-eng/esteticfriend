import Link from "next/link";
import { SITE } from "@/lib/content";

const SIZES = {
  header: "text-base md:text-lg",
  sm: "text-sm md:text-base",
  md: "text-base md:text-lg",
  lg: "text-lg md:text-xl",
  xl: "text-2xl md:text-3xl",
} as const;

const IMAGE_SIZES = {
  header: "brand-logo__img--header",
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
  size?: keyof typeof SIZES | "header";
  tone?: "light" | "dark";
  logoUrl?: string | null;
}) {
  const textTone = tone === "dark" ? "text-white" : "text-navy";

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
      className={`brand-logo inline-flex shrink-0 items-baseline font-[family-name:var(--font-syne)] tracking-[0.14em] uppercase ${SIZES[size]} ${className}`}
      aria-label={SITE.name}
    >
      <span className={textTone}>{SITE.name}</span>
    </Link>
  );
}
