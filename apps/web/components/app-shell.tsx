import Link from "next/link";
import { Crown, Gamepad2, Shield, Trophy, Wallet } from "lucide-react";
import { ReactNode } from "react";

const nav = [
  { href: "/", label: "Lobby", icon: Gamepad2 },
  { href: "/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/admin", label: "Admin", icon: Shield }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 text-ink">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Crown className="h-6 w-6 text-amber" aria-hidden />
            BCGS
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-steel hover:bg-slate-100"
              >
                <item.icon className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
    </main>
  );
}
