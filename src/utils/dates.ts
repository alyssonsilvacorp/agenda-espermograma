import { SCHEDULE_TIMES, type Appointment, type BlockedDate, type ScheduleTime } from "../types/appointment";
import { isDateBlocked } from "./blockedDates";

export const todayInputValue = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
};

export const formatDate = (date: string) => {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

export const formatLongDate = (date: string) => {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

export const isWeekend = (date: string) => {
  if (!date) return false;
  const [year, month, day] = date.split("-").map(Number);
  const weekDay = new Date(year, month - 1, day).getDay();
  return weekDay === 0 || weekDay === 6;
};

export const isValidScheduleTime = (time: string): time is ScheduleTime =>
  SCHEDULE_TIMES.includes(time as ScheduleTime);

export const isDateBeforeToday = (date: string) => {
  if (!date) return false;
  return date < todayInputValue();
};

export const isScheduleSlotExpired = (date: string, time: string) => {
  if (!date || !time || !isValidScheduleTime(time)) return false;

  if (date < todayInputValue()) return true;
  if (date > todayInputValue()) return false;

  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const slotDateTime = new Date(year, month - 1, day, hour, minute, 0, 0);
  const now = new Date();

  return slotDateTime.getTime() <= now.getTime();
};

export const getAppointmentsByDate = (appointments: Appointment[], date: string) =>
  appointments.filter((appointment) => appointment.date === date);

export const getAppointmentInSlot = (
  appointments: Appointment[],
  date: string,
  time: ScheduleTime,
  ignoreId?: string,
) =>
  appointments.find(
    (appointment) =>
      appointment.date === date &&
      appointment.time === time &&
      appointment.id !== ignoreId &&
      appointment.status !== "Cancelado",
  );

export const isDateFull = (appointments: Appointment[], date: string, ignoreId?: string) =>
  appointments.filter(
    (appointment) =>
      appointment.date === date &&
      appointment.id !== ignoreId &&
      appointment.status !== "Cancelado",
  ).length >= SCHEDULE_TIMES.length;

export const validateSlot = (
  appointments: Appointment[],
  blockedDates: BlockedDate[],
  date: string,
  time: string,
  ignoreId?: string,
) => {
  if (!date) return "Informe uma data.";
  if (!time) return "Informe um horário.";
  if (isDateBlocked(date, blockedDates)) return "Esta data está bloqueada para agendamento.";
  if (isWeekend(date)) return "Sábado e domingo estão indisponíveis.";
  if (!isValidScheduleTime(time)) return "Escolha um dos horários permitidos.";
  if (isScheduleSlotExpired(date, time)) return "Não é possível agendar um horário que já passou.";
  if (getAppointmentInSlot(appointments, date, time, ignoreId)) return "Este horário já está ocupado.";
  if (isDateFull(appointments, date, ignoreId)) return "Todas as vagas deste dia já foram preenchidas.";
  return null;
};