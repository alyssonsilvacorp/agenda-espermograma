import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import AppointmentForm from "../components/AppointmentForm";
import DatePicker from "../components/DatePicker";
import ScheduleSlotCard from "../components/ScheduleSlotCard";
import { SCHEDULE_TIMES, type Appointment, type AppointmentDraft, type ScheduleTime } from "../types/appointment";
import { formatLongDate, getAppointmentInSlot, isDateFull, isWeekend, todayInputValue } from "../utils/dates";

type AgendaProps = {
  appointments: Appointment[];
  createAppointment: (draft: AppointmentDraft) => string | null;
  notify: (message: string) => void;
};

export default function Agenda({ appointments, createAppointment, notify }: AgendaProps) {
  const [selectedDate, setSelectedDate] = useState(todayInputValue());
  const [selectedTime, setSelectedTime] = useState<ScheduleTime | "">("");
  const [formOpen, setFormOpen] = useState(false);

  const dayAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.date === selectedDate),
    [appointments, selectedDate],
  );
  const activeDayAppointments = dayAppointments.filter((appointment) => appointment.status !== "Cancelado");
  const weekend = isWeekend(selectedDate);
  const full = isDateFull(appointments, selectedDate);

  const openForm = (time?: ScheduleTime) => {
    setSelectedTime(time ?? "");
    setFormOpen(true);
  };

  const submit = (draft: AppointmentDraft) => {
    const error = createAppointment(draft);
    if (!error) notify("Agendamento salvo.");
    return error;
  };

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Agenda</h2>
          <p className="text-sm text-slate-500">{formatLongDate(selectedDate)}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[220px_auto] sm:items-end">
          <DatePicker value={selectedDate} onChange={setSelectedDate} />
          <button type="button" onClick={() => openForm()} disabled={weekend || full} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300">
            <Plus size={17} aria-hidden="true" />
            Novo agendamento
          </button>
        </div>
      </section>

      {weekend && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Sábado e domingo estão indisponíveis.
        </div>
      )}

      {!weekend && full && (
        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          Todas as vagas deste dia já foram preenchidas.
        </div>
      )}

      <section className="grid gap-3">
        {SCHEDULE_TIMES.map((time) => (
          <ScheduleSlotCard
            key={time}
            time={time}
            appointment={getAppointmentInSlot(appointments, selectedDate, time)}
            disabled={weekend || full}
            unavailableText={weekend ? "Fim de semana indisponível" : undefined}
            onSchedule={openForm}
          />
        ))}
      </section>

      <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <span className="text-sm text-slate-600">Total de vagas: <strong>{SCHEDULE_TIMES.length}</strong></span>
        <span className="text-sm text-slate-600">Agendamentos: <strong>{activeDayAppointments.length}</strong></span>
        <span className="text-sm text-slate-600">Disponíveis: <strong>{SCHEDULE_TIMES.length - activeDayAppointments.length}</strong></span>
      </div>

      <AppointmentForm
        open={formOpen}
        title="Novo agendamento"
        initialDate={selectedDate}
        initialTime={selectedTime}
        onClose={() => setFormOpen(false)}
        onSubmit={submit}
      />
    </div>
  );
}
