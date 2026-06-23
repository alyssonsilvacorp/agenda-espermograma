import type { Appointment } from "../types/appointment";
import { formatDate } from "./dates";

export type WhatsAppMessageType = "agendamento" | "confirmacao" | "reagendamento" | "cancelamento";

const cleanPhone = (phone: string) => phone.replace(/\D/g, "");

export const buildWhatsAppMessage = (appointment: Appointment, type: WhatsAppMessageType) => {
  const lastReschedule = appointment.rescheduleHistory.at(-1);
  const date = formatDate(appointment.date);
  const newDate = formatDate(lastReschedule?.toDate ?? appointment.date);
  const newTime = lastReschedule?.toTime ?? appointment.time;

  const messages: Record<WhatsAppMessageType, string> = {
    agendamento: `Olá, ${appointment.patientName}. Seu exame de ${appointment.examType} foi agendado para o dia ${date} às ${appointment.time}.

Pedimos que compareça com antecedência e siga as orientações passadas pela unidade.

Caso precise remarcar, entre em contato conosco.`,
    confirmacao: `Olá, ${appointment.patientName}. Passando para confirmar seu exame de ${appointment.examType}, agendado para o dia ${date} às ${appointment.time}.

Pedimos que confirme sua presença respondendo esta mensagem.`,
    reagendamento: `Olá, ${appointment.patientName}. Seu exame de ${appointment.examType} foi reagendado.

Nova data: ${newDate}
Novo horário: ${newTime}

Pedimos que compareça com antecedência e siga as orientações passadas pela unidade.`,
    cancelamento: `Olá, ${appointment.patientName}. Seu agendamento para o exame de ${appointment.examType}, marcado para o dia ${date} às ${appointment.time}, foi cancelado.

Caso deseje remarcar, entre em contato conosco para verificar uma nova disponibilidade.`,
  };

  return messages[type];
};

export const buildWhatsAppUrl = (phone: string, message: string) => {
  const number = cleanPhone(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
