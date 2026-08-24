// @ts-nocheck
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";

export default function VideoModal({ selectedProject, setSelectedProject }: any) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !selectedProject) return null;
  
  let rawUrl = selectedProject.videoUrl || "";
  rawUrl = rawUrl.replace(/\s+/g, '');
  if (rawUrl && !rawUrl.startsWith("http")) rawUrl = `https://${rawUrl}`;
  
  const extractYtId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  };
  
  const ytId = extractYtId(rawUrl);
  const isYouTube = !!ytId; 
  
  const isVimeo = rawUrl.includes("vimeo.com");
  const vimeoId = isVimeo ? rawUrl.split("/").pop()?.split("?")[0] : null;
  
  const isMp4 = rawUrl.endsWith(".mp4");
  const isShort = rawUrl.includes("shorts/") || rawUrl.includes("reel");
  const requiresExternalViewing = !isYouTube && !isVimeo && !isMp4;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ zIndex: 99999 }}
        // Light frosted glass background
        className="fixed inset-0 flex items-center justify-center p-4 bg-white/70 backdrop-blur-md cursor-auto"
        onClick={() => setSelectedProject(null)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          // Cream card matching the main theme
          className="relative w-full max-w-5xl bg-[#F0EBE1] border border-black/10 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col max-h-[95vh] overflow-y-auto cursor-auto"
        >
          
          <div className="flex justify-between items-start mb-4">
            <div className="pr-4">
              <h3 className="text-2xl md:text-3xl font-black text-[#111111] font-impact tracking-wider">
                {selectedProject.title}
              </h3>
              <span className="text-xs font-mono text-gray-500">{selectedProject.year}</span>
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="p-2 bg-black/5 hover:bg-black/10 rounded-full text-black transition-colors flex-shrink-0 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={`relative bg-black rounded-xl overflow-hidden shadow-inner flex-shrink-0 ${isShort ? 'w-full max-w-sm mx-auto aspect-[9/16]' : 'w-full aspect-video'}`}>
            {rawUrl ? (
              requiresExternalViewing ? (
                <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 border-inner border-black/10 text-center p-6">
                  <svg className="w-16 h-16 mb-4 opacity-30 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  <p className="text-sm font-black tracking-widest uppercase mb-2 text-black">External Video Link</p>
                  <p className="text-xs max-w-sm leading-relaxed text-gray-600">
                    This video is hosted on a platform that blocks embedded playback. Please use the secure link below to view the original video.
                  </p>
                </div>
              ) : isYouTube ? (
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full bg-black cursor-auto"
                ></iframe>
              ) : isVimeo ? (
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}?rel=0`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full bg-black cursor-auto"
                ></iframe>
              ) : (
                <ReactPlayer
                  url={rawUrl}
                  width="100%"
                  height="100%"
                  controls={true}
                  playsinline={true}
                />
              )
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-200">
                No video URL provided.
              </div>
            )}
          </div>

          {rawUrl && (
            <div className="mt-6 flex justify-center">
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-[#111111] hover:bg-[#FDB813] text-white hover:text-black text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
              >
                Watch Original Video <span className="text-lg leading-none">↗</span>
              </a>
            </div>
          )}

          <div className="mt-6">
            <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 bg-[#FDB813] rounded-full text-black inline-block mb-4 shadow-sm border border-black/5">
              {selectedProject.category}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed font-semibold">
              {selectedProject.description}
            </p>
          </div>
          
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}