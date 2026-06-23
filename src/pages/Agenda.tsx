import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import AppointmentForm from "../components/AppointmentForm";
import DatePicker from "../components/DatePicker";
import ScheduleSlotCard from "../components/ScheduleSlotCard";
import {
  SCHEDULE_TIMES,
  type Appointment,
  type AppointmentDraft,
  type BlockedDate,
  type ScheduleTime,
} from "../types/appointment";
import { getBlockedDateInfo } from "../utils/blockedDates";
import {
  formatLongDate,
  getAppointmentInSlot,
  isDateFull,
  isWeekend,
  todayInputValue,
} from "../utils/dates";

type AgendaProps = {
  appointments: Appointment[];
  blockedDates: BlockedDate[];
  createAppointment: (draft: AppointmentDraft) => string | null;
  notify: (message: string) => void;
};

export default function Agenda({
  appointments,
  blockedDates,
  createAppointment,
  notify,
}: AgendaProps) {
  const [selectedDate, setSelectedDate] = useState(todayInputValue());
  const [selectedTime, setSelectedTime] = useState<ScheduleTime | "">("");
  const [formOpen, setFormOpen] = useState(false);

  const dayAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.date === selectedDate),
    [appointments, selectedDate],
  );
  const activeDayAppointments = dayAppointments.filter(
    (appointment) => appointment.status !== "Cancelado",
  );
  const weekend = isWeekend(selectedDate);
  const full = isDateFull(appointments, selectedDate);
  const blockedDateInfo = getBlockedDateInfo(selectedDate, blockedDates);
  const blocked = Boolean(blockedDateInfo);

  const openForm = (time?: ScheduleTime) => {
    if (blocked) return;
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
        <div className={`grid gap-3 sm:items-end ${blocked ? "sm:grid-cols-[220px]" : "sm:grid-cols-[220px_auto]"}`}>
          <DatePicker value={selectedDate} onChange={setSelectedDate} />
          {!blocked && (
            <button
              type="button"
              onClick={() => openForm()}
              disabled={weekend || full}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Plus size={17} aria-hidden="true" />
              Novo agendamento
            </button>
          )}
        </div>
      </section>

      {blockedDateInfo && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-5 py-4 text-rose-900">
          <h3 className="text-xl font-semibold">Agenda fechada nesta data</h3>
          <p className="mt-1 text-sm">
            <strong>{blockedDateInfo.type}:</strong> {blockedDateInfo.reason}
          </p>
        </div>
      )}

      {blocked && activeDayAppointments.length > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Esta data foi bloqueada, mas existem agendamentos cadastrados. Verifique os pacientes.
        </div>
      )}

      {!blocked && weekend && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Sábado e domingo estão indisponíveis.
        </div>
      )}

      {!blocked && !weekend && full && (
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
            disabled={blocked || weekend || full}
            unavailableText={
              blocked
                ? "Agenda fechada nesta data"
                : weekend
                  ? "Fim de semana indisponível"
                  : undefined
            }
            onSchedule={openForm}
          />
        ))}
      </section>

      <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <span className="text-sm text-slate-600">
          Total de vagas: <strong>{blocked ? 0 : SCHEDULE_TIMES.length}</strong>
        </span>
        <span className="text-sm text-slate-600">
          Agendamentos: <strong>{activeDayAppointments.length}</strong>
        </span>
        <span className="text-sm text-slate-600">
          Disponíveis: <strong>{blocked ? 0 : SCHEDULE_TIMES.length - activeDayAppointments.length}</strong>
        </span>
      </div>

      <AppointmentForm
        open={formOpen}
        title="Novo agendamento"
        initialDate={selectedDate}
        initialTime={selectedTime}
        blockedDates={blockedDates}
        onClose={() => setFormOpen(false)}
        onSubmit={submit}
      />
    </div>
  );
}
