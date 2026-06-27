import { supabase } from "./supabase";
import type {
  Appointment,
  AppointmentDraft,
  AppointmentStatus,
  BlockedDate,
  BlockedDateType,
  RescheduleHistoryItem,
} from "../types/appointment";

type AppointmentRow = {
  id: string;
  patient_name: string;
  phone: string;
  health_card_number: string | null;
  exam_type: Appointment["examType"];
  health_plan: string;
  date: string;
  time: Appointment["time"];
  status: AppointmentStatus;
  notes: string | null;
  source: string | null;
  reschedule_history: RescheduleHistoryItem[] | null;
  created_at: string;
  updated_at: string;
};

type BlockedDateRow = {
  id: string;
  date: string;
  reason: string;
  type: BlockedDateType;
  created_at: string;
};

const toAppointment = (row: AppointmentRow): Appointment => ({
  id: row.id,
  patientName: row.patient_name,
  phone: row.phone,
  healthCardNumber: row.health_card_number ?? "",
  examType: row.exam_type,
  healthPlan: row.health_plan || "Hapvida",
  date: row.date,
  time: row.time,
  status: row.status,
  notes: row.notes ?? "",
  source: row.source ?? "Sistema interno",
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  rescheduleHistory: row.reschedule_history ?? [],
});

const toBlockedDate = (row: BlockedDateRow): BlockedDate => ({
  id: row.id,
  date: row.date,
  reason: row.reason,
  type: row.type,
  createdAt: row.created_at,
});

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Erro inesperado ao acessar o banco de dados.";
};

export const appointmentsRepository = {
  async listAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => toAppointment(row as AppointmentRow));
  },

  async createAppointment(draft: AppointmentDraft) {
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        patient_name: draft.patientName.trim(),
        phone: draft.phone.trim(),
        health_card_number: draft.healthCardNumber?.trim() || null,
        exam_type: draft.examType,
        health_plan: "Hapvida",
        date: draft.date,
        time: draft.time,
        status: "Agendado",
        notes: draft.notes?.trim() || null,
        source: draft.source || "Sistema interno",
        reschedule_history: [],
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return toAppointment(data as AppointmentRow);
  },

  async updateAppointment(id: string, draft: AppointmentDraft) {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        patient_name: draft.patientName.trim(),
        phone: draft.phone.trim(),
        health_card_number: draft.healthCardNumber?.trim() || null,
        exam_type: draft.examType,
        health_plan: "Hapvida",
        date: draft.date,
        time: draft.time,
        notes: draft.notes?.trim() || null,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return toAppointment(data as AppointmentRow);
  },

  async updateStatus(id: string, status: AppointmentStatus) {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return toAppointment(data as AppointmentRow);
  },

  async updateReschedule(id: string, payload: Partial<Appointment>) {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        date: payload.date,
        time: payload.time,
        status: payload.status,
        reschedule_history: payload.rescheduleHistory ?? [],
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return toAppointment(data as AppointmentRow);
  },

  async listBlockedDates() {
    const { data, error } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("date", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => toBlockedDate(row as BlockedDateRow));
  },

  async addBlockedDate(date: string, reason: string, type: BlockedDateType) {
    const { data, error } = await supabase
      .from("blocked_dates")
      .upsert(
        {
          date,
          reason: reason.trim(),
          type,
        },
        { onConflict: "date" },
      )
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return toBlockedDate(data as BlockedDateRow);
  },

  async removeBlockedDate(id: string) {
    const { error } = await supabase.from("blocked_dates").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },

  getErrorMessage,
};