import { Printer } from "lucide-react";
import type { Appointment, Settings } from "../types/appointment";
import { SCHEDULE_TIMES } from "../types/appointment";
import { formatDate } from "../utils/dates";

type PrintDayScheduleProps = {
  appointments: Appointment[];
  selectedDate: string;
  settings: Settings;
};

export default function PrintDaySchedule({ appointments, selectedDate, settings }: PrintDayScheduleProps) {
  const dayAppointments = appointments.filter((appointment) => appointment.date === selectedDate);

  return (
    <section className="grid gap-4">
      <button type="button" onClick={() => window.print()} className="no-print inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 sm:w-fit">
        <Printer size={17} aria-hidden="true" />
        Imprimir agenda do dia
      </button>

      <div id="print-area" className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 border-b border-slate-200 pb-3">
          <h2 className="text-xl font-semibold text-slate-950">{settings.clinicName}</h2>
          <p className="text-sm text-slate-600">Agenda do dia {formatDate(selectedDate)}</p>
        </div>
        <div className="grid gap-2">
          {SCHEDULE_TIMES.map((time) => {
            const appointment = dayAppointments.find((item) => item.time === time && item.status !== "Cancelado");
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
      </div>
    </section>
  );
}
