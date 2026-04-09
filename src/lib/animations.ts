import type { Variants, Transition } from 'framer-motion';

// --- Spring Presets ---
export const springs = {
  snappy: { type: 'spring' as const, stiffness: 500, damping: 30 },
  smooth: { type: 'spring' as const, stiffness: 300, damping: 25 },
  gentle: { type: 'spring' as const, stiffness: 200, damping: 20 },
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 15 },
} satisfies Record<string, Transition>;

// --- Shared Transitions ---
export const springSnappy: Transition = springs.snappy;

export const springGentle: Transition = springs.gentle;

export const easeFade: Transition = {
  duration: 0.2,
  ease: [0.25, 0.1, 0.25, 1],
};

// --- Fade Up (default page/card entrance) ---
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -3 },
};

// --- Fade In ---
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// --- Scale In (for modals, tooltips) ---
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
};

// --- Slide In from Right (for panels) ---
export const slideRight: Variants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
};

// --- Slide In from Bottom (for bottom sheets) ---
export const slideUp: Variants = {
  initial: { opacity: 0, y: '100%' },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' },
};

// --- Stagger Container ---
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

// --- Stagger Item ---
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

// --- List Item (for AnimatePresence lists) ---
export const listItem: Variants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
};

// --- Hover Lift (for interactive cards) ---
export const hoverLift = {
  whileHover: { y: -2, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  whileTap: { scale: 0.98, transition: { duration: 0.15 } },
};
