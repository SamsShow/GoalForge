import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getHabitIcon(type) {
    const icons = {
        0: '💻',
        1: '🧮',
        2: '💪',
        3: '🧘',
        4: '🏃'
    };
    return icons[type] || '🎯';
}

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
};

export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const glassEffect = {
    background: "bg-black/20",
    border: "border-white/10",
    blur: "backdrop-blur-xl",
    shadow: "shadow-xl",
    hover: "hover:border-white/20 hover:bg-black/30",
};

export const gradients = {
    primary: "bg-gradient-to-br from-primary/20 via-purple-500/10 to-blue-500/10",
    success: "bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-green-500/5",
    warning: "bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-yellow-500/5",
    danger: "bg-gradient-to-br from-red-500/20 via-pink-500/10 to-red-500/5",
    info: "bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-blue-500/5",
};

export const textGradients = {
    primary: "bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent",
    muted: "bg-gradient-to-r from-white/60 to-white/40 bg-clip-text text-transparent",
};

export const buttonGradients = {
    primary: "bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary",
    glass: "bg-white/5 hover:bg-white/10 border-white/10",
};

export const animations = {
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },
    slideDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
    },
    slideLeft: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    },
    slideRight: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
    },
    rotate: {
        initial: { opacity: 0, rotate: -180 },
        animate: { opacity: 1, rotate: 0 },
        exit: { opacity: 0, rotate: 180 },
    },
};

export const transitions = {
    spring: { type: "spring", stiffness: 300, damping: 30 },
    smooth: { duration: 0.3 },
    bounce: { type: "spring", stiffness: 300 },
};

export const hover = {
    lift: {
        whileHover: { y: -4, scale: 1.02 },
        transition: { type: "spring", stiffness: 300 },
    },
    scale: {
        whileHover: { scale: 1.05 },
        transition: { type: "spring", stiffness: 300 },
    },
    rotate: {
        whileHover: { rotate: 5, scale: 1.1 },
        transition: { type: "spring", stiffness: 300 },
    },
};
