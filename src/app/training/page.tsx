import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Обучение",
};

export default function TrainingPage() {
  return (
    <div className="section-pad">
      <div className="container-shell max-w-3xl">
        <p className="section-kicker">Обучение</p>
        <h1 className="section-title mt-3">Обучение аппаратным методикам</h1>
        <div className="mt-8 space-y-5 text-muted leading-relaxed">
          <p>
            При покупке оборудования проводим бесплатное сертифицированное обучение.
            Специалист освоит методику работы на аппарате и сможет сразу запускать
            процедуры для клиентов.
          </p>
          <p>
            Обучение помогает быстрее окупить вложения и уверенно предлагать услуги
            в вашем салоне или клинике.
          </p>
        </div>
        <Link href="/#consult" className="btn-primary mt-8 inline-flex">
          Записаться на консультацию
        </Link>
      </div>
    </div>
  );
}
