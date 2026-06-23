import { CalendarOff, Edit, LockKeyhole, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  BLOCKED_DATE_TYPES,
  type Appointment,
  type BlockedDate,
  type BlockedDateType,
} from "../types/appointment";
import { formatDate, todayInputValue } from "../utils/dates";

type BlockedDatesManagerProps = {
  appointments: Appointment[];
  blockedDates: BlockedDate[];
  addBlockedDate: (date: string, reason: string, type: BlockedDateType | "") => string | null;
  removeBlockedDate: (id: string) => void;
  notify: (message: string) => void;
};

export default function BlockedDatesManager({
  appointments,
  blockedDates,
  addBlockedDate,
  removeBlockedDate,
  notify,
}: BlockedDatesManagerProps) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState<BlockedDateType | "">("");
  const [error, setError] = useState("");

  const saveBlockedDate = (targetDate = date) => {
    const submitError = addBlockedDate(targetDate, reason, type);
    if (submitError) {
      setError(submitError);
      return;
    }
    setError("");
    setDate("");
    setReason("");
    setType("");
    notify(targetDate === todayInputValue() ? "Agenda de hoje fechada." : "Data bloqueada.");
  };

  const editBlockedDate = (blockedDate: BlockedDate) => {
    setDate(blockedDate.date);
    setReason(blockedDate.reason);
    setType(blockedDate.type);
    setError("");
  };

  const unblockDate = (blockedDate: BlockedDate) => {
    removeBlockedDate(blockedDate.id);
    notify("Data desbloqueada.");
  };

  return (
    <section className="grid gap-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-700">
          <CalendarOff size={21} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Fechar agenda / Datas bloqueadas</h3>
          <p className="text-sm text-slate-500">Cadastre feriados, manutenção ou ausência de equipe.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1fr_1.5fr_auto] lg:items-end">
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Data
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Tipo do bloqueio
          <select
            value={type}
            onChange={(event) => setType(event.target.value as BlockedDateType | "")}
            className="h-11 rounded-md border border-slate-300 bg-white px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Selecione</option>
            {BLOCKED_DATE_TYPES.map((blockedDateType) => (
              <option key={blockedDateType} value={blockedDateType}>{blockedDateType}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Motivo
          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Ex.: unidade fechada"
            className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <button
          type="button"
          onClick={() => saveBlockedDate()}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-rose-700 px-4 text-sm font-semibold text-white hover:bg-rose-800"
        >
          <LockKeyhole size={17} aria-hidden="true" />
          Bloquear data
        </button>
      </div>

      <button
        type="button"
        onClick={() => saveBlockedDate(todayInputValue())}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-rose-300 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50 sm:w-fit"
      >
        <CalendarOff size={17} aria-hidden="true" />
        Fechar agenda hoje
      </button>

      <div className="grid gap-2">
        {blockedDates.length === 0 ? (
          <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">Nenhuma data bloqueada.</p>
        ) : (
          blockedDates.map((blockedDate) => {
            const existingAppointments = appointments.filter(
              (appointment) =>
                appointment.date === blockedDate.date && appointment.status !== "Cancelado",
            );
            return (
              <article key={blockedDate.id} className="grid gap-3 border-t border-slate-100 py-4 first:border-t-0 sm:grid-cols-[0.75fr_1fr_1.5fr_auto] sm:items-start">
                <strong className="text-slate-950">{formatDate(blockedDate.date)}</strong>
                <span className="text-sm font-medium text-slate-700">{blockedDate.type}</span>
                <div>
                  <p className="text-sm text-slate-700">{blockedDate.reason}</p>
                  {existingAppointments.length > 0 && (
                    <p className="mt-2 text-sm font-medium text-amber-700">
                      Esta data foi bloqueada, mas existem agendamentos cadastrados. Verifique os pacientes.
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => editBlockedDate(blockedDate)}
                    title="Editar bloqueio"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <Edit size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => unblockDate(blockedDate)}
                    title="Desbloquear data"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-rose-300 px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Desbloquear data
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
