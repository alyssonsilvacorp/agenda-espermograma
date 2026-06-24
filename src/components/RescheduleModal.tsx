import { useEffect, useState } from "react";
import { CalendarClock, X } from "lucide-react";
import { SCHEDULE_TIMES, type Appointment, type BlockedDate, type ScheduleTime } from "../types/appointment";
import { formatDate } from "../utils/dates";
import { getBlockedDateInfo } from "../utils/blockedDates";

type RescheduleModalProps = {
  appointment?: Appointment;
  open: boolean;
  blockedDates: BlockedDate[];
  onClose: () => void;
  onRequestOnly: (reason?: string) => string | null;
  onReschedule: (newDate: string, newTime: string, reason?: string) => string | null;
  requestAdminAccess: (action: () => void) => void;
};

export default function RescheduleModal({
  appointment,
  open,
  blockedDates,
  onClose,
  onRequestOnly,
  onReschedule,
  requestAdminAccess,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState<ScheduleTime | "">("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setNewDate("");
    setNewTime("");
    setReason("");
    setError("");
  }, [open]);

  if (!open || !appointment) return null;

  const submitRequestOnly = () => {
    requestAdminAccess(() => {
      const submitError = onRequestOnly(reason);
      if (submitError) {
        setError(submitError);
        return;
      }
      onClose();
    });
  };

  const submitReschedule = () => {
    requestAdminAccess(() => {
      if (getBlockedDateInfo(newDate, blockedDates)) {
        setError("Não é possível reagendar para uma data bloqueada.");
        return;
      }
      const submitError = onReschedule(newDate, newTime, reason);
      if (submitError) {
        setError(submitError);
        return;
      }
      onClose();
    });
  };

  const blockedDateInfo = getBlockedDateInfo(newDate, blockedDates);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4 no-print">
      <div className="w-full max-w-2xl rounded-t-md bg-white p-5 shadow-soft sm:rounded-md">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">Solicitar/Reagendar</h2>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" title="Fechar">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {error && <div className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</div>}
        {blockedDateInfo && (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            Não é possível reagendar para uma data bloqueada. {blockedDateInfo.reason}
          </div>
        )}

        <div className="mt-5 grid gap-3 rounded-md bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
          <p><strong>Nome:</strong> {appointment.patientName}</p>
          <p><strong>Telefone:</strong> {appointment.phone}</p>
          <p><strong>Exame:</strong> {appointment.examType}</p>
          <p><strong>Atual:</strong> {formatDate(appointment.date)} às {appointment.time}</p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Nova data
            <input
              type="date"
              value={newDate}
              onChange={(event) => setNewDate(event.target.value)}
              className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Novo horário
            <select
              value={newTime}
              onChange={(event) => setNewTime(event.target.value as ScheduleTime)}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Selecione</option>
              {SCHEDULE_TIMES.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
            Motivo opcional
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              className="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={submitRequestOnly} className="inline-flex min-h-11 items-center justify-center rounded-md border border-amber-300 px-4 text-sm font-semibold text-amber-800 hover:bg-amber-50">
            Apenas solicitou
          </button>
          <button type="button" onClick={submitReschedule} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">
            <CalendarClock size={17} aria-hidden="true" />
            Reagendar
          </button>
        </div>
      </div>
    </div>
  );
}
