import { CalendarPlus, Lock } from "lucide-react";
import type { Appointment, ScheduleTime } from "../types/appointment";
import AppointmentStatusBadge from "./AppointmentStatusBadge";

type ScheduleSlotCardProps = {
  time: ScheduleTime;
  appointment?: Appointment;
  disabled?: boolean;
  unavailableText?: string;
  onSchedule: (time: ScheduleTime) => void;
};

export default function ScheduleSlotCard({
  time,
  appointment,
  disabled,
  unavailableText,
  onSchedule,
}: ScheduleSlotCardProps) {
  const occupied = Boolean(appointment);

  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">Horário</p>
          <strong className="mt-1 block text-2xl text-slate-950">{time}</strong>
        </div>

        <div className="min-w-0 flex-1 rounded-md bg-slate-50 p-3">
          {appointment ? (
            <div className="grid gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="break-words text-slate-950">{appointment.patientName}</strong>
                <AppointmentStatusBadge status={appointment.status} />
              </div>
              <span className="text-sm text-slate-600">{appointment.examType}</span>
            </div>
          ) : unavailableText ? (
            <div className="flex items-center gap-2 text-sm font-medium text-rose-700">
              <Lock size={16} aria-hidden="true" />
              Indisponível
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Disponível
            </div>
          )}
          {unavailableText && <p className="mt-2 text-sm text-amber-700">{unavailableText}</p>}
        </div>

        <button
          type="button"
          disabled={occupied || disabled}
          onClick={() => onSchedule(time)}
          className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
            occupied || disabled
              ? "cursor-not-allowed bg-slate-200 text-slate-500"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {occupied || disabled ? <Lock size={17} aria-hidden="true" /> : <CalendarPlus size={17} aria-hidden="true" />}
          {occupied ? "Ocupado" : disabled ? "Indisponível" : "Agendar"}
        </button>
      </div>
    </article>
  );
}
