"use client";

import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { useRef } from "react";

interface ParallaxProps {
    children: React.ReactNode;
    offset?: number;
    className?: string;
}

export function ParallaxSection({ children, offset = 50, className }: ParallaxProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
    
    return (
        <motion.div
            ref={ref}
            style={{ y }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function ParallaxImage({ src, className }: { src: string; className?: string }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
    
    return (
        <motion.div
            ref={ref}
            className={`relative overflow-hidden ${className}`}
            style={{ scale }}
        >
            <motion.img
                src={src}
                style={{ y }}
                className="object-cover w-full h-full"
            />
        </motion.div>
    );
} 