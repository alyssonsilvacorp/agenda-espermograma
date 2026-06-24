import { useRef, useState } from "react";

const ADMIN_SESSION_KEY = "agenda-espermograma:admin-access";
const ADMIN_PASSWORD = "Esp@2026";

export const useAdminAccess = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "true",
  );
  const [modalOpen, setModalOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  const requestAdminAccess = (action: () => void) => {
    if (isAuthorized) {
      action();
      return;
    }
    pendingAction.current = action;
    setModalOpen(true);
  };

  const submitPassword = (password: string) => {
    if (password !== ADMIN_PASSWORD) return false;

    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    setIsAuthorized(true);
    setModalOpen(false);
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
    return true;
  };

  const closeModal = () => {
    pendingAction.current = null;
    setModalOpen(false);
  };

  const lockAdminAccess = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthorized(false);
  };

  return {
    isAuthorized,
    modalOpen,
    requestAdminAccess,
    submitPassword,
    closeModal,
    lockAdminAccess,
  };
};
