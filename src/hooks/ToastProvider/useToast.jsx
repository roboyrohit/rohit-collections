import React from "react";
import { useRef } from "react";
import { Toast } from "primereact/toast";

export function useToast() {
  const toastRef = useRef(null);

  const show = (severity, summary, detail, life = 3000) => {
    toastRef.current?.show({ severity, summary, detail, life });
  };

  return {
    ToastComponent: <Toast ref={toastRef} position="top-center" />,
    success: (summary, detail, life) => show("success", summary, detail, life),
    error: (summary, detail, life) => show("error", summary, detail, life),
    warn: (summary, detail, life) => show("warn", summary, detail, life),
    info: (summary, detail, life) => show("info", summary, detail, life),
    contrast: (summary, detail, life) => show("contrast", summary, detail, life),
  };
}
