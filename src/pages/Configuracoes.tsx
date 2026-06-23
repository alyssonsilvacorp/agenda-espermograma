import { useState } from "react";
import BackupManager from "../components/BackupManager";
import BlockedDatesManager from "../components/BlockedDatesManager";
import DatePicker from "../components/DatePicker";
import PrintDaySchedule from "../components/PrintDaySchedule";
import type { Appointment, BlockedDate, BlockedDateType, Settings } from "../types/appointment";
import { todayInputValue } from "../utils/dates";

type ConfiguracoesProps = {
  appointments: Appointment[];
  settings: Settings;
  blockedDates: BlockedDate[];
  setSettings: (settings: Settings) => void;
  importAppointments: (appointments: Appointment[]) => void;
  importBlockedDates: (blockedDates: BlockedDate[]) => void;
  addBlockedDate: (date: string, reason: string, type: BlockedDateType | "") => string | null;
  removeBlockedDate: (id: string) => void;
  clearAll: () => void;
  notify: (message: string) => void;
};

export default function Configuracoes({
  appointments,
  settings,
  blockedDates,
  setSettings,
  importAppointments,
  importBlockedDates,
  addBlockedDate,
  removeBlockedDate,
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
        blockedDates={blockedDates}
        settings={settings}
        importAppointments={importAppointments}
        importBlockedDates={importBlockedDates}
        setSettings={setSettings}
        clearAll={clearAll}
        notify={notify}
      />

      <BlockedDatesManager
        appointments={appointments}
        blockedDates={blockedDates}
        addBlockedDate={addBlockedDate}
        removeBlockedDate={removeBlockedDate}
        notify={notify}
      />

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <DatePicker label="Data para impressão" value={selectedDate} onChange={setSelectedDate} />
        <PrintDaySchedule
          appointments={appointments}
          blockedDates={blockedDates}
          selectedDate={selectedDate}
          settings={settings}
        />
      </section>
    </div>
  );
}
