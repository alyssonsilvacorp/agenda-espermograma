import type { Appointment, BackupPayload, Settings } from "../types/appointment";

const APPOINTMENTS_KEY = "agenda-espermograma:appointments";
const SETTINGS_KEY = "agenda-espermograma:settings";

const fallbackSettings: Settings = {
  clinicName: "Minha unidade",
};

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const storageService = {
  getAppointments: () => readJson<Appointment[]>(APPOINTMENTS_KEY, []),
  saveAppointments: (appointments: Appointment[]) => {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  },
  getSettings: () => readJson<Settings>(SETTINGS_KEY, fallbackSettings),
  saveSettings: (settings: Settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
  exportBackup: (): BackupPayload => ({
    version: 1,
    exportedAt: new Date().toISOString(),
    appointments: storageService.getAppointments(),
    settings: storageService.getSettings(),
  }),
  importBackup: (payload: BackupPayload) => {
    storageService.saveAppointments(payload.appointments ?? []);
    storageService.saveSettings(payload.settings ?? fallbackSettings);
  },
  clearAll: () => {
    localStorage.removeItem(APPOINTMENTS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  },
};
