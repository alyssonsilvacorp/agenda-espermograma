import { useEffect, useMemo, useState } from "react";
import type {
  Appointment,
  AppointmentDraft,
  AppointmentStatus,
  Settings,
} from "../types/appointment";
import { isExamType } from "../types/appointment";
import { storageService } from "../services/storage";
import { isValidScheduleTime, validateSlot } from "../utils/dates";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => storageService.getAppointments());
  const [settings, setSettingsState] = useState<Settings>(() => storageService.getSettings());

  useEffect(() => {
    storageService.saveAppointments(appointments);
  }, [appointments]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`) ||
        a.patientName.localeCompare(b.patientName),
      ),
    [appointments],
  );

  const createAppointment = (draft: AppointmentDraft) => {
    const slotError = validateSlot(appointments, draft.date, draft.time);
    if (slotError) return slotError;
    if (!draft.patientName.trim()) return "Nome obrigatório.";
    if (!draft.phone.trim()) return "Telefone obrigatório.";
    if (!isExamType(draft.examType)) return "Tipo de exame obrigatório.";
    if (!isValidScheduleTime(draft.time)) return "Horário inválido.";

    const now = new Date().toISOString();
    const examType = draft.examType;
    const time = draft.time;
    setAppointments((current) => [
      ...current,
      {
        id: createId(),
        patientName: draft.patientName.trim(),
        phone: draft.phone.trim(),
        examType,
        date: draft.date,
        time,
        status: "Agendado",
        createdAt: now,
        updatedAt: now,
        rescheduleHistory: [],
      },
    ]);
    return null;
  };

  const updateAppointment = (id: string, draft: AppointmentDraft) => {
    const slotError = validateSlot(appointments, draft.date, draft.time, id);
    if (slotError) return slotError;
    if (!draft.patientName.trim()) return "Nome obrigatório.";
    if (!draft.phone.trim()) return "Telefone obrigatório.";
    if (!isExamType(draft.examType)) return "Tipo de exame obrigatório.";
    if (!isValidScheduleTime(draft.time)) return "Horário inválido.";

    const examType = draft.examType;
    const time = draft.time;
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              patientName: draft.patientName.trim(),
              phone: draft.phone.trim(),
              examType,
              date: draft.date,
              time,
              updatedAt: new Date().toISOString(),
            }
          : appointment,
      ),
    );
    return null;
  };

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status, updatedAt: new Date().toISOString() } : appointment,
      ),
    );
  };

  const requestReschedule = (id: string, reason?: string) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: "Solicitou reagendamento",
              updatedAt: new Date().toISOString(),
              rescheduleHistory: [
                ...appointment.rescheduleHistory,
                {
                  fromDate: appointment.date,
                  fromTime: appointment.time,
                  reason,
                  status: "Solicitou reagendamento",
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : appointment,
      ),
    );
    return null;
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string, reason?: string) => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return "Agendamento não encontrado.";
    const slotError = validateSlot(appointments, newDate, newTime, id);
    if (slotError) return slotError;

    setAppointments((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              date: newDate,
              time: newTime as Appointment["time"],
              status: "Reagendado",
              updatedAt: new Date().toISOString(),
              rescheduleHistory: [
                ...item.rescheduleHistory,
                {
                  fromDate: item.date,
                  fromTime: item.time,
                  toDate: newDate,
                  toTime: newTime as Appointment["time"],
                  reason,
                  status: "Reagendado",
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : item,
      ),
    );
    return null;
  };

  const importAppointments = (payload: Appointment[]) => {
    setAppointments(payload);
  };

  const setSettings = (nextSettings: Settings) => {
    setSettingsState(nextSettings);
  };

  const clearAll = () => {
    storageService.clearAll();
    setAppointments([]);
    setSettingsState(storageService.getSettings());
  };

  return {
    appointments: sortedAppointments,
    settings,
    setSettings,
    createAppointment,
    updateAppointment,
    updateStatus,
    requestReschedule,
    rescheduleAppointment,
    importAppointments,
    setAppointments,
    clearAll,
  };
};
