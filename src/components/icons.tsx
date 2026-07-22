import type { ReactNode } from "react";

type IconProps = {
  size?: number;
  className?: string;
};

/** Shared shell — Heroicons 24 outline proportions */
function IconShell({
  size = 20,
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className ?? "block"}
    >
      {children}
    </svg>
  );
}

/** Callback — Heroicons Phone */
export function IconPhone({ size, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </IconShell>
  );
}

/** Cart — Heroicons Shopping Bag (better for beauty retail than a trolley) */
export function IconBag({ size, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </IconShell>
  );
}

export function IconMenu({ size, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path d="M3.75 6.75h16.5" />
      <path d="M3.75 12h16.5" />
      <path d="M3.75 17.25h16.5" />
    </IconShell>
  );
}

export function IconClose({ size, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path d="M6 18 18 6" />
      <path d="M6 6l12 12" />
    </IconShell>
  );
}
