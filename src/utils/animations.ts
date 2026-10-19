import { type Variants } from 'motion/react';

export const springEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const staggerReveal: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: springEase },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: springEase },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: springEase },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: springEase },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: springEase },
  },
};

export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
  },
  hover: {
    y: -4,
    scale: 1.015,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
  },
  tap: { y: -1, scale: 0.98 },
};

export const imageZoomHover = {
  rest: { scale: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

export const viewportOnce = { once: true, amount: 0.2 as const };
export const viewportAlways = { once: false, amount: 0.15 as const };

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.04,
    },
  }),
};

export type RevealDirection = 'up' | 'left' | 'right' | 'down' | 'scale';

export const getRevealVariant = (direction: RevealDirection): Variants => {
  switch (direction) {
    case 'up':    return fadeUp;
    case 'left':  return fadeLeft;
    case 'right': return fadeRight;
    case 'down':  return fadeDown;
    case 'scale': return scaleIn;
    default:      return fadeUp;
  }
};
