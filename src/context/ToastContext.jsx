import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = "info", message }) => {
      const id = crypto.randomUUID();
      setToasts((t) => [...t, { id, type, message }]);
      setTimeout(() => remove(id), 3000);
    },
    [remove]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* کانتینر توست‌ها */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-slideIn
              ${
                t.type === "success"
                  ? "bg-green-500"
                  : t.type === "error"
                  ? "bg-red-500"
                  : t.type === "warning"
                  ? "bg-yellow-500 text-black"
                  : "bg-pink-500"
              }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
