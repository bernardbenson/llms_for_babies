import { Variants } from 'framer-motion'

// Common motion variants for consistent animations
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const swipeVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
}

export const slideTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
}

// Diagram-specific animations
export const neuronPulse: Variants = {
  idle: {
    scale: 1,
    opacity: 0.8,
  },
  active: {
    scale: [1, 1.2, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
}

export const connectionFlow: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
}

export const attentionHeat: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

// Section transition variants
export const sectionTransition: Variants = {
  hidden: {
    opacity: 0,
    background: 'linear-gradient(135deg, transparent, transparent)',
  },
  visible: {
    opacity: 1,
    background: [
      'linear-gradient(135deg, hsl(var(--primary) / 0.1), transparent)',
      'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.1))',
      'linear-gradient(135deg, hsl(var(--primary) / 0.1), transparent)',
    ],
    transition: {
      duration: 2,
      ease: 'easeInOut',
    },
  },
}

// Progress bar animation
export const progressBar: Variants = {
  hidden: {
    scaleX: 0,
    originX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

// Code block typewriter effect
export const typewriter: Variants = {
  hidden: {
    width: 0,
  },
  visible: {
    width: '100%',
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  },
}

// Floating animation for decorative elements
export const floating: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Parallax effect for backgrounds
export const parallax = (offset: number): Variants => ({
  animate: {
    y: offset,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
})

// Reduced motion variants (for accessibility)
export const reducedMotion = {
  fadeUp: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } },
  },
  scaleIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } },
  },
}