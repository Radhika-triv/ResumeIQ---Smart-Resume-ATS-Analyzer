import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast notification item component.
 *
 * @param {Object} props
 * @param {Object} props.toast - Toast data object { id, type, message }
 * @param {Function} props.onClose - Callback to close/remove this toast
 * @param {number} [props.duration=4000] - Display duration in milliseconds
 */
export function ToastItem({ toast, onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, onClose, duration]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-sky-400" />,
  };

  const bgColors = {
    success: 'bg-emerald-950/80 border-emerald-500/20 text-emerald-100',
    error: 'bg-rose-950/80 border-rose-500/20 text-rose-100',
    info: 'bg-sky-950/80 border-sky-500/20 text-sky-100',
  };

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl animate-fade-in-up w-80 max-w-full ${bgColors[toast.type]}`}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="text-xs font-medium flex-grow pr-2 leading-relaxed">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-white/40 hover:text-white transition-colors p-0.5 rounded hover:bg-white/5 cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Container for list of Toast notifications floating on screen.
 *
 * @param {Object} props
 * @param {Array} props.toasts - List of toast objects
 * @param {Function} props.onClose - Callback to remove a toast
 */
export default function ToastContainer({ toasts, onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}
