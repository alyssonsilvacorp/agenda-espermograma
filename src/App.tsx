import { useState } from "react";
import Layout, { type PageKey } from "./components/Layout";
import Toast from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Agendamentos from "./pages/Agendamentos";
import Configuracoes from "./pages/Configuracoes";
import PublicBooking from "./pages/PublicBooking";
import { useAppointments } from "./hooks/useAppointments";
import { useAdminAccess } from "./hooks/useAdminAccess";
import AdminPasswordModal from "./components/AdminPasswordModal";

function InternalAccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const internalPassword = import.meta.env.VITE_INTERNAL_PASSWORD || "Agenda@2026";

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === internalPassword) {
      onUnlock();
      return;
    }

    setError("Senha de acesso interno incorreta.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-3">
          <img
            src="/hapvida-logo.png"
            alt="Hapvida Diagnóstico"
            className="h-12 w-12 rounded-xl object-contain"
          />

          <div>
            <h1 className="text-xl font-bold text-slate-950">Acesso interno</h1>
            <p className="text-sm text-slate-500">
              Agenda Espermograma — Recepção
            </p>
          </div>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Senha de acesso
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            className="min-h-11 rounded-md border border-slate-300 px-3 text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            placeholder="Digite a senha interna"
            autoFocus
          />
        </label>

        {error && (
          <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-sky-700 px-4 text-sm font-semibold text-white hover:bg-sky-800"
        >
          Entrar
        </button>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Para agendamento público do paciente, use o link terminado em /agendar.
        </p>
      </form>
    </main>
  );
}

function PrivateInternalApp() {
  const [page, setPage] = useState<PageKey>("dashboard");
  const [toast, setToast] = useState("");
  const appointmentsApi = useAppointments();
  const adminAccess = useAdminAccess();

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const navigate = (nextPage: PageKey) => {
    if (nextPage === "configuracoes") {
      adminAccess.requestAdminAccess(() => setPage(nextPage));
      return;
    }

    setPage(nextPage);
  };

  return (
    <Layout activePage={page} onNavigate={navigate}>
      {page === "dashboard" && (
        <Dashboard {...appointmentsApi} onNavigate={setPage} />
      )}

      {page === "agenda" && (
        <Agenda {...appointmentsApi} notify={notify} />
      )}

      {page === "agendamentos" && (
        <Agendamentos
          {...appointmentsApi}
          notify={notify}
          requestAdminAccess={adminAccess.requestAdminAccess}
        />
      )}

      {page === "configuracoes" && (
        <Configuracoes
          {...appointmentsApi}
          notify={notify}
          requestAdminAccess={adminAccess.requestAdminAccess}
        />
      )}

      <Toast message={toast} />

      <AdminPasswordModal
        open={adminAccess.modalOpen}
        onClose={adminAccess.closeModal}
        onSubmit={adminAccess.submitPassword}
      />
    </Layout>
  );
}

function InternalApp() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <InternalAccessGate onUnlock={() => setUnlocked(true)} />;
  }

  return <PrivateInternalApp />;
}

export default function App() {
  const isPublicBookingPage = window.location.pathname === "/agendar";

  if (isPublicBookingPage) {
    return <PublicBooking />;
  }

  return <InternalApp />;
}