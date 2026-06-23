import { Clipboard, MessageCircle } from "lucide-react";
import type { Appointment } from "../types/appointment";
import { buildWhatsAppMessage, buildWhatsAppUrl, type WhatsAppMessageType } from "../utils/whatsapp";

type WhatsAppMessageButtonProps = {
  appointment: Appointment;
  type: WhatsAppMessageType;
  label: string;
  mode: "copy" | "open";
  onDone: (message: string) => void;
};

export default function WhatsAppMessageButton({ appointment, type, label, mode, onDone }: WhatsAppMessageButtonProps) {
  const handleClick = async () => {
    const message = buildWhatsAppMessage(appointment, type);
    if (mode === "copy") {
      await navigator.clipboard.writeText(message);
      onDone("Mensagem copiada.");
      return;
    }
    window.open(buildWhatsAppUrl(appointment.phone, message), "_blank", "noopener,noreferrer");
    onDone("WhatsApp Web aberto.");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50"
    >
      {mode === "copy" ? <Clipboard size={14} aria-hidden="true" /> : <MessageCircle size={14} aria-hidden="true" />}
      {label}
    </button>
  );
}
