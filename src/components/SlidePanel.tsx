import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
};

const springTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 35,
  mass: 0.8,
};

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** Depth-layered header — slightly darker than the panel body */
export function SlidePanelHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`shrink-0 bg-[var(--surface2)] border-b border-[var(--border)] ${className}`}>
      {children}
    </div>
  );
}

export default function SlidePanel({
  isOpen,
  onClose,
  width = '400px',
  children,
  className = '',
  ariaLabel,
}: SlidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const firstFocusable = panelRef.current.querySelector<HTMLElement>(FOCUSABLE);
    firstFocusable?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="slide-panel-backdrop"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-black/20 dark:bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="slide-panel"
            ref={panelRef}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={springTransition}
            className={`fixed top-0 right-0 h-full z-[60] flex flex-col w-full bg-[var(--surface)] border-l border-[var(--border)] ${className}`}
            style={{ maxWidth: width, boxShadow: 'var(--shadow-float), -8px 0 40px rgba(0,0,0,0.10), -2px 0 8px rgba(0,0,0,0.06)' }}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
