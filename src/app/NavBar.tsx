"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NavBar() {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4"
    >
      <nav className="flex items-center justify-between px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
        <Link href="/" className="interactive text-white font-bold tracking-widest text-sm">
          EDIT//BAY
        </Link>
        <div className="flex items-center gap-8 text-xs font-medium tracking-widest text-zinc-400 uppercase">
          <Link href="#work" className="interactive hover:text-white transition-colors duration-300">Work</Link>
          <Link href="#about" className="interactive hover:text-white transition-colors duration-300">About</Link>
          <a href="mailto:contact@example.com" className="interactive text-white bg-white/10 px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300">
            Let's Talk
          </a>
        </div>
      </nav>
    </motion.div>
  );
}