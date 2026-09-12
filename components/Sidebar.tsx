"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "My Account", href: "/main-menu" },
  { label: "Profile", href: "/profile" },
  { label: "Transaction", href: "/transaction" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col justify-between bg-green-200 px-6 py-10">
      <div>
        <div className="mx-auto mb-10 flex h-32 w-32 items-center justify-center rounded-full bg-green-700 text-white">
          <span className="text-sm font-medium">Logo</span>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-5 py-3 text-base transition-colors ${
                  isActive
                    ? "bg-white text-green-900 shadow-sm"
                    : "text-green-950 hover:bg-white/40"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        className="text-left text-lg font-medium text-red-600 hover:text-red-700"
      >
        Sign Out
      </button>
    </aside>
  );
}