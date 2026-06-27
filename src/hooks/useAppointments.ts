import { useEffect, useMemo, useState } from "react";
import type {
  Appointment,
  AppointmentDraft,
  AppointmentStatus,
  BlockedDate,
  BlockedDateType,
  Settings,
} from "../types/appointment";
import { isBlockedDateType, isExamType } from "../types/appointment";
import { storageService } from "../services/storage";
import { appointmentsRepository } from "../services/appointmentsRepository";
import { isValidScheduleTime, validateSlot } from "../utils/dates";
import { isDateBlocked } from "../utils/blockedDates";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [settings, setSettingsState] = useState<Settings>(() => storageService.getSettings());
  const [loading, setLoading] = useState(true);

  const showDatabaseError = (error: unknown) => {
    const message = appointmentsRepository.getErrorMessage(error);
    window.alert(message);
  };

  const loadDatabaseData = async () => {
    try {
      setLoading(true);

      const [appointmentsData, blockedDatesData] = await Promise.all([
        appointmentsRepository.listAppointments(),
        appointmentsRepository.listBlockedDates(),
      ]);

      setAppointments(appointmentsData);
      setBlockedDates(blockedDatesData);
    } catch (error) {
      showDatabaseError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDatabaseData();
  }, []);

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

  const sortedBlockedDates = useMemo(
    () => [...blockedDates].sort((a, b) => a.date.localeCompare(b.date)),
    [blockedDates],
  );

  const createAppointment = (draft: AppointmentDraft) => {
    const slotError = validateSlot(appointments, blockedDates, draft.date, draft.time);
    if (slotError) return slotError;
    if (!draft.patientName.trim()) return "Nome obrigatório.";
    if (!draft.phone.trim()) return "Telefone obrigatório.";
    if (!isExamType(draft.examType)) return "Tipo de exame obrigatório.";
    if (!isValidScheduleTime(draft.time)) return "Horário inválido.";

    void appointmentsRepository
      .createAppointment({
        ...draft,
        source: draft.source || "Sistema interno",
      })
      .then((createdAppointment) => {
        setAppointments((current) => [...current, createdAppointment]);
      })
      .catch(showDatabaseError);

    return null;
  };

  const updateAppointment = (id: string, draft: AppointmentDraft) => {
    const slotError = validateSlot(appointments, blockedDates, draft.date, draft.time, id);
    if (slotError) return slotError;
    if (!draft.patientName.trim()) return "Nome obrigatório.";
    if (!draft.phone.trim()) return "Telefone obrigatório.";
    if (!isExamType(draft.examType)) return "Tipo de exame obrigatório.";
    if (!isValidScheduleTime(draft.time)) return "Horário inválido.";

    void appointmentsRepository
      .updateAppointment(id, draft)
      .then((updatedAppointment) => {
        setAppointments((current) =>
          current.map((appointment) =>
            appointment.id === id ? updatedAppointment : appointment,
          ),
        );
      })
      .catch(showDatabaseError);

    return null;
  };

  const updateStatus = (id: string, status: AppointmentStatus) => {
    void appointmentsRepository
      .updateStatus(id, status)
      .then((updatedAppointment) => {
        setAppointments((current) =>
          current.map((appointment) =>
            appointment.id === id ? updatedAppointment : appointment,
          ),
        );
      })
      .catch(showDatabaseError);
  };

  const requestReschedule = (id: string, reason?: string) => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return "Agendamento não encontrado.";

    const nextAppointment: Appointment = {
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
    };

    void appointmentsRepository
      .updateReschedule(id, nextAppointment)
      .then((updatedAppointment) => {
        setAppointments((current) =>
          current.map((item) => (item.id === id ? updatedAppointment : item)),
        );
      })
      .catch(showDatabaseError);

    return null;
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string, reason?: string) => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return "Agendamento não encontrado.";

    if (isDateBlocked(newDate, blockedDates)) {
      return "Não é possível reagendar para uma data bloqueada.";
    }

    const slotError = validateSlot(appointments, blockedDates, newDate, newTime, id);
    if (slotError) return slotError;

    if (!isValidScheduleTime(newTime)) return "Horário inválido.";

    const nextAppointment: Appointment = {
      ...appointment,
      date: newDate,
      time: newTime,
      status: "Reagendado",
      updatedAt: new Date().toISOString(),
      rescheduleHistory: [
        ...appointment.rescheduleHistory,
        {
          fromDate: appointment.date,
          fromTime: appointment.time,
          toDate: newDate,
          toTime: newTime,
          reason,
          status: "Reagendado",
          createdAt: new Date().toISOString(),
        },
      ],
    };

    void appointmentsRepository
      .updateReschedule(id, nextAppointment)
      .then((updatedAppointment) => {
        setAppointments((current) =>
          current.map((item) => (item.id === id ? updatedAppointment : item)),
        );
      })
      .catch(showDatabaseError);

    return null;
  };

  const importAppointments = (payload: Appointment[]) => {
    setAppointments(payload);
  };

  const importBlockedDates = (payload: BlockedDate[]) => {
    setBlockedDates(payload);
  };

  const addBlockedDate = (date: string, reason: string, type: BlockedDateType | "") => {
    if (!date) return "Informe a data que deseja bloquear.";
    if (!reason.trim()) return "Informe o motivo do bloqueio.";
    if (!isBlockedDateType(type)) return "Selecione o tipo do bloqueio.";

    void appointmentsRepository
      .addBlockedDate(date, reason, type)
      .then((blockedDate) => {
        setBlockedDates((current) => [
          ...current.filter((item) => item.date !== date),
          blockedDate,
        ]);
      })
      .catch(showDatabaseError);

    return null;
  };

  const removeBlockedDate = (id: string) => {
    void appointmentsRepository
      .removeBlockedDate(id)
      .then(() => {
        setBlockedDates((current) => current.filter((blockedDate) => blockedDate.id !== id));
      })
      .catch(showDatabaseError);
  };

  const setSettings = (nextSettings: Settings) => {
    setSettingsState(nextSettings);
  };

  const clearAll = () => {
    window.alert("A limpeza total foi desativada após a migração para banco de dados.");
  };

  return {
    appointments: sortedAppointments,
    blockedDates: sortedBlockedDates,
    settings,
    loading,
    setSettings,
    createAppointment,
    updateAppointment,
    updateStatus,
    requestReschedule,
    rescheduleAppointment,
    importAppointments,
    importBlockedDates,
    addBlockedDate,
    removeBlockedDate,
    setAppointments,
    clearAll,
    reloadAppointments: loadDatabaseData,
  };
};