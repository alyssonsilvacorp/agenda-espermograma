import { useState } from "react";
import Layout, { type PageKey } from "./components/Layout";
import Toast from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Agendamentos from "./pages/Agendamentos";
import Configuracoes from "./pages/Configuracoes";
import { useAppointments } from "./hooks/useAppointments";

export default function App() {
  const [page, setPage] = useState<PageKey>("dashboard");
  const [toast, setToast] = useState("");
  const appointmentsApi = useAppointments();

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  return (
    <Layout activePage={page} onNavigate={setPage} clinicName={appointmentsApi.settings.clinicName}>
      {page === "dashboard" && <Dashboard {...appointmentsApi} onNavigate={setPage} />}
      {page === "agenda" && <Agenda {...appointmentsApi} notify={notify} />}
      {page === "agendamentos" && <Agendamentos {...appointmentsApi} notify={notify} />}
      {page === "configuracoes" && <Configuracoes {...appointmentsApi} notify={notify} />}
      <Toast message={toast} />
    </Layout>
  );
}
