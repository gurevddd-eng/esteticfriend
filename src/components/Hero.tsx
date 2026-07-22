import Link from "next/link";
import { SITE } from "@/lib/content";

export function Hero() {
  return (
    <section className="hero-plane">
      <div className="hero-glow" aria-hidden />

      <div className="hero-copy-wrap container-shell">
        <div className="hero-copy">
          <p className="brand-mark animate-rise text-sm text-frost/90 md:text-base">
            {SITE.name}
          </p>
          <h1 className="animate-rise-delay mt-5 font-[family-name:var(--font-syne)] leading-[1.08] font-bold text-white">
            Косметологические аппараты для салонов красоты
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            Более 1000 специалистов уже работают на подобном оборудовании. Подберём
            аппарат под задачи вашего кабинета.
          </p>
          <div className="animate-rise-delay-2 mt-9 flex flex-wrap gap-3">
            <Link href="/catalog" className="btn-primary">
              Перейти в каталог
            </Link>
            <Link href="/#consult" className="btn-ghost">
              Получить консультацию
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
          aria-label="Видео ESTETIC FRIEND"
        >
          <source src="/hero/main.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
