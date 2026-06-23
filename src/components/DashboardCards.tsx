import type { LucideIcon } from "lucide-react";

type DashboardCard = {
  title: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
};

export default function DashboardCards({ cards }: { cards: DashboardCard[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.title} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <strong className="mt-2 block text-3xl font-semibold text-slate-950">{card.value}</strong>
                {card.helper && <span className="mt-1 block text-xs text-slate-500">{card.helper}</span>}
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                <Icon size={21} aria-hidden="true" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
