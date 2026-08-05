import Image from "next/image";

/** Placeholder block for images that will be uploaded later. */
export function ImageSlot({
  src,
  alt,
  label,
  className = "",
  sizes = "100vw",
  aspectClass = "aspect-[4/3]",
}: {
  src?: string | null;
  alt: string;
  label?: string;
  className?: string;
  sizes?: string;
  aspectClass?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-dashed border-navy/20 bg-pearl ${aspectClass} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <span className="text-2xl text-navy/25" aria-hidden>
            ▢
          </span>
          <p className="text-sm text-muted">{label || "Место под изображение"}</p>
        </div>
      )}
    </div>
  );
}
