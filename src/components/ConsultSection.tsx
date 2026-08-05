"use client";

import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { useYandexVideoBg } from "@/hooks/useYandexVideoBg";
import type { SiteInfo } from "@/lib/catalog";

const CONSULT_SOURCES = {
  webm: "/about/company.webm",
  mp4: "/about/company.mp4",
} as const;

export function ConsultSection({ site }: { site: SiteInfo }) {
  const { videoRef, canvasRef, useStaticPoster, useCanvas, hideCanvas } =
    useYandexVideoBg(CONSULT_SOURCES);

  return (
    <section id="consult" className="consult">
      <div className="consult__media" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about/about-1.webp"
          alt=""
          className="consult__poster"
          decoding="async"
        />
        {!useStaticPoster ? (
          <video
            ref={videoRef}
            className="consult__video consult__video--hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/about/about-1.webp"
            disablePictureInPicture
          >
            <source src="/about/company.mp4" type="video/mp4" />
            <source src="/about/company.webm" type="video/webm" />
          </video>
        ) : null}
        {useCanvas ? (
          <canvas
            ref={canvasRef}
            className={`consult__canvas${hideCanvas ? " consult__canvas--pending" : ""}`}
          />
        ) : null}
        <div className="consult__veil" />
      </div>

      <div className="consult__layout">
        <div className="consult__intro">
          <p className="consult__kicker">Свяжитесь с нами</p>
          <h2 className="consult__title">
            Оставьте заявку — подготовим подходящее предложение
          </h2>
          <p className="consult__text">
            Менеджер ответит в ближайшее время и подберёт аппарат под задачи вашего
            салона или клиники.
          </p>

          <div className="consult__contacts">
            <a href={site.phoneHref} className="consult__contact">
              <span className="consult__contact-label">Телефон</span>
              <span className="consult__contact-value">{site.phone}</span>
            </a>
            <a href={`mailto:${site.email}`} className="consult__contact">
              <span className="consult__contact-label">Email</span>
              <span className="consult__contact-value">{site.email}</span>
            </a>
            <div className="consult__contact">
              <span className="consult__contact-label">Города</span>
              <span className="consult__contact-value">{site.cities}</span>
            </div>
          </div>

          <Link href="/catalog" className="consult__catalog">
            Смотреть каталог →
          </Link>
        </div>

        <div className="consult__form">
          <p className="consult__form-title">Заявка на консультацию</p>
          <LeadForm source="home-consult" />
        </div>
      </div>
    </section>
  );
}
