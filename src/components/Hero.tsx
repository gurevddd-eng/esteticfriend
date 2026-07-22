import Link from "next/link";
import type { HomepageContent } from "@/lib/site";

export function Hero({ content }: { content: HomepageContent["hero"] }) {
  return (
    <section className="hero-plane">
      <div className="hero-glow" aria-hidden />

      <div className="hero-copy-wrap container-shell">
        <div className="hero-copy">
          <p className="brand-mark animate-rise text-sm text-frost/90 md:text-base">
            {content.brand}
          </p>
          <h1 className="animate-rise-delay mt-5 font-[family-name:var(--font-syne)] leading-[1.08] font-bold text-white">
            {content.title}
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            {content.text}
          </p>
          <div className="animate-rise-delay-2 mt-9 flex flex-wrap gap-3">
            <Link href={content.primaryCtaHref} className="btn-primary">
              {content.primaryCtaLabel}
            </Link>
            <Link href={content.secondaryCtaHref} className="btn-ghost">
              {content.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-video-full animate-rise-delay-2">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={content.brand}
        >
          <source src={content.videoSrc} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
