import { Printer } from "lucide-react";
import { SCHEDULE_TIMES, type Appointment, type BlockedDate, type Settings } from "../types/appointment";
import { getBlockedDateInfo } from "../utils/blockedDates";
import { formatDate } from "../utils/dates";

type PrintDayScheduleProps = {
  appointments: Appointment[];
  blockedDates: BlockedDate[];
  selectedDate: string;
  settings: Settings;
};

export default function PrintDaySchedule({
  appointments,
  blockedDates,
  selectedDate,
  settings,
}: PrintDayScheduleProps) {
  const dayAppointments = appointments.filter((appointment) => appointment.date === selectedDate);
  const blockedDateInfo = getBlockedDateInfo(selectedDate, blockedDates);

  return (
    <section className="grid gap-4">
      <button
        type="button"
        onClick={() => window.print()}
        className="no-print inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 sm:w-fit"
      >
        <Printer size={17} aria-hidden="true" />
        Imprimir agenda do dia
      </button>

      <div id="print-area" className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 border-b border-slate-200 pb-3">
          <h2 className="text-xl font-semibold text-slate-950">{settings.clinicName}</h2>
          <p className="text-sm text-slate-600">Agenda do dia {formatDate(selectedDate)}</p>
        </div>

        {blockedDateInfo ? (
          <div className="grid gap-3 rounded-md border border-rose-300 bg-rose-50 p-5">
            <h3 className="text-xl font-semibold text-rose-900">Agenda fechada</h3>
            <p className="text-sm text-rose-900">
              <strong>{blockedDateInfo.type}:</strong> {blockedDateInfo.reason}
            </p>
            {dayAppointments.some((appointment) => appointment.status !== "Cancelado") && (
              <p className="text-sm font-medium text-amber-800">
                Esta data foi bloqueada, mas existem agendamentos cadastrados. Verifique os pacientes.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-2">
            {SCHEDULE_TIMES.map((time) => {
              const appointment = dayAppointments.find(
                (item) => item.time === time && item.status !== "Cancelado",
              );
              return (
                <div key={time} className="grid gap-2 rounded-md border border-slate-200 p-3 sm:grid-cols-[0.5fr_1fr_0.8fr_1fr_0.7fr]">
                  <strong>{time}</strong>
                  <span>{appointment?.patientName ?? "Disponível"}</span>
                  <span>{appointment?.phone ?? "-"}</span>
                  <span>{appointment?.examType ?? "-"}</span>
                  <span>{appointment?.status ?? "-"}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
