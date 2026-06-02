import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { FaCheck, FaTimes, FaInfo, FaExclamationTriangle } from 'react-icons/fa';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

const icons = {
  success: FaCheck,
  error: FaTimes,
  warning: FaExclamationTriangle,
  info: FaInfo,
};

const colors = {
  success: 'bg-emerald-600 border-emerald-400',
  error: 'bg-red-600 border-red-400',
  warning: 'bg-amber-600 border-amber-400',
  info: 'bg-teal-600 border-teal-400',
};

const ToastItem = ({ toast, onClose }) => {
  const Icon = icons[toast.type] || FaInfo;

  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm shadow-lg border animate-fade-in-down ${colors[toast.type] || colors.info}`}
      role="alert"
    >
      <Icon className="shrink-0" size={16} />
      <span className="flex-1">{toast.message}</span>
      <button onClick={onClose} className="p-0.5 hover:opacity-70 transition-opacity" aria-label="إغلاق">
        <FaTimes size={12} />
      </button>
    </div>
  );
};
