export const EXAM_TYPES = [
  "Espermograma",
  "Espermocultura",
  "Espermograma + Espermocultura",
] as const;

export const APPOINTMENT_STATUSES = [
  "Agendado",
  "Confirmado",
  "Solicitou reagendamento",
  "Reagendado",
  "Cancelado",
  "Faltou",
  "Realizado",
] as const;

export const SCHEDULE_TIMES = ["12:30", "13:00", "13:30"] as const;

export const BLOCKED_DATE_TYPES = [
  "Feriado nacional",
  "Feriado municipal",
  "Manutenção",
  "Equipe ausente",
  "Outro",
] as const;

export type ExamType = (typeof EXAM_TYPES)[number];
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
export type ScheduleTime = (typeof SCHEDULE_TIMES)[number];
export type BlockedDateType = (typeof BLOCKED_DATE_TYPES)[number];

export const isExamType = (value: string): value is ExamType =>
  EXAM_TYPES.includes(value as ExamType);

export const isBlockedDateType = (value: string): value is BlockedDateType =>
  BLOCKED_DATE_TYPES.includes(value as BlockedDateType);

export type RescheduleHistoryItem = {
  fromDate: string;
  fromTime: ScheduleTime;
  toDate?: string;
  toTime?: ScheduleTime;
  reason?: string;
  status: "Solicitou reagendamento" | "Reagendado";
  createdAt: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  phone: string;
  examType: ExamType;
  date: string;
  time: ScheduleTime;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  rescheduleHistory: RescheduleHistoryItem[];
};

export type AppointmentDraft = {
  patientName: string;
  phone: string;
  examType: ExamType | "";
  date: string;
  time: ScheduleTime | "";
};

export type Settings = {
  clinicName: string;
};

export type BlockedDate = {
  id: string;
  date: string;
  reason: string;
  type: BlockedDateType;
  createdAt: string;
};

export type BackupPayload = {
  version: 1;
  exportedAt: string;
  appointments: Appointment[];
  settings: Settings;
  blockedDates?: BlockedDate[];
};
