import { useState } from "react";
import BackupManager from "../components/BackupManager";
import DatePicker from "../components/DatePicker";
import PrintDaySchedule from "../components/PrintDaySchedule";
import type { Appointment, Settings } from "../types/appointment";
import { todayInputValue } from "../utils/dates";

type ConfiguracoesProps = {
  appointments: Appointment[];
  settings: Settings;
  setSettings: (settings: Settings) => void;
  importAppointments: (appointments: Appointment[]) => void;
  clearAll: () => void;
  notify: (message: string) => void;
};

export default function Configuracoes({
  appointments,
  settings,
  setSettings,
  importAppointments,
  clearAll,
  notify,
}: ConfiguracoesProps) {
  const [selectedDate, setSelectedDate] = useState(todayInputValue());

  return (
    <div className="grid gap-6">
      <section>
        <h2 className="text-2xl font-semibold text-slate-950">Configurações</h2>
        <p className="text-sm text-slate-500">Dados locais, backup JSON e impressão da agenda.</p>
      </section>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Nome da unidade/clínica
          <input
            value={settings.clinicName}
            onChange={(event) => setSettings({ ...settings, clinicName: event.target.value })}
            className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </section>

      <BackupManager
        appointments={appointments}
        settings={settings}
        importAppointments={importAppointments}
        setSettings={setSettings}
        clearAll={clearAll}
        notify={notify}
      />

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <DatePicker label="Data para impressão" value={selectedDate} onChange={setSelectedDate} />
        <PrintDaySchedule appointments={appointments} selectedDate={selectedDate} settings={settings} />
      </section>
    </div>
  );
}
