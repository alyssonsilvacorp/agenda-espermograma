import { CalendarClock, Check, Edit, RotateCcw, Search, UserCheck, UserX, XCircle } from "lucide-react";
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
                className="h-11 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </span>
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Tipo de exame
            <select
              value={examFilter}
              onChange={(event) => setExamFilter(event.target.value as ExamType | "")}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todos</option>
              {EXAM_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as AppointmentStatus | "")}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todos</option>
              {APPOINTMENT_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.1fr_0.8fr_1fr_0.75fr_0.9fr_1.8fr] gap-3 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase text-slate-500 lg:grid">
          <span>Paciente</span>
          <span>Telefone</span>
          <span>Exame</span>
          <span>Data</span>
          <span>Status</span>
          <span>Ações</span>
        </div>

        {filteredAppointments.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">Nenhum agendamento encontrado.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((appointment) => (
              <article key={appointment.id} className="grid gap-3 px-4 py-4 lg:grid-cols-[1.1fr_0.8fr_1fr_0.75fr_0.9fr_1.8fr] lg:items-start">
                <div>
                  <p className="font-semibold text-slate-950">{appointment.patientName}</p>
                  <p className="text-xs text-slate-500 lg:hidden">{appointment.phone}</p>
                </div>
                <span className="hidden text-sm text-slate-600 lg:block">{appointment.phone}</span>
                <span className="text-sm text-slate-600">{appointment.examType}</span>
                <span className="text-sm text-slate-600">{formatDate(appointment.date)} às {appointment.time}</span>
                <AppointmentStatusBadge status={appointment.status} />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onEdit(appointment)} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <Edit size={14} aria-hidden="true" /> Editar
                  </button>
                  <button type="button" onClick={() => onStatus(appointment.id, "Confirmado")} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-emerald-200 px-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                    <Check size={14} aria-hidden="true" /> Confirmar
                  </button>
                  <button type="button" onClick={() => onStatus(appointment.id, "Cancelado")} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-rose-200 px-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                    <XCircle size={14} aria-hidden="true" /> Cancelar
                  </button>
                  <button type="button" onClick={() => onStatus(appointment.id, "Faltou")} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <UserX size={14} aria-hidden="true" /> Faltou
                  </button>
                  <button type="button" onClick={() => onStatus(appointment.id, "Realizado")} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-green-200 px-2.5 text-xs font-semibold text-green-700 hover:bg-green-50">
                    <UserCheck size={14} aria-hidden="true" /> Realizado
                  </button>
                  <button type="button" onClick={() => onReschedule(appointment)} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-blue-200 px-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-50">
                    <CalendarClock size={14} aria-hidden="true" /> Solicitar/Reagendar
                  </button>
                  <WhatsAppMessageButton appointment={appointment} type="agendamento" label="Copiar agendamento" mode="copy" onDone={notify} />
                  <WhatsAppMessageButton appointment={appointment} type="confirmacao" label="Copiar confirmação" mode="copy" onDone={notify} />
                  <WhatsAppMessageButton appointment={appointment} type="reagendamento" label="Copiar reagendamento" mode="copy" onDone={notify} />
                  <WhatsAppMessageButton appointment={appointment} type="cancelamento" label="Copiar cancelamento" mode="copy" onDone={notify} />
                  <WhatsAppMessageButton appointment={appointment} type="confirmacao" label="WhatsApp Web" mode="open" onDone={notify} />
                  <button type="button" onClick={() => onStatus(appointment.id, "Agendado")} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <RotateCcw size={14} aria-hidden="true" /> Agendado
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
