import { Activity, CalendarDays, ClipboardList, LayoutDashboard, Settings } from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";

export type PageKey = "dashboard" | "agenda" | "agendamentos" | "configuracoes";

type LayoutProps = {
  activePage: PageKey;
  clinicName: string;
  onNavigate: (page: PageKey) => void;
  children: ReactNode;
};

export const navItems = [
  { key: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { key: "agenda" as const, label: "Agenda", icon: CalendarDays },
  { key: "agendamentos" as const, label: "Agendamentos", icon: ClipboardList },
  { key: "configuracoes" as const, label: "Configurações", icon: Settings },
];

export default function Layout({ activePage, clinicName, onNavigate, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="no-print border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
              <Activity size={24} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl">Agenda Espermograma</h1>
              <p className="text-sm text-slate-500">{clinicName}</p>
            </div>
          </div>
          <Navbar activePage={activePage} onNavigate={onNavigate} />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
