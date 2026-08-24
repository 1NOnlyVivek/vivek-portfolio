"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoModal from "./VideoModal";
import { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

export default function HomeClient({ projects }: { projects: any[] }) {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isSlideshowRunning, setIsSlideshowRunning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "work", "contact"];
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      let current = "home";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          if (scrollY >= top - windowHeight / 3) current = section;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  useEffect(() => {
    if (!isSlideshowRunning) return;
    let animationFrameId: number;
    const scrollStep = () => {
      window.scrollBy(0, 1.5);
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) setIsSlideshowRunning(false);
      else animationFrameId = requestAnimationFrame(scrollStep);
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
      if (match && match[2].length === 11) return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
    }
    return null;
  };

  const navItems = [
    { id: "about", label: "PROFILE" },
    { id: "work", label: "PROJECTS" },
    { id: "contact", label: "CONTACT" }
  ];

  return (
    <main className="relative min-h-screen bg-[#F0EBE1] text-[#111111] font-sans selection:bg-[#FDB813] selection:text-black pb-20 scroll-smooth overflow-x-hidden">
      
      <motion.div
        className="fixed top-0 left-0 w-24 h-24 bg-[#FDB813] rounded-full flex items-center justify-center pointer-events-none z-[300]"
        animate={{ x: mousePosition.x - 48, y: mousePosition.y - 48, scale: isHoveringProject ? 1 : 0, opacity: isHoveringProject ? 1 : 0 }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      >
        <span className="text-black font-black tracking-widest text-xs uppercase">Play</span>
      </motion.div>

      <motion.nav
        initial={{ y: -100, opacity: 0, x: "-50%" }}
        animate={{ y: 24, opacity: 1, x: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-0 left-1/2 z-[250] flex items-center justify-center gap-2 md:gap-4 bg-white/90 backdrop-blur-md rounded-full px-4 md:px-6 py-2 text-[10px] md:text-xs font-bold tracking-widest uppercase border border-black/10 shadow-sm w-max max-w-[95vw]"
      >
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`px-5 py-2 rounded-full transition-all duration-300 ${
              activeSection === item.id ? "bg-[#FDB813] text-black shadow-sm" : "text-gray-500 hover:text-black hover:bg-gray-100"
            }`}
          >
            {item.label}
          </a>
        ))}
      </motion.nav>
      
      <section id="home" className="relative w-full min-h-screen flex flex-col justify-center items-center pt-20">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl z-10 px-6">
          <motion.div variants={imageReveal} className="relative w-64 h-64 md:w-96 md:h-96 flex-shrink-0 mt-12 md:mt-0">
            <div className="absolute inset-0 bg-[#FDB813] rounded-l-[100px] rounded-r-xl overflow-hidden flex justify-center">
              <img src="/your-portrait.png" alt="Vivek" className="absolute bottom-0 h-[115%] w-auto max-w-none object-contain object-bottom pointer-events-none" />
            </div>
            <div className="absolute inset-0 flex justify-center pointer-events-none z-10" style={{ clipPath: "polygon(-100% -100%, 200% -100%, 200% 50%, -100% 50%)" }}>
              <img src="/your-portrait.png" alt="Vivek" className="absolute bottom-0 h-[115%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)] pointer-events-none" />
            </div>
          </motion.div>

          <div className="flex flex-col items-center md:items-start md:ml-12 mt-10 md:mt-0 w-full text-center md:text-left relative">
            <motion.div variants={fadeUp} className="mb-2 bg-[#FDB813] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block transform -rotate-2">
              Creative Visual
            </motion.div>

            {/* CV Quote Marks & Period integrated here */}
            <motion.div variants={fadeUp} className="flex flex-col md:flex-row items-center md:items-baseline justify-center md:justify-start gap-0 md:gap-4 overflow-visible w-full mt-2">
              <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-[#111111] tracking-tighter uppercase font-impact leading-none flex items-start justify-center md:justify-start">
                <span className="text-[#FDB813] text-5xl sm:text-6xl md:text-8xl leading-[0.5] font-serif mr-1 sm:mr-3 mt-2 sm:mt-4">“</span>
                PORTFOLIO<span className="text-[#FDB813]">.</span>
              </h1>
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex items-center gap-4 mt-6 text-sm font-bold text-gray-600">
              <span className="flex items-center justify-center w-6 h-6 bg-black text-white rounded-full text-xs">&gt;</span>
              Vivek Bhimajiyani
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col items-center md:items-start gap-4 mt-12 md:mt-16 w-full text-xs tracking-[0.2em] font-black text-black">
              <button onClick={() => setIsSlideshowRunning(true)} className="flex items-center gap-2 hover:text-[#FDB813] transition-colors w-max">
                START <span className="text-[10px] text-gray-500 lowercase tracking-normal font-normal">slideshow</span>
              </button>
              <a href="#work" className="hover:text-[#FDB813] transition-colors w-max">PROJECTS</a>
              <a href="#contact" className="hover:text-[#FDB813] transition-colors w-max">CONTACT</a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section id="about" className="relative w-full min-h-screen flex flex-col items-center pt-32 px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-5xl z-10 mt-10">
          <motion.div variants={imageReveal} className="relative flex flex-col items-center justify-center">
            <div className="absolute w-64 h-72 bg-[#FDB813] rounded-[40px] -z-10 translate-x-8 translate-y-8"></div>
            <img src="/your-portrait-2.png" alt="Profile" className="h-96 object-cover rounded-[40px] z-10 shadow-lg grayscale contrast-125" />
          </motion.div>

          <div className="flex flex-col justify-center space-y-10">
            
            <motion.div variants={fadeUp}>
              {/* CV Quote Marks for HELLO */}
              <h3 className="text-5xl font-black text-[#111111] tracking-tighter uppercase font-impact mb-4 flex items-start">
                 <span className="text-[#FDB813] text-5xl leading-[0.6] font-serif mr-2 mt-2">“</span>
                 HELLO.
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-semibold max-w-md">
                I'm <span className="text-black font-black">Vivek Bhimajiyani</span>, a self-taught video editor with over <span className="text-black font-black">2 years</span> of experience.
                <br/><br/>
                I love crafting sequences that don't just look good — they tell a compelling story, bringing ideas to life from fast-paced social media reels to cinematic short films.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-8 text-xs font-bold text-gray-600">
              <div>
                <h4 className="text-black mb-3 font-black text-lg border-b-2 border-black pb-2 inline-block">Education</h4>
                <p className="mt-2 text-2xl font-black text-black font-impact">2026</p>
                <p className="font-semibold">Bachelors in Computer<br/>Applications</p>
                <p className="text-[10px] text-gray-400">Dr Subhash University</p>
              </div>
              
              <div>
                <h4 className="text-black mb-3 font-black text-lg border-b-2 border-black pb-2 inline-block">Software & Tools</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="w-8 h-8 rounded bg-[#00005c] flex items-center justify-center"><img src="/pr-logo.png" alt="PR" className="w-6 h-6 object-cover" /></div>
                  <div className="w-8 h-8 rounded bg-[#001e36] flex items-center justify-center"><img src="/ps-logo.png" alt="PS" className="w-6 h-6 object-cover" /></div>
                  <div className="w-8 h-8 rounded bg-[#00005c] flex items-center justify-center"><img src="/ae-logo.png" alt="AE" className="w-6 h-6 object-cover" /></div>
                  <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center"><img src="/canva-logo.png" alt="Canva" className="w-5 h-5 object-cover" /></div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
                <h4 className="text-black mb-3 font-black text-lg border-b-2 border-black pb-2 inline-block">Working Experience</h4>
                <div className="flex flex-col gap-2 mt-2 text-xs font-semibold text-gray-600">
                  <p><span className="text-black font-black">Video Editor, SMM</span> | yourMicsiters 6-Months</p>
                  <p><span className="text-black font-black">Video Editor</span> | Narad Ayurveda 1-Year</p>
                  <p><span className="text-black font-black">Video Editor</span> | ETA Marketing & Solutions</p>
                  <p><span className="text-black font-black">Freelancer</span> | Worked with over 20+ Clients</p>
                </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      <section id="work" className="relative w-full min-h-screen flex flex-col items-center pt-32 px-6">
        <motion.div variants={fadeUp} className="w-full max-w-5xl flex items-center gap-4 mb-12">
          {/* Geometric "OF" Diamond from CV */}
          <h2 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase font-impact whitespace-nowrap flex items-center">
            KEY 
            <span className="relative mx-3 md:mx-4 inline-flex items-center justify-center w-12 h-12">
              <span className="absolute inset-0 bg-[#FDB813] rotate-45 -z-10 shadow-sm"></span>
              <span className="text-black z-10 text-xl md:text-2xl mt-1">OF</span>
            </span> 
            CONTENT
          </h2>
          <div className="h-[3px] bg-black w-full rounded-full"></div>
        </motion.div>

        <motion.div 
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl z-10"
        >
          {projects.map((project) => {
            const displayThumbnail = getThumbnail(project);
            return (
              <motion.div
                variants={fadeUp} key={project._id} onClick={() => setSelectedProject(project)}
                onMouseEnter={() => setIsHoveringProject(true)} onMouseLeave={() => setIsHoveringProject(false)}
                className="group cursor-none relative rounded-2xl bg-white border-2 border-transparent hover:border-[#FDB813] overflow-hidden aspect-video flex flex-col justify-between transition-all duration-300 shadow-[4px_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(253,184,19,0.3)]"
              >
                {displayThumbnail && (
                  <div className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 z-0" style={{ backgroundImage: `url(${displayThumbnail})` }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0 transition-all duration-500" />
                <div className="flex justify-between items-center z-10 p-6 opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black bg-[#FDB813] px-3 py-1 rounded-full shadow-sm">{project.category}</span>
                  <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm">{project.year}</span>
                </div>
                <div className="z-10 p-6 mt-auto overflow-hidden pointer-events-none">
                  <h3 className="text-2xl font-black text-white transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out font-impact tracking-wider">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section id="contact" className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20 border-t-2 border-black/5 mt-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-6xl items-center relative z-10">
          <motion.div variants={imageReveal} className="relative flex flex-col md:flex-row items-center justify-center md:justify-start w-full">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/10 flex flex-col items-center text-center z-10 mb-8 md:mb-0">
              <h3 className="font-black text-xl mb-4 text-black">Let's Work Together :</h3>
              <div className="text-xs font-semibold text-gray-600 flex flex-col gap-2 text-left w-full">
                <p>✉ bhimajiyanivivek@gmail.com</p>
                <p>✆ +91 9016148014</p>
                <p>◎ @vivek.bhimajiyani</p>
              </div>
              <div className="mt-6 w-full pt-4 border-t border-black/10">
                 <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Scan or Click</p>
              </div>
            </div>
            <div className="relative md:absolute md:left-[50%] flex flex-col items-start justify-center gap-3 z-20 w-max mx-auto md:mx-0">
              <a href="https://www.instagram.com/vivek.bhimajiyani/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-bold tracking-widest text-black hover:text-black hover:scale-105 transition-all duration-300 bg-white border border-black/10 pr-4 rounded-full shadow-sm hover:shadow-md hover:border-[#FDB813] group">
                <div className="w-10 h-10 bg-[#FDB813] rounded-full flex items-center justify-center text-black">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
                INSTAGRAM
              </a>
              <a href="https://www.youtube.com/@vivek.bhimajiyani" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-bold tracking-widest text-black hover:text-black hover:scale-105 transition-all duration-300 md:ml-6 bg-white border border-black/10 pr-4 rounded-full shadow-sm hover:shadow-md hover:border-[#FDB813] group">
                <div className="w-10 h-10 bg-[#FDB813] rounded-full flex items-center justify-center text-black">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
                YOUTUBE
              </a>
              <a href="https://www.linkedin.com/in/vivek-bhimajiyani-91a8b4304/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs font-bold tracking-widest text-black hover:text-black hover:scale-105 transition-all duration-300 md:ml-12 bg-white border border-black/10 pr-4 rounded-full shadow-sm hover:shadow-md hover:border-[#FDB813] group">
                <div className="w-10 h-10 bg-[#FDB813] rounded-full flex items-center justify-center text-black">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                </div>
                LINKEDIN
              </a>
            </div>
          </motion.div>

          <div className="text-center md:text-right flex flex-col justify-end mt-12 md:mt-0 font-impact tracking-tighter uppercase leading-[0.85]">
            <motion.span variants={fadeUp} className="text-5xl md:text-8xl text-black font-black">LET'S</motion.span>
            <motion.span variants={fadeUp} className="text-5xl md:text-8xl text-black font-black">CREATE</motion.span>
            <motion.span variants={fadeUp} className="text-5xl md:text-8xl text-black font-black">SOMETHING</motion.span>
            <motion.span variants={fadeUp} className="text-5xl md:text-8xl text-[#FDB813] font-black">TOGETHER.</motion.span>
          </div>
        </motion.div>
      </section>
      <VideoModal selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
    </main>
  );
}