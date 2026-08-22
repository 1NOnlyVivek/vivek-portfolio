"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export default function GlobalFluidBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 100, mass: 1.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{
        background: useMotionTemplate`
          radial-gradient(
            1200px circle at ${smoothX}px ${smoothY}px,
            rgba(255, 45, 85, 0.08), 
            rgba(10, 10, 10, 1) 70%
          )
        `,
      }}
    />
  );
}