import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Info, Loader2 } from "lucide-react";
import { EXAM_TYPES, type ExamType, type ScheduleTime } from "../types/appointment";
import { todayInputValue, formatLongDate, formatDate } from "../utils/dates";
import { supabase } from "../services/supabase";

type PublicSlot = {
  slot_time: ScheduleTime;
  is_available: boolean;
  label: string;
};

type ConfirmationData = {
  examType: ExamType;
  date: string;
  time: ScheduleTime;
};

const initialForm = {
  patientName: "",
  phone: "",
  healthCardNumber: "",
  examType: "Espermograma" as ExamType,
  notes: "",
  acceptedPreparation: false,
};

export default function PublicBooking() {
  const [selectedDate, setSelectedDate] = useState(todayInputValue());
  const [selectedTime, setSelectedTime] = useState<ScheduleTime | "">("");
  const [slots, setSlots] = useState<PublicSlot[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.slot_time === selectedTime),
    [slots, selectedTime],
  );

  const clearSuccess = () => {
    setSuccess(false);
    setConfirmation(null);
  };

  const loadSlots = async (options?: { keepMessage?: boolean; keepSelectedTime?: boolean }) => {
    try {
      setLoadingSlots(true);

      if (!options?.keepMessage) {
        setMessage("");
      }

      if (!options?.keepSelectedTime) {
        setSelectedTime("");
      }

      const { data, error } = await supabase.rpc("get_public_schedule_slots", {
        target_date: selectedDate,
      });

      if (error) throw error;

      setSlots((data ?? []) as PublicSlot[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao carregar horários.";
      setMessage(errorMessage);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    void loadSlots();
  }, [selectedDate]);

  const updateForm = (field: keyof typeof initialForm, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    clearSuccess();

    if (!selectedDate) {
      setMessage("Escolha a data do exame.");
      return;
    }

    if (!selectedTime) {
      setMessage("Escolha um horário disponível.");
      return;
    }

    if (!selectedSlot?.is_available) {
      setMessage("Esse horário não está disponível. Escolha outro horário.");
      return;
    }

    if (!form.patientName.trim()) {
      setMessage("Informe seu nome completo.");
      return;
    }

    if (!form.phone.trim()) {
      setMessage("Informe seu telefone/WhatsApp.");
      return;
    }

    if (!form.healthCardNumber.trim()) {
      setMessage("Informe sua carteirinha ou matrícula Hapvida.");
      return;
    }

    if (!form.examType) {
      setMessage("Selecione o tipo de exame.");
      return;
    }

    if (!form.acceptedPreparation) {
      setMessage("Confirme que leu as instruções de preparo.");
      return;
    }

    const confirmedData: ConfirmationData = {
      examType: form.examType,
      date: selectedDate,
      time: selectedTime,
    };

    try {
      setSubmitting(true);
      setMessage("");

      const { error } = await supabase.rpc("create_public_appointment", {
        p_patient_name: form.patientName,
        p_phone: form.phone,
        p_health_card_number: form.healthCardNumber,
        p_exam_type: form.examType,
        p_date: selectedDate,
        p_time: selectedTime,
        p_notes: form.notes || null,
      });

      if (error) throw error;

      setSuccess(true);
      setConfirmation(confirmedData);
      setMessage("Agendamento confirmado com sucesso.");
      setForm(initialForm);
      setSelectedTime("");

      await loadSlots({
        keepMessage: true,
        keepSelectedTime: true,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível confirmar o agendamento.";

      setSuccess(false);
      setConfirmation(null);
      setMessage(errorMessage);

      await loadSlots({
        keepMessage: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b-4 border-amber-400 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-5">
          <img
            src="/hapvida-logo.png"
            alt="Hapvida Diagnóstico"
            className="h-14 w-14 rounded-xl object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Agende seu Espermograma</h1>
            <p className="text-sm text-slate-600">
              Diagnóstico Maceió Oldemburgo Paranhos
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-6">
        {message && (
          <div className="fixed inset-x-0 bottom-4 z-50 px-4 sm:bottom-6">
            <div
              className={`mx-auto flex max-w-2xl items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
                success
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                  : "border-amber-300 bg-amber-50 text-amber-900"
              }`}
            >
              <span>{message}</span>

              <button
                type="button"
                onClick={() => setMessage("")}
                className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${
                  success
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {success && confirmation && (
          <section className="rounded-md border border-emerald-300 bg-emerald-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 shrink-0 text-emerald-600" size={28} />
              <div>
                <h2 className="text-xl font-semibold text-emerald-950">
                  Agendamento confirmado com sucesso
                </h2>

                <div className="mt-3 grid gap-1 text-sm text-emerald-900">
                  <p>
                    Exame: <strong>{confirmation.examType}</strong>
                  </p>
                  <p>
                    Convênio: <strong>Hapvida</strong>
                  </p>
                  <p>
                    Unidade: <strong>Diagnóstico Maceió Oldemburgo Paranhos</strong>
                  </p>
                  <p>
                    Data: <strong>{formatDate(confirmation.date)}</strong>
                  </p>
                  <p>
                    Horário: <strong>{confirmation.time}</strong>
                  </p>
                </div>

                <p className="mt-3 text-sm font-medium text-emerald-800">
                  Compareça à unidade na data e horário agendados.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-md border border-sky-200 bg-sky-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-sky-700 shadow-sm">
              <Info size={19} aria-hidden="true" />
            </div>
            <div className="grid gap-2 text-sm leading-6 text-slate-700">
              <h2 className="text-base font-semibold text-sky-950">
                Instruções para Espermograma e Espermocultura
              </h2>
              <p>
                A amostra pode ser coletada entre 2 a 7 dias de abstinência sexual para paciente que não realizou vasectomia.
              </p>
              <p>Para paciente que já realizou vasectomia, não é necessário abstinência.</p>
              <p>
                Para pacientes após o procedimento de vasectomia, sugere-se realizar o exame após 30 a 40 ejaculações,
                para esvaziar completamente os epidídimos e/ou conforme critério médico.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="text-sky-700" size={21} />
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Escolha a data</h2>
              <p className="text-sm text-slate-500">{formatLongDate(selectedDate)}</p>
            </div>
          </div>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Data do exame
            <input
              type="date"
              value={selectedDate}
              min={todayInputValue()}
              required
              onChange={(event) => {
                clearSuccess();
                setSelectedDate(event.target.value);
              }}
              className="min-h-11 rounded-md border border-slate-300 px-3 text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </label>
        </section>

        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="text-sky-700" size={21} />
            <h2 className="text-xl font-semibold text-slate-950">Escolha o horário</h2>
          </div>

          {loadingSlots ? (
            <div className="flex items-center gap-2 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
              <Loader2 className="animate-spin" size={18} />
              Carregando horários...
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {slots.map((slot) => (
                <button
                  key={slot.slot_time}
                  type="button"
                  disabled={!slot.is_available}
                  onClick={() => {
                    clearSuccess();
                    setSelectedTime(slot.slot_time);
                  }}
                  className={`rounded-md border px-4 py-4 text-left transition ${
                    selectedTime === slot.slot_time
                      ? "border-sky-700 bg-sky-50 ring-2 ring-sky-100"
                      : "border-slate-200 bg-white"
                  } ${
                    slot.is_available
                      ? "hover:border-sky-500"
                      : "cursor-not-allowed bg-slate-100 opacity-70"
                  }`}
                >
                  <strong className="block text-2xl text-slate-950">{slot.slot_time}</strong>
                  <span
                    className={`mt-1 block text-sm ${
                      slot.is_available ? "text-emerald-700" : "text-slate-500"
                    }`}
                  >
                    {slot.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <form
          onSubmit={submit}
          noValidate
          className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Dados do paciente</h2>
            <p className="text-sm text-slate-500">
              Convênio fixo: Hapvida
            </p>
          </div>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Nome completo
            <input
              value={form.patientName}
              required
              onChange={(event) => updateForm("patientName", event.target.value)}
              className="min-h-11 rounded-md border border-slate-300 px-3 text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              placeholder="Digite seu nome completo"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Telefone/WhatsApp
            <input
              value={form.phone}
              required
              onChange={(event) => updateForm("phone", event.target.value)}
              className="min-h-11 rounded-md border border-slate-300 px-3 text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              placeholder="Ex: 82999999999"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Carteirinha/Matrícula Hapvida
            <input
              value={form.healthCardNumber}
              required
              onChange={(event) => updateForm("healthCardNumber", event.target.value)}
              className="min-h-11 rounded-md border border-slate-300 px-3 text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              placeholder="Digite o número da carteirinha ou matrícula"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Tipo de exame
            <select
              value={form.examType}
              required
              onChange={(event) => updateForm("examType", event.target.value)}
              className="min-h-11 rounded-md border border-slate-300 px-3 text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            >
              {EXAM_TYPES.map((examType) => (
                <option key={examType} value={examType}>
                  {examType}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Observação opcional
            <textarea
              value={form.notes}
              onChange={(event) => updateForm("notes", event.target.value)}
              rows={3}
              className="rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              placeholder="Digite alguma observação, se necessário"
            />
          </label>

          <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.acceptedPreparation}
              required
              onChange={(event) => updateForm("acceptedPreparation", event.target.checked)}
              className="mt-1"
            />
            <span>
              Confirmo que li as instruções de preparo para realização do exame.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-sky-700 px-5 text-sm font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? "Confirmando..." : "Confirmar agendamento"}
          </button>
        </form>
      </div>
    </main>
  );
}