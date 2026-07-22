import type { ReviewDTO } from "@/lib/content";
import type { HomepageContent } from "@/lib/site";

export function Reviews({
  reviews,
  content,
}: {
  reviews: ReviewDTO[];
  content: HomepageContent["reviews"];
}) {
  return (
    <section className="section-pad">
      <div className="container-shell">
        <p className="section-kicker">{content.kicker}</p>
        <h2 className="section-title mt-3">{content.title}</h2>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <blockquote
              key={review.id}
              className="rounded-[1.4rem] border border-[var(--line)] bg-white p-7"
            >
              <p className="font-[family-name:var(--font-syne)] text-xl font-bold text-navy">
                {review.title}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{review.text}</p>
              <footer className="mt-6 text-sm font-semibold text-ink">
                {review.author}
                {review.age ? (
                  <span className="font-normal text-muted">, {review.age} года</span>
                ) : null}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
