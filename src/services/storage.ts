import { DEFAULT_BLOCKED_DATES } from "../data/defaultBlockedDates";
import type { Appointment, BackupPayload, BlockedDate, Settings } from "../types/appointment";

const APPOINTMENTS_KEY = "agenda-espermograma:appointments";
const SETTINGS_KEY = "agenda-espermograma:settings";
const BLOCKED_DATES_KEY = "agenda-espermograma-blocked-dates";

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
  getBlockedDates: () => {
    if (localStorage.getItem(BLOCKED_DATES_KEY) === null) {
      return DEFAULT_BLOCKED_DATES.map((blockedDate) => ({ ...blockedDate }));
    }
    const blockedDates = readJson<BlockedDate[]>(BLOCKED_DATES_KEY, []);
    return blockedDates.filter(
      (blockedDate, index) =>
        blockedDates.findIndex((candidate) => candidate.date === blockedDate.date) === index,
    );
  },
  saveBlockedDates: (blockedDates: BlockedDate[]) => {
    localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(blockedDates));
  },
  addBlockedDate: (blockedDate: BlockedDate) => {
    const current = storageService.getBlockedDates();
    const next = [
      ...current.filter((item) => item.date !== blockedDate.date),
      blockedDate,
    ];
    storageService.saveBlockedDates(next);
    return next;
  },
  removeBlockedDate: (id: string) => {
    const next = storageService.getBlockedDates().filter((blockedDate) => blockedDate.id !== id);
    storageService.saveBlockedDates(next);
    return next;
  },
  exportBackup: (): BackupPayload => ({
    version: 1,
    exportedAt: new Date().toISOString(),
    appointments: storageService.getAppointments(),
    settings: storageService.getSettings(),
    blockedDates: storageService.getBlockedDates(),
  }),
  importBackup: (payload: BackupPayload) => {
    storageService.saveAppointments(payload.appointments ?? []);
    storageService.saveSettings(payload.settings ?? fallbackSettings);
    storageService.saveBlockedDates(payload.blockedDates ?? []);
  },
  clearAll: () => {
    localStorage.removeItem(APPOINTMENTS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(BLOCKED_DATES_KEY);
  },
};
