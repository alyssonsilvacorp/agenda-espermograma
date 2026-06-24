import {
  CalendarClock,
  Check,
  ChevronDown,
  Edit,
  RotateCcw,
  Search,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  APPOINTMENT_STATUSES,
  EXAM_TYPES,
  type Appointment,
  type AppointmentStatus,
  type ExamType,
} from "../types/appointment";
import { formatDate } from "../utils/dates";
import AppointmentStatusBadge from "./AppointmentStatusBadge";
import DatePicker from "./DatePicker";
import WhatsAppMessageButton from "./WhatsAppMessageButton";

type AppointmentListProps = {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onStatus: (id: string, status: AppointmentStatus) => void;
  onReschedule: (appointment: Appointment) => void;
  notify: (message: string) => void;
};

export default function AppointmentList({
  appointments,
  onEdit,
  onStatus,
  onReschedule,
  notify,
}: AppointmentListProps) {
  const [dateFilter, setDateFilter] = useState("");
  const [query, setQuery] = useState("");
  const [examFilter, setExamFilter] = useState<ExamType | "">("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "">("");

  const filteredAppointments = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return appointments.filter((appointment) => {
      const matchesDate = !dateFilter || appointment.date === dateFilter;
      const matchesQuery =
        !normalizedQuery ||
        appointment.patientName.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        appointment.phone.toLocaleLowerCase("pt-BR").includes(normalizedQuery);
      const matchesExam = !examFilter || appointment.examType === examFilter;
      const matchesStatus = !statusFilter || appointment.status === statusFilter;
      return matchesDate && matchesQuery && matchesExam && matchesStatus;
    });
  }, [appointments, dateFilter, examFilter, query, statusFilter]);

  return (
    <section className="grid gap-4">
      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr_1fr_1fr]">
          <DatePicker label="Filtrar por data" value={dateFilter} onChange={setDateFilter} />
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Buscar por nome ou telefone
            <span className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              />
            </span>
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Tipo de exame
            <select
              value={examFilter}
              onChange={(event) => setExamFilter(event.target.value as ExamType | "")}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">Todos</option>
              {EXAM_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as AppointmentStatus | "")}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">Todos</option>
              {APPOINTMENT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-visible rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.15fr_0.8fr_0.55fr_1fr_0.9fr_2.15fr] gap-3 border-b border-slate-200 bg-slate-100 px-3 py-2.5 text-xs font-semibold uppercase text-slate-500 lg:grid">
          <span>Paciente</span>
          <span>Data</span>
          <span>Horário</span>
          <span>Exame</span>
          <span>Status</span>
          <span>Ações</span>
        </div>

        {filteredAppointments.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">Nenhum agendamento encontrado.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((appointment) => {
              const primaryMessage = appointment.status === "Confirmado" ? "confirmacao" : "agendamento";
              return (
                <article
                  key={appointment.id}
                  className="grid gap-2 px-3 py-3 lg:grid-cols-[1.15fr_0.8fr_0.55fr_1fr_0.9fr_2.15fr] lg:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">{appointment.patientName}</p>
                    <p className="text-xs text-slate-500">{appointment.phone}</p>
                  </div>
                  <span className="text-sm text-slate-600">{formatDate(appointment.date)}</span>
                  <strong className="text-sm text-slate-800">{appointment.time}</strong>
                  <span className="text-sm text-slate-600">{appointment.examType}</span>
                  <AppointmentStatusBadge status={appointment.status} />

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(appointment)}
                      className="inline-flex min-h-8 items-center gap-1 rounded-md border border-slate-200 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Edit size={13} aria-hidden="true" /> Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onStatus(appointment.id, "Confirmado")}
                      className="inline-flex min-h-8 items-center gap-1 rounded-md border border-teal-200 px-2 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                    >
                      <Check size={13} aria-hidden="true" /> Confirmar
                    </button>
                    <WhatsAppMessageButton
                      appointment={appointment}
                      type={primaryMessage}
                      label="WhatsApp"
                      mode="open"
                      onDone={notify}
                      compact
                    />
                    <details className="relative">
                      <summary className="inline-flex min-h-8 cursor-pointer list-none items-center gap-1 rounded-md border border-sky-200 px-2 text-xs font-semibold text-sky-700 hover:bg-sky-50">
                        Mais ações <ChevronDown size={13} aria-hidden="true" />
                      </summary>
                      <div className="absolute right-0 z-30 mt-1 grid w-56 gap-1 rounded-md border border-slate-200 bg-white p-2 shadow-soft">
                        <button type="button" onClick={() => onStatus(appointment.id, "Cancelado")} className="menu-action text-rose-700">
                          <XCircle size={14} /> Cancelar
                        </button>
                        <button type="button" onClick={() => onStatus(appointment.id, "Faltou")} className="menu-action">
                          <UserX size={14} /> Faltou
                        </button>
                        <button type="button" onClick={() => onStatus(appointment.id, "Realizado")} className="menu-action text-teal-700">
                          <UserCheck size={14} /> Realizado
                        </button>
                        <button type="button" onClick={() => onStatus(appointment.id, "Agendado")} className="menu-action">
                          <RotateCcw size={14} /> Marcar como agendado
                        </button>
                        <button type="button" onClick={() => onReschedule(appointment)} className="menu-action text-sky-700">
                          <CalendarClock size={14} /> Solicitar/Reagendar
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <WhatsAppMessageButton appointment={appointment} type="agendamento" label="Copiar agendamento" mode="copy" onDone={notify} menuItem />
                        <WhatsAppMessageButton appointment={appointment} type="confirmacao" label="Copiar confirmação" mode="copy" onDone={notify} menuItem />
                        <WhatsAppMessageButton appointment={appointment} type="reagendamento" label="Copiar reagendamento" mode="copy" onDone={notify} menuItem />
                        <WhatsAppMessageButton appointment={appointment} type="cancelamento" label="Copiar cancelamento" mode="copy" onDone={notify} menuItem />
                        <WhatsAppMessageButton appointment={appointment} type="confirmacao" label="Abrir WhatsApp Web" mode="open" onDone={notify} menuItem />
                      </div>
                    </details>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
