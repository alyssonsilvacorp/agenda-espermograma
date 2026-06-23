import { Download, FileUp, Trash2 } from "lucide-react";
import type { Appointment, BackupPayload, BlockedDate, Settings } from "../types/appointment";
import { storageService } from "../services/storage";

type BackupManagerProps = {
  appointments: Appointment[];
  blockedDates: BlockedDate[];
  settings: Settings;
  importAppointments: (appointments: Appointment[]) => void;
  importBlockedDates: (blockedDates: BlockedDate[]) => void;
  setSettings: (settings: Settings) => void;
  clearAll: () => void;
  notify: (message: string) => void;
};

export default function BackupManager({
  appointments,
  blockedDates,
  settings,
  importAppointments,
  importBlockedDates,
  setSettings,
  clearAll,
  notify,
}: BackupManagerProps) {
  const exportBackup = () => {
    const payload: BackupPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      appointments,
      settings,
      blockedDates,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `agenda-espermograma-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify("Backup exportado.");
  };

  const importBackup = async (file?: File) => {
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text()) as BackupPayload;
      storageService.importBackup(payload);
      importAppointments(payload.appointments ?? []);
      importBlockedDates(payload.blockedDates ?? []);
      setSettings(payload.settings ?? settings);
      notify("Backup importado.");
    } catch {
      notify("Não foi possível importar o backup.");
    }
  };

  const handleClear = () => {
    if (!window.confirm("Tem certeza que deseja limpar todos os dados?")) return;
    clearAll();
    notify("Dados limpos.");
  };

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <button type="button" onClick={exportBackup} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">
        <Download size={17} aria-hidden="true" />
        Exportar backup
      </button>
      <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        <FileUp size={17} aria-hidden="true" />
        Importar backup
        <input type="file" accept="application/json" className="sr-only" onChange={(event) => importBackup(event.target.files?.[0])} />
      </label>
      <button type="button" onClick={handleClear} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-rose-300 bg-white px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50">
        <Trash2 size={17} aria-hidden="true" />
        Limpar dados
      </button>
    </section>
  );
}
