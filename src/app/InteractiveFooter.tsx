"use client";

import { motion } from "framer-motion";

export default function InteractiveFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="border-t border-white/10 mt-32 py-12 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6 bg-black/20 backdrop-blur-md"
    >
      <div className="z-10">
        <h2 className="text-3xl font-bold uppercase tracking-tight text-white">
          LET'S WORK <span className="text-[#00ffcc]">TOGETHER</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-2">Open for freelance projects and post-production roles.</p>
      </div>
      
      <a
        href="mailto:contact@example.com"
        className="interactive z-10 px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        Get In Touch
      </a>
    </motion.footer>
  );
}