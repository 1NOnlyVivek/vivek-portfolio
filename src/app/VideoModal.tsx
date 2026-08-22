// @ts-nocheck
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";

export default function VideoModal({ selectedProject, setSelectedProject }: any) {
  
  // 1. Grab the URL and force it to be safe
  const rawUrl = selectedProject?.videoUrl || "";
  const safeUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
  
  // 2. Detect the platform
  const isVimeo = safeUrl.includes("vimeo.com");
  const isYouTube = safeUrl.includes("youtube.com") || safeUrl.includes("youtu.be");
  const isDrive = safeUrl.includes("drive.google.com");
  const isInstagram = safeUrl.includes("instagram.com");
  
  // 3. If it's Drive, IG, or a generic link that isn't YT/Vimeo, we require external viewing
  const requiresExternalViewing = isDrive || isInstagram || (!isYouTube && !isVimeo && !safeUrl.endsWith('.mp4'));

  return (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-[#020d18] border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Container */}
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex-shrink-0">
              {rawUrl ? (
                requiresExternalViewing ? (
                  <div className="flex flex-col items-center justify-center w-full h-full bg-[#050b14] border-inner border-white/5 text-center p-6">
                    <svg className="w-16 h-16 mb-4 opacity-30 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    <p className="text-sm font-bold tracking-widest uppercase mb-2 text-white">External Video Link</p>
                    <p className="text-xs max-w-sm leading-relaxed text-gray-500">
                      This video is hosted on a platform that blocks embedded playback. Please use the secure link below to view the original video.
                    </p>
                  </div>
                ) : isVimeo ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${safeUrl.split("/").pop()}?autoplay=1&loop=1&autopause=0`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    allow="encrypted-media"
                    className="absolute top-0 left-0 w-full h-full bg-white"
                  ></iframe>
                ) : (
                  <>
                    {/* @ts-ignore */}
                    <ReactPlayer
                      url={safeUrl}
                      width="100%"
                      height="100%"
                      playing={true}
                      controls={true}
                    />
                  </>
                )
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
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-widest uppercase rounded-full transition-colors border border-white/10 flex items-center gap-2 shadow-lg"
                >
                  Watch Original Video <span className="text-lg leading-none">↗</span>
                </a>
              </div>
            )}

            {/* Project Details Below Video */}
            <div className="mt-8">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-3xl font-black text-white font-impact tracking-wider">
                  {selectedProject.title}
                </h3>
                <span className="text-xs font-mono text-gray-500">{selectedProject.year}</span>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-white/10 rounded-full text-white">
                {selectedProject.category}
              </span>
              <p className="text-sm text-gray-400 mt-6 leading-relaxed font-semibold">
                {selectedProject.description}
              </p>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}