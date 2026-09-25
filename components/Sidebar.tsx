import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import BrandMark from "@/components/BrandMark";

const NAV_ITEMS = [
  { label: "Account", href: "/MainMenu" },
  { label: "Profile", href: "/Profile" },
  { label: "Transactions", href: "/Transaction" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    router.push("/Login");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#dbe7e1] bg-white/88 px-4 py-3 shadow-sm backdrop-blur md:hidden">
        <Link href="/MainMenu" className="flex items-center gap-3">
          <BrandMark size="sm" />
          <div><p className="text-sm font-semibold text-[#102522]">MaskVault</p><p className="text-xs text-[#667a75]">Data masking</p></div>
        </Link>
        <button type="button" onClick={() => setIsOpen((value) => !value)} aria-label="Toggle navigation menu" className="grid h-10 w-10 place-items-center rounded-xl border border-[#dbe7e1] text-[#102522] transition hover:bg-[#f1f7f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147a60]"><MenuIcon open={isOpen} /></button>
      </header>

      {isOpen && <button type="button" aria-label="Close navigation menu" className="fixed inset-0 z-40 bg-[#062d26]/35 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} />}
      <div className={`fixed right-0 top-0 z-50 flex h-full w-72 flex-col justify-between border-l border-[#dbe7e1] bg-white p-6 shadow-2xl transition-transform duration-300 md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div>
          <div className="flex items-center justify-between border-b border-[#dbe7e1] pb-5"><div className="flex items-center gap-3"><BrandMark size="sm" /><span className="font-semibold text-[#102522]">Menu</span></div><button type="button" onClick={() => setIsOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl text-[#667a75] hover:bg-[#f1f7f4]" aria-label="Close menu"><MenuIcon open /></button></div>
          <Navigation pathname={pathname} onNavigate={() => setIsOpen(false)} />
        </div>
        <SignOutButton onClick={handleSignOut} />
      </div>

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col justify-between border-r border-[#dbe7e1] bg-white px-6 py-8 md:flex">
        <div><Link href="/MainMenu" className="mb-10 flex items-center gap-3"><BrandMark /><div><p className="text-lg font-semibold tracking-[-0.03em] text-[#102522]">MaskVault</p><p className="text-sm text-[#667a75]">Secure Data Masking</p></div></Link><Navigation pathname={pathname} /></div>
        <div className="space-y-4"><div className="rounded-2xl border border-[#dbe7e1] bg-[#f7faf8] p-4 text-sm leading-6 text-[#667a75]"><p className="font-semibold text-[#102522]">Production access</p><p className="mt-1">All activity is logged for audit review.</p></div><SignOutButton onClick={handleSignOut} /></div>
      </aside>
    </>
  );
}

function Navigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return <nav className="mt-6 flex flex-col gap-2" aria-label="Primary navigation">{NAV_ITEMS.map((item) => { const isActive = pathname === item.href; return <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={isActive ? "page" : undefined} className={`rounded-2xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147a60] ${isActive ? "bg-[#083a31] text-white shadow-sm" : "text-[#667a75] hover:bg-[#f1f7f4] hover:text-[#102522]"}`}>{item.label}</Link>; })}</nav>;
}

function SignOutButton({ onClick }: { onClick: () => void }) { return <button type="button" className="w-full rounded-2xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-left text-sm font-semibold text-[#b93838] transition hover:bg-[#ffecec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b93838]" onClick={onClick}>Sign out</button>; }
function MenuIcon({ open }: { open?: boolean }) { return <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">{open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />}</svg>; }
