import Link from "next/link";
import {
  BRAND_TAGLINE_LINES,
  HEADER_LOGO_URL,
  HEADER_WORDMARK_URL,
  SITE,
} from "@/lib/content";

export function HeaderBrandLockup({
  href = "/",
  className = "",
  logoUrl = null,
  compact = false,
}: {
  href?: string;
  className?: string;
  logoUrl?: string | null;
  compact?: boolean;
}) {
  if (logoUrl && logoUrl !== HEADER_LOGO_URL) {
    return (
      <Link
        href={href}
        className={`brand-logo brand-logo--image inline-flex shrink-0 items-center${className ? ` ${className}` : ""}`}
        aria-label={SITE.name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={SITE.name} className="brand-logo__img brand-logo__img--header" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`header-brand-lockup${compact ? " header-brand-lockup--compact" : ""}${className ? ` ${className}` : ""}`}
      aria-label={SITE.name}
    >
      <span className="header-brand-lockup__mark-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HEADER_WORDMARK_URL}
          alt=""
          aria-hidden
          className="header-brand-lockup__mark"
        />
      </span>
      {!compact ? (
        <span className="header-brand-lockup__tagline">
          {BRAND_TAGLINE_LINES[0]}
          <br />
          {BRAND_TAGLINE_LINES[1]}
        </span>
      ) : null}
    </Link>
  );
}
