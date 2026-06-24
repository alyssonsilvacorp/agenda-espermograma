import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { KeyRound, X } from "lucide-react";

type AdminPasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => boolean;
};

export default function AdminPasswordModal({
  open,
  onClose,
  onSubmit,
}: AdminPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError("");
  }, [open]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!onSubmit(password)) {
      setError("Senha incorreta.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 no-print">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-md border border-slate-200 bg-white p-5 shadow-soft"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-sky-700">
              <KeyRound size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Acesso administrativo</h2>
              <p className="text-sm text-slate-500">Confirme a senha para executar esta ação.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Fechar"
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <label className="mt-5 grid gap-1.5 text-sm font-medium text-slate-700">
          Senha
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
          />
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-10 rounded-md bg-sky-700 px-4 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Confirmar ação
          </button>
        </div>
      </form>
    </div>
  );
}
