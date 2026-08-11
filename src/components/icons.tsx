import type { ReactNode } from "react";

type IconProps = {
  size?: number;
  className?: string;
};

function IconShell({
  size = 18,
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
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className ?? "block"}
    >
      {children}
    </svg>
  );
}

export function IconPhone({ size, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path d="M6.5 3.75h3.2l1.1 3.35-1.7 1.05a12.2 12.2 0 0 0 5.75 5.75l1.05-1.7 3.35 1.1v3.2A1.75 1.75 0 0 1 17.5 18.5 13.75 13.75 0 0 1 3.75 4.75 1.75 1.75 0 0 1 6.5 3.75Z" />
    </IconShell>
  );
}

export function IconBag({ size, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path d="M7.5 8.25h9l.85 10.1a1.5 1.5 0 0 1-1.5 1.65H8.15a1.5 1.5 0 0 1-1.5-1.65L7.5 8.25Z" />
      <path d="M9.25 8.25V7a2.75 2.75 0 0 1 5.5 0v1.25" />
    </IconShell>
  );
}

export function IconMenu({ size, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path d="M4.5 7.25h15" />
      <path d="M4.5 12h15" />
      <path d="M4.5 16.75h15" />
    </IconShell>
  );
}

export function IconClose({ size, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path d="M6.5 6.5 17.5 17.5" />
      <path d="M17.5 6.5 6.5 17.5" />
    </IconShell>
  );
}

export function IconHeart({ size, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path d="M12 19.25s-6.5-3.85-6.5-8.15A3.6 3.6 0 0 1 12 7.85a3.6 3.6 0 0 1 6.5 3.25C18.5 15.4 12 19.25 12 19.25Z" />
    </IconShell>
  );
}

export function IconHeartFilled({ size, className }: IconProps) {
  return (
    <svg
      width={size ?? 18}
      height={size ?? 18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className ?? "block"}
    >
      <path d="M12 19.25s-6.5-3.85-6.5-8.15A3.6 3.6 0 0 1 12 7.85a3.6 3.6 0 0 1 6.5 3.25C18.5 15.4 12 19.25 12 19.25Z" />
    </svg>
  );
}

export function IconCompare({ size, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <path d="M7.25 5.5v13" />
      <path d="M4.75 8.25 7.25 5.5l2.5 2.75" />
      <path d="M16.75 18.5v-13" />
      <path d="M19.25 15.75 16.75 18.5l-2.5-2.75" />
    </IconShell>
  );
}

export function IconSearch({ size, className }: IconProps) {
  return (
    <IconShell size={size} className={className}>
      <circle cx="11" cy="11" r="5.75" />
      <path d="M16.25 16.25 20.5 20.5" />
    </IconShell>
  );
}
