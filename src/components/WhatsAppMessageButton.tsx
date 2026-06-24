import { Clipboard, MessageCircle } from "lucide-react";
import type { Appointment } from "../types/appointment";
import { buildWhatsAppMessage, buildWhatsAppUrl, type WhatsAppMessageType } from "../utils/whatsapp";

type WhatsAppMessageButtonProps = {
  appointment: Appointment;
  type: WhatsAppMessageType;
  label: string;
  mode: "copy" | "open";
  onDone: (message: string) => void;
  compact?: boolean;
  menuItem?: boolean;
};

export default function WhatsAppMessageButton({
  appointment,
  type,
  label,
  mode,
  onDone,
  compact,
  menuItem,
}: WhatsAppMessageButtonProps) {
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
      className={
        menuItem
          ? "menu-action text-left"
          : `inline-flex items-center justify-center gap-1 rounded-md border border-teal-200 bg-white text-xs font-semibold text-teal-700 hover:bg-teal-50 ${
              compact ? "min-h-8 px-2" : "min-h-9 px-2.5"
            }`
      }
    >
      {mode === "copy" ? <Clipboard size={14} aria-hidden="true" /> : <MessageCircle size={14} aria-hidden="true" />}
      {label}
    </button>
  );
}
