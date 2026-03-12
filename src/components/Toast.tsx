import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { create } from 'zustand';

// --- Toast Store ---
export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  add: (toast: Omit<ToastItem, 'id'>) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  add: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// Convenience export
export const toast = {
  success: (message: string) => useToastStore.getState().add({ type: 'success', message }),
  error: (message: string) => useToastStore.getState().add({ type: 'error', message }),
  info: (message: string) => useToastStore.getState().add({ type: 'info', message }),
};

const accentColors = {
  success: '#22c55e',
  error: '#ef4444',
  info: '#06b6d4',
};

const iconColors = {
  success: '#22c55e',
  error: '#ef4444',
  info: '#06b6d4',
};

// --- Single Toast ---
function ToastNotification({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, item.duration || 4000);
    return () => clearTimeout(timer);
  }, [item.duration, onDismiss]);

  const icons = {
    success: <CheckCircle size={16} color={iconColors.success} />,
    error: <AlertCircle size={16} color={iconColors.error} />,
    info: <Info size={16} color={iconColors.info} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className="relative bg-[var(--surface)] border border-[var(--border-strong)] rounded-lg min-w-[280px] max-w-[400px] overflow-hidden"
      style={{ boxShadow: 'var(--shadow-float)' }}
    >
      <div className="flex items-center gap-3 p-4">
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg"
          style={{ backgroundColor: accentColors[item.type] }}
        />
        {icons[item.type]}
        <span className="text-sm font-medium flex-1 text-[var(--text)]">
          {item.message}
        </span>
        <button
          onClick={onDismiss}
          className="p-1 rounded-md hover:bg-[var(--hover-bg)] transition-colors"
          style={{ color: 'var(--text3)' }}
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// --- Toast Container (render once in app root) ---
export default function ToastContainer() {
  const { toasts, remove } = useToastStore();

  return (
    <div className="fixed bottom-20 right-4 z-[60] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastNotification key={t.id} item={t} onDismiss={() => remove(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
