import { useState } from "react";
import BackupManager from "../components/BackupManager";
import BlockedDatesManager from "../components/BlockedDatesManager";
import DatePicker from "../components/DatePicker";
import PrintDaySchedule from "../components/PrintDaySchedule";
import type { Appointment, BlockedDate, BlockedDateType, Settings } from "../types/appointment";
import { todayInputValue } from "../utils/dates";
import { LockKeyhole } from "lucide-react";

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
  requestAdminAccess: (action: () => void) => void;
  lockAdminAccess: () => void;
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
  requestAdminAccess,
  lockAdminAccess,
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
            onChange={(event) => {
              const clinicName = event.target.value;
              requestAdminAccess(() => setSettings({ ...settings, clinicName }));
            }}
            className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </section>

      <BlockedDatesManager
        appointments={appointments}
        blockedDates={blockedDates}
        addBlockedDate={addBlockedDate}
        removeBlockedDate={removeBlockedDate}
        notify={notify}
        requestAdminAccess={requestAdminAccess}
      />

      <section className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Backup e restauração</h3>
          <p className="text-sm text-slate-500">Exporte os dados ou restaure um arquivo JSON.</p>
        </div>
        <BackupManager
          appointments={appointments}
          blockedDates={blockedDates}
          settings={settings}
          importAppointments={importAppointments}
          importBlockedDates={importBlockedDates}
          setSettings={setSettings}
          clearAll={clearAll}
          notify={notify}
          requestAdminAccess={requestAdminAccess}
        />
      </section>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Impressão da agenda</h3>
          <p className="text-sm text-slate-500">Selecione uma data para gerar a versão de impressão.</p>
        </div>
        <DatePicker label="Data para impressão" value={selectedDate} onChange={setSelectedDate} />
        <PrintDaySchedule
          appointments={appointments}
          blockedDates={blockedDates}
          selectedDate={selectedDate}
          settings={settings}
        />
      </section>

      <section className="grid gap-4 rounded-md border border-sky-200 bg-sky-50 p-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Acesso administrativo</h3>
          <p className="text-sm text-slate-600">
            Use esta opção para exigir a senha novamente ao acessar configurações ou executar ações sensíveis.
          </p>
        </div>
        <button
          type="button"
          onClick={lockAdminAccess}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-sky-700 px-4 text-sm font-semibold text-white hover:bg-sky-800 sm:w-fit"
        >
          <LockKeyhole size={17} aria-hidden="true" />
          Bloquear acesso administrativo
        </button>
      </section>
    </div>
  );
}
