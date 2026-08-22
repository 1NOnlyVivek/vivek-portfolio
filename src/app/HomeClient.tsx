"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import VideoModal from "./VideoModal";

import { Variants } from "framer-motion"; // Add this to your framer-motion import on line 4

// --- APPLE-STYLE ANIMATION VARIANTS ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

export default function HomeClient({ projects }: { projects: any[] }) {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isSlideshowRunning, setIsSlideshowRunning] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  
  // Custom Play Cursor State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringProject, setIsHoveringProject] = useState(false);

  // Scroll Tracking for the Sticky Pill Nav
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show the sticky nav after scrolling down 80% of the viewport height
    if (latest > window.innerHeight * 0.8) {
      setShowStickyNav(true);
    } else {
      setShowStickyNav(false);
    }
  });

  // Track Mouse for the PLAY cursor
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // Cinematic Auto-Scroll Slideshow logic
  useEffect(() => {
    if (!isSlideshowRunning) return;
    
    let animationFrameId: number;
    const scrollStep = () => {
      window.scrollBy(0, 1.5);
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        setIsSlideshowRunning(false);
      } else {
        animationFrameId = requestAnimationFrame(scrollStep);
      }
    };
    
    animationFrameId = requestAnimationFrame(scrollStep);

    const stopSlideshow = () => setIsSlideshowRunning(false);
    window.addEventListener("wheel", stopSlideshow);
    window.addEventListener("touchstart", stopSlideshow);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("wheel", stopSlideshow);
      window.removeEventListener("touchstart", stopSlideshow);
    };
  }, [isSlideshowRunning]);

  const getThumbnail = (project: any) => {
    if (project.imageUrl) return project.imageUrl;
    if (project.videoUrl) {
      const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
      const match = project.videoUrl.match(ytRegExp);
      if (match && match[2].length === 11) {
        return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
      }
    }
    return null;
  };

  return (
    <main className="relative min-h-screen bg-[#020d18] text-gray-300 font-sans selection:bg-red-500 selection:text-white pb-20 scroll-smooth">
      
      {/* --- CUSTOM PLAY CURSOR --- */}
      <motion.div
        className="fixed top-0 left-0 w-24 h-24 bg-white rounded-full flex items-center justify-center pointer-events-none z-[300] mix-blend-difference"
        animate={{
          x: mousePosition.x - 48,
          y: mousePosition.y - 48,
          scale: isHoveringProject ? 1 : 0,
          opacity: isHoveringProject ? 1 : 0
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      >
        <span className="text-black font-black tracking-widest text-xs uppercase">Play</span>
      </motion.div>

      {/* --- FLOATING STICKY PILL NAV --- */}
      <AnimatePresence>
        {showStickyNav && (
          <motion.nav
            initial={{ y: -100, opacity: 0, x: "-50%" }}
            animate={{ y: 24, opacity: 1, x: "-50%" }}
            exit={{ y: -100, opacity: 0, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-0 left-1/2 z-[250] flex space-x-2 md:space-x-8 bg-[#0a192f]/90 backdrop-blur-xl rounded-full px-6 py-2 text-[10px] md:text-xs font-bold tracking-widest uppercase border border-white/10 shadow-2xl"
          >
            <a href="#about" className="hover:bg-white hover:text-black px-4 py-1 rounded-full transition-all text-white">PROFIL</a>
            <a href="#work" className="hover:bg-white hover:text-black text-gray-400 px-4 py-1 rounded-full transition-all">PROJECT</a>
            <a href="#contact" className="hover:bg-white hover:text-black text-gray-400 px-4 py-1 rounded-full transition-all">CONTACT PERSON</a>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* --- FLOATING OPTIONS HEADER --- */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-0 left-0 w-full bg-[#020d18]/90 backdrop-blur-xl z-[260] border-b border-white/10 flex justify-between items-center px-6 md:px-12 py-6"
          >
            <div className="font-impact text-2xl text-white tracking-widest uppercase">EDIT//BAY</div>
            <div className="flex items-center gap-6 text-xs font-bold tracking-widest uppercase">
              <a href="#work" onClick={() => setShowOptions(false)} className="hover:text-white transition-colors">WORK</a>
              <a href="#about" onClick={() => setShowOptions(false)} className="hover:text-white transition-colors">ABOUT</a>
              <a href="#contact" onClick={() => setShowOptions(false)} className="px-5 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">LET'S TALK</a>
              <button onClick={() => setShowOptions(false)} className="ml-4 text-gray-500 hover:text-white text-xl">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* =========================================
          SECTION 1: HERO
      ========================================= */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
        
        {/* Graphic Logo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="absolute top-10 left-10 z-50">
          <img src="/logo.png" alt="Official Logo" className="h-10 md:h-12 w-auto object-contain" />
        </motion.div>

        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          animate="visible"
          className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl z-10 px-6"
        >
          {/* 3D Pop-Out Hero Image */}
          <motion.div 
            variants={imageReveal} 
            className="relative w-64 h-64 md:w-96 md:h-96 flex-shrink-0 mt-12 md:mt-0"
          >
            {/* LAYER 1: The Base & Bottom Mask (Locks the bottom half inside the curves) */}
            <div className="absolute inset-0 bg-[#800000] rounded-l-full rounded-r-xl shadow-2xl overflow-hidden flex justify-center">
              <img 
                src="/your-portrait.png" 
                alt="Vivek" 
                className="absolute bottom-0 h-[115%] w-auto max-w-none object-contain object-bottom pointer-events-none" 
              />
            </div>
            
            {/* LAYER 2: The 3D Pop-out (Slices the image in half so only the top breaks out) */}
            <div 
              className="absolute inset-0 flex justify-center pointer-events-none z-10"
              style={{ clipPath: "polygon(-100% -100%, 200% -100%, 200% 50%, -100% 50%)" }}
            >
              <img 
                src="/your-portrait.png" 
                alt="Vivek" 
                className="absolute bottom-0 h-[115%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] pointer-events-none" 
              />
            </div>
          </motion.div>

          <div className="flex flex-col items-start md:ml-12 mt-10 md:mt-0">
            <motion.div variants={fadeUp} className="flex items-baseline gap-4 overflow-hidden">
              <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase font-impact">
                PORTFOLIO
              </h1>
              <span className="text-3xl md:text-5xl font-bold text-gray-500 tracking-widest font-impact">2026</span>
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-4 overflow-visible">
              <h1 className="text-5xl sm:text-6xl md:text-9xl font-black text-white tracking-tighter uppercase font-impact leading-none">
                PORTFOLIO
              </h1>
              <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-500 tracking-widest font-impact mt-1 md:mt-0">2026</span>
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex flex-col gap-4 mt-16 text-left w-full md:w-auto text-xs tracking-[0.3em] font-bold text-gray-400">
              <button onClick={() => setIsSlideshowRunning(true)} className="hover:text-white hover:translate-x-2 transition-transform w-max text-left">
                START <span className="text-[10px] text-gray-600 ml-2 lowercase tracking-normal">(Slideshow)</span>
              </button>
              <button onClick={() => setShowOptions(true)} className="hover:text-white hover:translate-x-2 transition-transform w-max text-left">
                OPTIONS
              </button>
              <a href="#contact" className="hover:text-white hover:translate-x-2 transition-transform w-max">
                CONTACT
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* =========================================
          SECTION 2: ABOUT & SKILLS
      ========================================= */}
      <section id="about" className="relative w-full min-h-screen flex flex-col items-center pt-32 px-6 overflow-hidden">
        
        {/* Static Pill for initial layout */}
        <motion.nav 
          initial={{ opacity: 1 }}
          animate={{ opacity: showStickyNav ? 0 : 1 }}
          className="flex space-x-2 md:space-x-8 bg-[#0a192f] rounded-full px-6 py-2 mb-20 text-[10px] md:text-xs font-bold tracking-widest uppercase border border-white/10 shadow-xl z-20 pointer-events-none"
        >
          <span className="bg-white text-black px-4 py-1 rounded-full">PROFIL</span>
          <span className="text-gray-400 px-4 py-1">PROJECT</span>
          <span className="text-gray-400 px-4 py-1">CONTACT PERSON</span>
        </motion.nav>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-5xl z-10"
        >
          <motion.div variants={imageReveal} className="relative flex flex-col items-center justify-center">
            <div className="absolute w-64 h-64 bg-[#0055ff] rounded-full blur-[100px] opacity-40 -z-10"></div>
            <div className="text-center mb-4">
              <p className="text-xs text-gray-400 tracking-[0.2em]">HELLO, I AM</p>
              <h2 className="text-2xl font-black text-white tracking-widest uppercase">VIVEK BHIMAJIYANI</h2>
            </div>
            <img src="/your-portrait-2.png" alt="Profile" className="h-96 object-contain z-10" />
          </motion.div>

          <div className="flex flex-col justify-center space-y-10">
            
            <motion.div variants={fadeUp}>
              <h3 className="text-3xl font-black text-white tracking-widest uppercase font-impact mb-4">ABOUT ME</h3>
              <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wider font-semibold max-w-md">
                I am a self-taught video editor driven by a relentless desire to dominate my craft. I thrive on challenging myself and pushing creative boundaries to build extraordinary visual experiences. I am on a constant pursuit to create my absolute masterpiece, and I am always ready to take on bold, new visions and bring them into reality.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
               <h3 className="text-xl font-black text-white tracking-widest uppercase font-impact mb-4">SOFTWARE & AI TOOLS</h3>
               <div className="flex flex-wrap gap-4">
                  
                  {/* Premiere Pro */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-white/10 hover:scale-110 transition-transform bg-[#00005c]">
                    <img src="/pr-logo.png" alt="Premiere Pro" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* After Effects */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-white/10 hover:scale-110 transition-transform bg-[#00005c]">
                    <img src="/ae-logo.png" alt="After Effects" className="w-full h-full object-cover" />
                  </div>

                  {/* Photoshop */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-white/10 hover:scale-110 transition-transform bg-[#001e36]">
                    <img src="/ps-logo.png" alt="Photoshop" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Canva */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-white/10 hover:scale-110 transition-transform bg-gradient-to-tr from-blue-500 to-purple-500">
                    <img src="/canva-logo.png" alt="Canva" className="w-full h-full object-cover p-1" />
                  </div>

                  {/* Gemini AI */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-white/10 hover:scale-110 transition-transform bg-black">
                    <img src="/gemini-logo.png" alt="Gemini" className="w-full h-full object-cover p-2" />
                  </div>

                  {/* Higgsfield AI */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-white/10 hover:scale-110 transition-transform bg-black">
                    <img src="/higgsfield-logo.png" alt="Higgsfield" className="w-full h-full object-cover p-1" />
                  </div>

               </div>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-8 text-xs font-bold uppercase tracking-wider text-gray-400">
              <div>
                <h4 className="text-white mb-3 font-impact text-lg tracking-widest border-b border-white/10 pb-2 inline-block">EDUCATION</h4>
                <p className="mt-2">• BCA Graduate</p>
              </div>
              <div>
                <h4 className="text-white mb-3 font-impact text-lg tracking-widest border-b border-white/10 pb-2 inline-block">EXPERIENCE</h4>
                <div className="flex flex-col gap-2 mt-2">
                  <p>• ETA Marketing Solutions</p>
                  <p>• Narad Ayurveda</p>
                  <p>• Freelance Editor</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-4 p-5 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.05] transition-colors relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
               <h4 className="text-white mb-2 font-impact text-md tracking-widest uppercase flex items-center gap-2">
                 <span className="text-red-500">★</span> FUN FACT
               </h4>
               <p className="text-xs text-gray-400 leading-relaxed font-semibold uppercase tracking-wider">
                 I was awarded <span className="text-white">Employee of the Month</span> in just my 2nd month of joining ETA Marketing & Solutions.
               </p>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* =========================================
          SECTION 3: WORK GRID
      ========================================= */}
      <section id="work" className="relative w-full min-h-screen flex flex-col items-center pt-32 px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase font-impact mb-12"
        >
          RECAP PROJECT 2026 <span className="text-sm tracking-widest font-sans font-bold text-gray-500 align-middle">VIDEO EDITING</span>
        </motion.h2>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl z-10"
        >
          {projects.map((project) => {
            const displayThumbnail = getThumbnail(project);
            return (
              <motion.div
                variants={fadeUp}
                key={project._id}
                onClick={() => setSelectedProject(project)}
                onMouseEnter={() => setIsHoveringProject(true)}
                onMouseLeave={() => setIsHoveringProject(false)}
                className="group cursor-none relative rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden aspect-video flex flex-col justify-between hover:border-white/20 transition-all duration-500 shadow-xl"
              >
                {displayThumbnail && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 z-0"
                    style={{ backgroundImage: `url(${displayThumbnail})` }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0 group-hover:via-black/20 transition-all duration-500" />

                <div className="flex justify-between items-center z-10 p-8 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-semibold uppercase tracking-wider">{project.category}</span>
                  <span className="text-xs font-mono">{project.year}</span>
                </div>
                
                <div className="z-10 p-8 mt-auto overflow-hidden pointer-events-none">
                  <h3 className="text-2xl font-bold text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out drop-shadow-lg font-impact tracking-wider">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* =========================================
          SECTION 4: CONTACT & FOOTER
      ========================================= */}
      <section id="contact" className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-6xl items-center relative z-10"
        >
          
          <motion.div variants={imageReveal} className="relative flex flex-col md:flex-row items-center justify-center md:justify-start w-full">
            
            {/* Profile Image */}
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-[#020d18] shadow-2xl relative z-10 mb-8 md:mb-0">
              <img src="/your-portrait.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            
            {/* Social Links (Stacks below on mobile, overlaps on desktop) */}
            <div className="relative md:absolute md:left-[60%] flex flex-col items-start justify-center gap-3 z-20 w-max mx-auto md:mx-0">
              
              {/* Instagram */}
              <a href="https://www.instagram.com/vivek.bhimajiyani/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-bold tracking-widest text-white hover:scale-105 transition-transform md:-ml-6 bg-[#020d18]/80 pr-4 rounded-full backdrop-blur-sm">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
                @vivek.bhimajiyani
              </a>

              {/* YouTube */}
              <a href="https://www.youtube.com/@vivek.bhimajiyani" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-bold tracking-widest text-white hover:scale-105 transition-transform md:ml-4 bg-[#020d18]/80 pr-4 rounded-full backdrop-blur-sm">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
                YOUTUBE
              </a>

              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/vivek-bhimajiyani-91a8b4304/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-bold tracking-widest text-white hover:scale-105 transition-transform md:ml-10 bg-[#020d18]/80 pr-4 rounded-full backdrop-blur-sm">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                </div>
                LINKEDIN
              </a>

              {/* Email */}
              <a href="mailto:bhimajiyanivivek@gmail.com" className="flex items-center gap-3 text-xs font-bold tracking-widest text-white hover:scale-105 transition-transform md:ml-4 bg-[#020d18]/80 pr-4 rounded-full backdrop-blur-sm">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                EMAIL ME
              </a>

              {/* Phone */}
              <a href="tel:+919016148014" className="flex items-center gap-3 text-xs font-bold tracking-widest text-white hover:scale-105 transition-transform md:-ml-2 bg-[#020d18]/80 pr-4 rounded-full backdrop-blur-sm">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                PHONE CALL
              </a>
            </div>
          </motion.div>

          <div className="text-right flex flex-col justify-end mt-12 md:mt-0 font-impact tracking-tighter uppercase leading-[0.85]">
            <motion.span variants={fadeUp} className="text-5xl md:text-8xl text-[#1a2b40] font-black drop-shadow-sm">LET'S</motion.span>
            <motion.span variants={fadeUp} className="text-5xl md:text-8xl text-[#1a2b40] font-black drop-shadow-sm">CREATE</motion.span>
            <motion.span variants={fadeUp} className="text-5xl md:text-8xl text-[#1a2b40] font-black drop-shadow-sm">SOMETHING</motion.span>
            <motion.span variants={fadeUp} className="text-5xl md:text-8xl text-white font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">CINEMATIC</motion.span>
          </div>
        </motion.div>
      </section>

      <VideoModal selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
    </main>
  );
}