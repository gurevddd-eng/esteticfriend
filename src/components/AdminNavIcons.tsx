import type { ReactNode } from "react";

function Shell({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="admin-nav-link__icon"
    >
      {children}
    </svg>
  );
}

/** Sidebar icons keyed by admin route — one clear metaphor per item. */
export function AdminNavIcon({ href }: { href: string }) {
  switch (href) {
    case "/admin":
      return (
        <Shell>
          <rect x="3.5" y="3.5" width="7.25" height="7.25" rx="1.5" />
          <rect x="13.25" y="3.5" width="7.25" height="7.25" rx="1.5" />
          <rect x="3.5" y="13.25" width="7.25" height="7.25" rx="1.5" />
          <rect x="13.25" y="13.25" width="7.25" height="7.25" rx="1.5" />
        </Shell>
      );

    case "/admin/leads":
      return (
        <Shell>
          <path d="M4.25 7.25h15.5v10.1a1.4 1.4 0 0 1-1.4 1.4H5.65a1.4 1.4 0 0 1-1.4-1.4V7.25Z" />
          <path d="m4.25 7.25 7.75 5.35L19.75 7.25" />
        </Shell>
      );

    case "/admin/home":
      return (
        <Shell>
          <path d="M4.25 11.1 12 4.5l7.75 6.6" />
          <path d="M6.75 10.35V19.5h10.5v-9.15" />
          <path d="M10 19.5v-5.25h4V19.5" />
        </Shell>
      );

    case "/admin/slides":
      return (
        <Shell>
          <rect x="3.5" y="5.25" width="17" height="12.5" rx="2" />
          <circle cx="8.25" cy="9.75" r="1.35" />
          <path d="m7.25 15.5 2.85-3.15 2.2 2 2.85-3.35 3.1 4.5" />
        </Shell>
      );

    case "/admin/promos":
      return (
        <Shell>
          <path d="M5 8.35h6.6l5.9-3.1v13.5l-5.9-3.1H5A1.6 1.6 0 0 1 3.4 14V10a1.6 1.6 0 0 1 1.6-1.65Z" />
          <path d="M8.35 15.75v2.5" />
          <path d="M15.4 9.35v5.3" />
        </Shell>
      );

    case "/admin/faq":
      return (
        <Shell>
          <circle cx="12" cy="12" r="8.35" />
          <path d="M9.55 9.55a2.45 2.45 0 1 1 3.55 2.2c-.75.4-1.2.95-1.2 1.85" />
          <path d="M12 16.85h.01" />
        </Shell>
      );

    case "/admin/advantages":
      return (
        <Shell>
          <path d="M5 7.25h4.25" />
          <path d="M5 12h4.25" />
          <path d="M5 16.75h4.25" />
          <path d="m12.25 6.5 1.85 1.85L18.5 4.85" />
          <path d="m12.25 11.25 1.85 1.85L18.5 9.6" />
          <path d="m12.25 16 1.85 1.85L18.5 14.35" />
        </Shell>
      );

    case "/admin/products":
      return (
        <Shell>
          <path d="M4.35 8.15 12 4.35l7.65 3.8v7.7L12 19.65l-7.65-3.8V8.15Z" />
          <path d="M12 12.05v7.6" />
          <path d="M4.35 8.15 12 12.05l7.65-3.9" />
        </Shell>
      );

    case "/admin/categories":
      return (
        <Shell>
          <path d="M3.75 8.35h7.1l1.55 1.65h8.1v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.35Z" />
          <path d="M3.75 8.35V6.7A1.5 1.5 0 0 1 5.25 5.2h4.15l1.45 1.55" />
        </Shell>
      );

    case "/admin/brands":
      return (
        <Shell>
          <circle cx="12" cy="12" r="8.35" />
          <path d="M12 7.4 13.35 10.5l3.35.35-2.55 2.2.75 3.25L12 14.7l-2.9 1.6.75-3.25-2.55-2.2 3.35-.35L12 7.4Z" />
        </Shell>
      );

    case "/admin/pages":
      return (
        <Shell>
          <path d="M7 4.35h7.1L18.75 9.1V18a1.65 1.65 0 0 1-1.65 1.65H7A1.65 1.65 0 0 1 5.35 18V6A1.65 1.65 0 0 1 7 4.35Z" />
          <path d="M14 4.55V9.1h4.55" />
          <path d="M8.75 12.5h6.5M8.75 15.75h4.75" />
        </Shell>
      );

    case "/admin/certificates":
      return (
        <Shell>
          <rect x="5.25" y="3.75" width="13.5" height="12.5" rx="1.6" />
          <path d="M8.5 7.5h7M8.5 10.5h5.25" />
          <path d="M10.25 16.25 12 18.75l1.75-2.5" />
          <path d="M9.35 16.25h5.3" />
        </Shell>
      );

    case "/admin/settings":
      return (
        <Shell>
          <circle cx="12" cy="12" r="3.1" />
          <path d="M12 3.75v2.35M12 17.9v2.35M3.75 12h2.35M17.9 12h2.35M6.2 6.2l1.65 1.65M16.15 16.15l1.65 1.65M17.8 6.2l-1.65 1.65M7.85 16.15 6.2 17.8" />
        </Shell>
      );

    case "/admin/contact-widget":
      return (
        <Shell>
          <path d="M7.25 18.75 5.5 20.5V8.25A1.75 1.75 0 0 1 7.25 6.5h9.5A1.75 1.75 0 0 1 18.5 8.25v7A1.75 1.75 0 0 1 16.75 17H9.1l-1.85 1.75Z" />
          <path d="M9 10.75h6M9 13.5h4.25" />
        </Shell>
      );

    case "/admin/integrations":
      return (
        <Shell>
          <path d="M9.25 8.5V6.35A2.35 2.35 0 0 1 11.6 4h.8a2.35 2.35 0 0 1 2.35 2.35V8.5" />
          <rect x="7.25" y="8.5" width="9.5" height="7.75" rx="1.6" />
          <path d="M12 16.25v3.5M9.5 19.75h5" />
          <path d="M10 12h4" />
        </Shell>
      );

    default:
      return (
        <Shell>
          <circle cx="12" cy="12" r="8.35" />
          <path d="M12 8v4.25M12 15.75h.01" />
        </Shell>
      );
  }
}
