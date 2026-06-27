import { CalendarDays, ClipboardList, LayoutDashboard, Settings } from "lucide-react";
import { useState, type ReactNode } from "react";
import Navbar from "./Navbar";

export type PageKey = "dashboard" | "agenda" | "agendamentos" | "configuracoes";

type LayoutProps = {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  children: ReactNode;
};

export const navItems = [
  { key: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { key: "agenda" as const, label: "Agenda", icon: CalendarDays },
  { key: "agendamentos" as const, label: "Agendamentos", icon: ClipboardList },
  { key: "configuracoes" as const, label: "Configurações", icon: Settings },
];

export default function Layout({ activePage, onNavigate, children }: LayoutProps) {
  const [logoAvailable, setLogoAvailable] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="no-print border-b border-sky-100 bg-white">
        <div className="h-1 bg-amber-400" />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {logoAvailable ? (
              <img
                src="/hapvida-logo.png"
                alt="Hapvida Diagnóstico"
                onError={() => setLogoAvailable(false)}
                className="h-12 w-28 shrink-0 object-contain object-left sm:h-14 sm:w-36"
              />
            ) : (
              <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-md bg-sky-700 text-lg font-bold text-white">
                H+
              </div>
            )}
            <div className="min-w-0 border-l border-slate-200 pl-3">
              <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl">Agenda Espermograma</h1>
              <p className="text-sm text-slate-500">Diagnóstico Maceió Oldemburgo Paranhos</p>
            </div>
          </div>
          <Navbar activePage={activePage} onNavigate={onNavigate} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

      <footer className="no-print border-t border-slate-200 bg-white px-4 py-4 text-center text-xs text-sky-700">
        Sistema criado por Alysson Tech
      </footer>
    </div>
  );
}
