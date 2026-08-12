import Link from "next/link";
import { FOOTER_WORDMARK_URL, HEADER_LOGO_URL, SITE } from "@/lib/content";

export function FooterBrandLockup({
  href = "/",
  className = "",
  logoUrl = null,
}: {
  href?: string;
  className?: string;
  logoUrl?: string | null;
}) {
  if (logoUrl && logoUrl !== HEADER_LOGO_URL) {
    return (
      <Link
        href={href}
        className={`site-footer__logo brand-logo brand-logo--image inline-flex shrink-0 items-center${className ? ` ${className}` : ""}`}
        aria-label={SITE.name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={SITE.name} className="brand-logo__img brand-logo__img--lg" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`site-footer__brand-lockup${className ? ` ${className}` : ""}`}
      aria-label={SITE.name}
    >
      <span className="site-footer__brand-mark-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FOOTER_WORDMARK_URL}
          alt={SITE.name}
          className="site-footer__brand-mark"
        />
      </span>
    </Link>
  );
}
