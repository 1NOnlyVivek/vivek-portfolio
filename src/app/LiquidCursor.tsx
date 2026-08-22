"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function LiquidCursor() {
  const [hoverState, setHoverState] = useState<"default" | "project" | "button">("default");

  // Main Cursor Physics (Fast, responsive, zero lag)
  const mouseX = useSpring(0, { damping: 40, stiffness: 1000, mass: 0.1 });
  const mouseY = useSpring(0, { damping: 40, stiffness: 1000, mass: 0.1 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      if (target.closest(".project-card")) {
        setHoverState("project");
      } else if (target.closest("a") || target.closest("button") || target.closest(".interactive")) {
        setHoverState("button");
      } else {
        setHoverState("default");
      }
    };
    
    document.body.style.cursor = "none";
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "auto";
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* --- THE MAIN INTERACTIVE CURSOR --- */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100]"
        style={{ x: mouseX, y: mouseY }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center mix-blend-difference"
          animate={{
            width: hoverState === "project" ? 80 : hoverState === "button" ? 12 : 16,
            height: hoverState === "project" ? 80 : hoverState === "button" ? 12 : 16,
            backgroundColor: hoverState === "project" ? "#ffffff" : hoverState === "button" ? "#ffffff" : "#ffffff",
            borderRadius: "9999px",
          }}
        >
          {/* Your future custom cursor image can still go here! */}
          {hoverState === "default" && <div className="w-full h-full" />}

          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: hoverState === "project" ? 1 : 0 }}
            className="text-black text-xs font-black tracking-widest uppercase mix-blend-normal absolute"
          >
            Play
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  );
}