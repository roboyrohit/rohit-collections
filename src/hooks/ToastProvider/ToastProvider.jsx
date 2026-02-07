import React, { createContext } from "react";
import { useToast } from "./useToast";

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const toast = useToast();
  return (
    <ToastContext.Provider value={toast}>
      {toast.ToastComponent}
      {children}
    </ToastContext.Provider>
  );
}
