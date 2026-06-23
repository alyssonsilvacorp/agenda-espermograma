import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Save, X } from "lucide-react";
import {
  EXAM_TYPES,
  SCHEDULE_TIMES,
  type Appointment,
  type AppointmentDraft,
  type ExamType,
  type ScheduleTime,
} from "../types/appointment";

type AppointmentFormProps = {
  open: boolean;
  title: string;
  initialDate?: string;
  initialTime?: ScheduleTime | "";
  appointment?: Appointment;
  onClose: () => void;
  onSubmit: (draft: AppointmentDraft) => string | null;
};

const emptyDraft: AppointmentDraft = {
  patientName: "",
  phone: "",
  examType: "",
  date: "",
  time: "",
};

export default function AppointmentForm({
  open,
  title,
  initialDate = "",
  initialTime = "",
  appointment,
  onClose,
  onSubmit,
}: AppointmentFormProps) {
  const [draft, setDraft] = useState<AppointmentDraft>(emptyDraft);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setDraft(
      appointment
        ? {
            patientName: appointment.patientName,
            phone: appointment.phone,
            examType: appointment.examType,
            date: appointment.date,
            time: appointment.time,
          }
        : { ...emptyDraft, date: initialDate, time: initialTime },
    );
  }, [appointment, initialDate, initialTime, open]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const submitError = onSubmit(draft);
    if (submitError) {
      setError(submitError);
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4 no-print">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-t-md bg-white p-5 shadow-soft sm:rounded-md">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" title="Fechar">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {error && <div className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</div>}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
            Nome completo
            <input
              value={draft.patientName}
              onChange={(event) => setDraft({ ...draft, patientName: event.target.value })}
              className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Telefone/WhatsApp
            <input
              value={draft.phone}
              onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
              className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Tipo de exame
            <select
              value={draft.examType}
              onChange={(event) => setDraft({ ...draft, examType: event.target.value as ExamType })}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Selecione</option>
              {EXAM_TYPES.map((examType) => (
                <option key={examType} value={examType}>
                  {examType}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Data
            <input
              type="date"
              value={draft.date}
              onChange={(event) => setDraft({ ...draft, date: event.target.value })}
              className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Horário
            <select
              value={draft.time}
              onChange={(event) => setDraft({ ...draft, time: event.target.value as ScheduleTime })}
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
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700">
            Cancelar
          </button>
          <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">
            <Save size={17} aria-hidden="true" />
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
