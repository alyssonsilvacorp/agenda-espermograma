import { useState } from "react";
import Layout, { type PageKey } from "./components/Layout";
import Toast from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Agendamentos from "./pages/Agendamentos";
import Configuracoes from "./pages/Configuracoes";
import { useAppointments } from "./hooks/useAppointments";
import { useAdminAccess } from "./hooks/useAdminAccess";
import AdminPasswordModal from "./components/AdminPasswordModal";

export default function App() {
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
      {page === "dashboard" && <Dashboard {...appointmentsApi} onNavigate={setPage} />}
      {page === "agenda" && <Agenda {...appointmentsApi} notify={notify} />}
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
