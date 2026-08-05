import type { ReactNode } from "react";

function Shell({ children, size = 16 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="admin-nav-link__icon"
    >
      {children}
    </svg>
  );
}

export function AdminNavIcon({ href }: { href: string }) {
  switch (href) {
    case "/admin":
      return (
        <Shell>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
        </Shell>
      );
    case "/admin/leads":
      return (
        <Shell>
          <path d="M4.5 7.5h15v10.2a1.3 1.3 0 0 1-1.3 1.3H5.8a1.3 1.3 0 0 1-1.3-1.3V7.5Z" />
          <path d="m4.5 7.5 7.5 5.2L19.5 7.5" />
        </Shell>
      );
    case "/admin/home":
      return (
        <Shell>
          <path d="M4.5 11.2 12 4.8l7.5 6.4" />
          <path d="M7 10.5V19h10v-8.5" />
        </Shell>
      );
    case "/admin/slides":
      return (
        <Shell>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path d="m8 14 2.4-2.8 2.2 2.1 2.7-3.3L17.5 14" />
        </Shell>
      );
    case "/admin/promos":
      return (
        <Shell>
          <path d="M5 8.5h7l5.5-3v13l-5.5-3H5a1.5 1.5 0 0 1-1.5-1.5v-4A1.5 1.5 0 0 1 5 8.5Z" />
          <path d="M8.5 15.5v2.2" />
        </Shell>
      );
    case "/admin/faq":
      return (
        <Shell>
          <circle cx="12" cy="12" r="8.25" />
          <path d="M9.6 9.4a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1.1.9-1.1 1.7" />
          <path d="M12 16.6h.01" />
        </Shell>
      );
    case "/admin/brands":
      return (
        <Shell>
          <path d="M12 4.5 14.2 9l4.8.5-3.6 3.3.999 4.7L12 15.4 7.6 17.5l1-4.7L5 9.5 9.8 9 12 4.5Z" />
        </Shell>
      );
    case "/admin/advantages":
      return (
        <Shell>
          <path d="M12 4.8v14.4" />
          <path d="M7.2 9.2 12 4.8l4.8 4.4" />
          <path d="M6.5 19.2h11" />
        </Shell>
      );
    case "/admin/products":
      return (
        <Shell>
          <path d="M4.5 8.2 12 4.5l7.5 3.7v7.6L12 19.5l-7.5-3.7V8.2Z" />
          <path d="M12 12v7.5" />
          <path d="M4.5 8.2 12 12l7.5-3.8" />
        </Shell>
      );
    case "/admin/categories":
      return (
        <Shell>
          <path d="M3.8 8.2h7.2l1.5 1.6H20.2v8.4a1.4 1.4 0 0 1-1.4 1.4H5.2a1.4 1.4 0 0 1-1.4-1.4V8.2Z" />
          <path d="M3.8 8.2V6.6A1.4 1.4 0 0 1 5.2 5.2h4.1l1.4 1.5" />
        </Shell>
      );
    case "/admin/pages":
      return (
        <Shell>
          <path d="M7 4.5h7.2L19 9.3V18a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 18V6A1.5 1.5 0 0 1 7 4.5Z" />
          <path d="M14 4.7V9h4.5" />
        </Shell>
      );
    case "/admin/settings":
      return (
        <Shell>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4.5v2.2M12 17.3v2.2M4.5 12h2.2M17.3 12h2.2M6.4 6.4l1.6 1.6M16 16l1.6 1.6M17.6 6.4 16 8M8 16l-1.6 1.6" />
        </Shell>
      );
    case "/admin/integrations":
      return (
        <Shell>
          <path d="M8.5 8.5h7v7h-7z" />
          <path d="M5 10.5v3M19 10.5v3M10.5 5h3M10.5 19h3" />
        </Shell>
      );
    default:
      return (
        <Shell>
          <circle cx="12" cy="12" r="3.5" />
        </Shell>
      );
  }
}
