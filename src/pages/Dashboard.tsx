import {
  CalendarCheck,
  CalendarClock,
  CalendarOff,
  CheckCircle2,
  ClipboardList,
  TestTube2,
  Users,
  XCircle,
} from "lucide-react";
import type { PageKey } from "../components/Layout";
import DashboardCards from "../components/DashboardCards";
import AppointmentStatusBadge from "../components/AppointmentStatusBadge";
import {
  EXAM_TYPES,
  SCHEDULE_TIMES,
  type Appointment,
  type BlockedDate,
  type Settings,
} from "../types/appointment";
import { getBlockedDateInfo } from "../utils/blockedDates";
import { formatLongDate, todayInputValue } from "../utils/dates";

type DashboardProps = {
  appointments: Appointment[];
  blockedDates: BlockedDate[];
  settings: Settings;
  onNavigate: (page: PageKey) => void;
};

export default function Dashboard({ appointments, blockedDates, onNavigate }: DashboardProps) {
  const today = todayInputValue();
  const todayAppointments = appointments.filter((appointment) => appointment.date === today);
  const activeToday = todayAppointments.filter((appointment) => appointment.status !== "Cancelado");
  const confirmed = todayAppointments.filter((appointment) => appointment.status === "Confirmado").length;
  const canceled = todayAppointments.filter((appointment) => appointment.status === "Cancelado").length;
  const rescheduleRequests = appointments.filter(
    (appointment) => appointment.status === "Solicitou reagendamento",
  ).length;
  const blockedDateInfo = getBlockedDateInfo(today, blockedDates);
  const blocked = Boolean(blockedDateInfo);

  const cards = [
    {
      title: blocked ? "Agenda fechada hoje" : "Vagas do dia",
      value: blocked ? 0 : SCHEDULE_TIMES.length,
      helper: blockedDateInfo?.reason ?? formatLongDate(today),
      icon: blocked ? CalendarOff : CalendarCheck,
    },
    { title: "Agendamentos", value: activeToday.length, helper: "Pacientes ativos hoje", icon: Users },
    {
      title: "Disponíveis",
      value: blocked ? 0 : SCHEDULE_TIMES.length - activeToday.length,
      helper: "Vagas restantes",
      icon: ClipboardList,
    },
    { title: "Confirmados", value: confirmed, helper: "Presenças confirmadas", icon: CheckCircle2 },
    { title: "Cancelados", value: canceled, helper: "Cancelamentos do dia", icon: XCircle },
    {
      title: "Reagendamentos",
      value: rescheduleRequests,
      helper: "Solicitações em aberto",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Data atual</p>
          <h2 className="text-2xl font-semibold text-slate-950">{formatLongDate(today)}</h2>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("agenda")}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Abrir agenda
        </button>
      </section>

      <DashboardCards cards={cards} />

      {blockedDateInfo && (
        <section className="rounded-md border border-rose-300 bg-rose-50 px-5 py-4 text-rose-900">
          <h3 className="text-lg font-semibold">Agenda fechada hoje</h3>
          <p className="mt-1 text-sm"><strong>{blockedDateInfo.type}:</strong> {blockedDateInfo.reason}</p>
          {activeToday.length > 0 && (
            <p className="mt-2 text-sm font-medium text-amber-800">
              Esta data foi bloqueada, mas existem agendamentos cadastrados. Verifique os pacientes.
            </p>
          )}
        </section>
      )}

      <section className="grid gap-3 lg:grid-cols-3">
        {EXAM_TYPES.map((examType) => (
          <article key={examType} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <TestTube2 size={21} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{examType}</p>
                <strong className="text-2xl text-slate-950">
                  {todayAppointments.filter((appointment) => appointment.examType === examType).length}
                </strong>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-950">Agendamentos do dia</h3>
          <span className="text-sm text-slate-500">{todayAppointments.length} registro(s)</span>
        </div>
        {todayAppointments.length === 0 ? (
          <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">Nenhum agendamento para hoje.</p>
        ) : (
          <div className="grid gap-2">
            {todayAppointments.map((appointment) => (
              <article key={appointment.id} className="grid gap-2 rounded-md border border-slate-100 p-3 sm:grid-cols-[0.45fr_1fr_1fr_auto] sm:items-center">
                <strong className="text-slate-950">{appointment.time}</strong>
                <span className="font-medium text-slate-800">{appointment.patientName}</span>
                <span className="text-sm text-slate-600">{appointment.examType}</span>
                <AppointmentStatusBadge status={appointment.status} />
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
