import type { AppointmentStatus } from "../types/appointment";

const statusClasses: Record<AppointmentStatus, string> = {
  Agendado: "bg-sky-100 text-sky-800",
  Confirmado: "bg-teal-100 text-teal-800",
  "Solicitou reagendamento": "bg-amber-100 text-amber-800",
  Reagendado: "bg-cyan-100 text-cyan-800",
  Cancelado: "bg-rose-100 text-rose-800",
  Faltou: "bg-slate-200 text-slate-800",
  Realizado: "bg-cyan-100 text-cyan-800",
};

export default function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-md px-2.5 text-xs font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
