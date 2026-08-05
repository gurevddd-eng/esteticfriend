"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { useYandexVideoBg } from "@/hooks/useYandexVideoBg";
import type { SiteInfo } from "@/lib/catalog";

const HERO_SOURCES = {
  webm: "/hero/main.webm",
  mp4: "/hero/main.mp4",
} as const;

export function Hero({ site }: { site: SiteInfo }) {
  const { videoRef, canvasRef, useStaticPoster, useCanvas, hideCanvas } =
    useYandexVideoBg(HERO_SOURCES);

  return (
    <section className="hero">
      <div className="hero__media" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/poster.webp"
          alt=""
          className="hero__poster"
          decoding="async"
          fetchPriority="high"
        />
        {!useStaticPoster ? (
          <video
            ref={videoRef}
            className="hero__video hero__video--hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/hero/poster.webp"
            disablePictureInPicture
          >
            <source src="/hero/main.mp4" type="video/mp4" />
            <source src="/hero/main.webm" type="video/webm" />
          </video>
        ) : null}
        {useCanvas ? (
          <canvas
            ref={canvasRef}
            className={`hero__canvas${hideCanvas ? " hero__canvas--pending" : ""}`}
          />
        ) : null}
        <div className="hero__shade" />
      </div>

      <div className="hero__content container-shell">
        <div className="hero__copy">
          <BrandLogo
            href="/"
            size="xl"
            className="hero__brand animate-rise pointer-events-none"
            logoUrl={site.logoUrl}
          />
          <h1 className="hero__title animate-rise-delay">
            {site.heroTitle}
            <span className="hero__title-line">{site.heroTitleLine}</span>
          </h1>
          <p className="hero__text animate-rise-delay-2">{site.heroText}</p>
          <div className="hero__actions animate-rise-delay-2">
            <Link href="/catalog" className="btn-primary">
              {site.heroCtaPrimary}
            </Link>
            <Link href="/#consult" className="hero__consult">
              {site.heroCtaSecondary}
            </Link>
          </div>
          <p className="hero__meta animate-rise-delay-2">{site.cities}</p>
        </div>
      </div>
    </section>
  );
}
