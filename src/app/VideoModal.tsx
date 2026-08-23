// @ts-nocheck
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoModal({ selectedProject, setSelectedProject }: any) {
  
  // 1. Clean the URL
  const rawUrl = selectedProject?.videoUrl?.trim() || "";
  const safeUrl = rawUrl.startsWith("http") ? rawUrl : (rawUrl ? `https://${rawUrl}` : "");
  
  // 2. The Safest Regex in the World (Guarantees exactly 11 characters, no slashes or queries)
  const ytMatch = safeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
  const ytId = ytMatch ? ytMatch[1] : null;
  const isYouTube = !!ytId;
  
  const isVimeo = safeUrl.includes("vimeo.com");
  const vimeoId = isVimeo ? safeUrl.split("/").pop()?.split("?")[0] : null; 
  
  const isMp4 = safeUrl.endsWith(".mp4");
  const isShort = safeUrl.includes("shorts/") || safeUrl.includes("reel");

  // 3. Fallback for Drive, IG, or broken links
  const requiresExternalViewing = !isYouTube && !isVimeo && !isMp4;

  return (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 99999 }}
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md cursor-auto"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-[#020d18] border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col max-h-[95vh] overflow-y-auto cursor-auto"
          >
            
            {/* Header with Title & Close Button */}
            <div className="flex justify-between items-start mb-4">
              <div className="pr-4">
                <h3 className="text-2xl md:text-3xl font-black text-white font-impact tracking-wider">
                  {selectedProject.title}
                </h3>
                <span className="text-xs font-mono text-gray-500">{selectedProject.year}</span>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors flex-shrink-0 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Container */}
            <div className={`relative bg-black rounded-xl overflow-hidden shadow-inner flex-shrink-0 ${isShort ? 'w-full max-w-sm mx-auto aspect-[9/16]' : 'w-full aspect-video'}`}>
              {rawUrl ? (
                requiresExternalViewing ? (
                  <div className="flex flex-col items-center justify-center w-full h-full bg-[#050b14] border-inner border-white/5 text-center p-6">
                    <svg className="w-16 h-16 mb-4 opacity-30 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    <p className="text-sm font-bold tracking-widest uppercase mb-2 text-white">External Video Link</p>
                    <p className="text-xs max-w-sm leading-relaxed text-gray-500">
                      This video is hosted on a platform that blocks embedded playback. Please use the secure link below to view the original video.
                    </p>
                  </div>
                ) : isYouTube ? (
                  <iframe
                    // MOBILE FIX: Removed autoplay=1 so iOS doesn't panic and crash the frame
                    src={`https://www.youtube.com/embed/${ytId}?rel=0&playsinline=1`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full bg-black cursor-auto"
                  ></iframe>
                ) : isVimeo ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}?loop=1&autopause=0&playsinline=1`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full bg-black cursor-auto"
                  ></iframe>
                ) : isMp4 ? (
                  <video 
                    src={safeUrl} 
                    controls 
                    playsInline
                    className="w-full h-full bg-black object-contain cursor-auto"
                  />
                ) : null
              ) : (
                <div className="flex items-center justify-center w-full h-full text-zinc-500">
                  No video URL provided.
                </div>
              )}
            </div>

            {/* --- SAFETY FALLBACK BUTTON --- */}
            {rawUrl && (
              <div className="mt-6 flex justify-center">
                <a
                  href={safeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-widest uppercase rounded-full transition-colors border border-white/10 flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  Watch Original Video <span className="text-lg leading-none">↗</span>
                </a>
              </div>
            )}

            {/* Project Category & Description Below Video */}
            <div className="mt-6">
              <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-white/10 rounded-full text-white inline-block mb-4">
                {selectedProject.category}
              </span>
              <p className="text-sm text-gray-400 leading-relaxed font-semibold">
                {selectedProject.description}
              </p>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}