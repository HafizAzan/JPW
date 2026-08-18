export const easeOutSmooth = [0.22, 1, 0.36, 1] as const;
export const easeSheet = [0.32, 0.72, 0, 1] as const;

export const overlayTransition = {
  duration: 0.32,
  ease: easeSheet,
};

export const drawerTransition = {
  duration: 0.52,
  ease: easeSheet,
};

export const modalTransition = {
  duration: 0.42,
  ease: easeOutSmooth,
};

export const popTransition = {
  duration: 0.22,
  ease: easeOutSmooth,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutSmooth },
  },
};
