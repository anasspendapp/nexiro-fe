import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

type AlertVariant = "info" | "success" | "warning" | "error";

type AlertOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  variant?: AlertVariant;
};

type ConfirmOptions = AlertOptions & {
  cancelLabel?: string;
};

type AlertContextValue = {
  alert: (options: AlertOptions | string) => Promise<void>;
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
};

type BaseDialog = {
  title: string;
  message: string;
  confirmLabel: string;
  variant: AlertVariant;
};

type AlertDialog = BaseDialog & {
  type: "alert";
  resolve: () => void;
};

type ConfirmDialog = BaseDialog & {
  type: "confirm";
  cancelLabel: string;
  resolve: (value: boolean) => void;
};

type DialogState = AlertDialog | ConfirmDialog;

const AlertContext = createContext<AlertContextValue | null>(null);

const defaultTitles: Record<"alert" | "confirm", string> = {
  alert: "Notice",
  confirm: "Please Confirm",
};

const variantStyles: Record<
  AlertVariant,
  { badge: string; ring: string; glow: string }
> = {
  info: {
    badge: "bg-sky-500/20 text-sky-200 border-sky-500/40",
    ring: "from-sky-500/30 to-indigo-500/10",
    glow: "shadow-sky-500/20",
  },
  success: {
    badge: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
    ring: "from-emerald-500/30 to-teal-500/10",
    glow: "shadow-emerald-500/20",
  },
  warning: {
    badge: "bg-amber-500/20 text-amber-200 border-amber-500/40",
    ring: "from-amber-500/30 to-orange-500/10",
    glow: "shadow-amber-500/20",
  },
  error: {
    badge: "bg-rose-500/20 text-rose-200 border-rose-500/40",
    ring: "from-rose-500/30 to-red-500/10",
    glow: "shadow-rose-500/20",
  },
};

const normalizeAlertOptions = (
  options: AlertOptions | string,
  type: "alert" | "confirm",
): BaseDialog => {
  if (typeof options === "string") {
    return {
      title: defaultTitles[type],
      message: options,
      confirmLabel: "OK",
      variant: "info",
    };
  }

  return {
    title: options.title || defaultTitles[type],
    message: options.message,
    confirmLabel: options.confirmLabel || "OK",
    variant: options.variant || "info",
  };
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const alert = useCallback((options: AlertOptions | string) => {
    return new Promise<void>((resolve) => {
      setDialog((prev) => {
        if (prev?.type === "confirm") {
          prev.resolve(false);
        } else if (prev?.type === "alert") {
          prev.resolve();
        }
        return {
          type: "alert",
          ...normalizeAlertOptions(options, "alert"),
          resolve,
        };
      });
    });
  }, []);

  const confirm = useCallback((options: ConfirmOptions | string) => {
    return new Promise<boolean>((resolve) => {
      const base = normalizeAlertOptions(options, "confirm");
      const cancelLabel =
        typeof options === "string"
          ? "Cancel"
          : options.cancelLabel || "Cancel";

      setDialog((prev) => {
        if (prev?.type === "confirm") {
          prev.resolve(false);
        } else if (prev?.type === "alert") {
          prev.resolve();
        }
        return {
          type: "confirm",
          ...base,
          cancelLabel,
          resolve,
        };
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    setDialog((current) => {
      if (!current) return current;
      if (current.type === "confirm") {
        current.resolve(false);
      } else {
        current.resolve();
      }
      return null;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setDialog((current) => {
      if (!current) return current;
      if (current.type === "confirm") {
        current.resolve(true);
      } else {
        current.resolve();
      }
      return null;
    });
  }, []);

  useEffect(() => {
    if (!dialog) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
      if (event.key === "Enter") {
        event.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialog, handleClose, handleConfirm]);

  const contextValue = useMemo(() => ({ alert, confirm }), [alert, confirm]);

  const modal = dialog ? (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0c0f1c] p-6 shadow-2xl ${
          variantStyles[dialog.variant].glow
        }`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br ${
            variantStyles[dialog.variant].ring
          } opacity-60`}
        />
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${
              variantStyles[dialog.variant].badge
            }`}
          >
            {dialog.variant}
          </span>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <h3
          id="alert-dialog-title"
          className="text-xl font-semibold text-white mb-2"
        >
          {dialog.title}
        </h3>
        <p
          id="alert-dialog-description"
          className="text-sm text-gray-300 leading-relaxed"
        >
          {dialog.message}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          {dialog.type === "confirm" && (
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition"
            >
              {dialog.cancelLabel}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30 transition"
          >
            {dialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {dialog && typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextValue => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
