import { useRef, useState } from "react";

const ADMIN_PASSWORD = "Esp@2026";

export const useAdminAccess = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  const requestAdminAccess = (action: () => void) => {
    pendingAction.current = action;
    setModalOpen(true);
  };

  const submitPassword = (password: string) => {
    if (password !== ADMIN_PASSWORD) return false;

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

  return {
    modalOpen,
    requestAdminAccess,
    submitPassword,
    closeModal,
  };
};
