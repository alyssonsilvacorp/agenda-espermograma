import { useState } from "react";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";
import RescheduleModal from "../components/RescheduleModal";
import type { Appointment, AppointmentDraft, AppointmentStatus } from "../types/appointment";

type AgendamentosProps = {
  appointments: Appointment[];
  updateAppointment: (id: string, draft: AppointmentDraft) => string | null;
  updateStatus: (id: string, status: AppointmentStatus) => void;
  requestReschedule: (id: string, reason?: string) => string | null;
  rescheduleAppointment: (id: string, newDate: string, newTime: string, reason?: string) => string | null;
  notify: (message: string) => void;
};

export default function Agendamentos({
  appointments,
  updateAppointment,
  updateStatus,
  requestReschedule,
  rescheduleAppointment,
  notify,
}: AgendamentosProps) {
  const [editing, setEditing] = useState<Appointment | undefined>();
  const [rescheduling, setRescheduling] = useState<Appointment | undefined>();

  const changeStatus = (id: string, status: AppointmentStatus) => {
    updateStatus(id, status);
    notify(`Status alterado para ${status}.`);
  };

  const submitEdit = (draft: AppointmentDraft) => {
    if (!editing) return "Agendamento não encontrado.";
    const error = updateAppointment(editing.id, draft);
    if (!error) notify("Agendamento editado.");
    return error;
  };

  return (
    <div className="grid gap-6">
      <section>
        <h2 className="text-2xl font-semibold text-slate-950">Agendamentos</h2>
        <p className="text-sm text-slate-500">Consulte, filtre e atualize todos os registros salvos neste navegador.</p>
      </section>

      <AppointmentList
        appointments={appointments}
        onEdit={setEditing}
        onStatus={changeStatus}
        onReschedule={setRescheduling}
        notify={notify}
      />

      <AppointmentForm
        open={Boolean(editing)}
        title="Editar agendamento"
        appointment={editing}
        onClose={() => setEditing(undefined)}
        onSubmit={submitEdit}
      />

      <RescheduleModal
        open={Boolean(rescheduling)}
        appointment={rescheduling}
        onClose={() => setRescheduling(undefined)}
        onRequestOnly={(reason) => {
          if (!rescheduling) return "Agendamento não encontrado.";
          const error = requestReschedule(rescheduling.id, reason);
          if (!error) notify("Solicitação de reagendamento registrada.");
          return error;
        }}
        onReschedule={(newDate, newTime, reason) => {
          if (!rescheduling) return "Agendamento não encontrado.";
          const error = rescheduleAppointment(rescheduling.id, newDate, newTime, reason);
          if (!error) notify("Agendamento reagendado.");
          return error;
        }}
      />
    </div>
  );
}
