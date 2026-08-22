"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function VideoModal({ selectedProject, setSelectedProject }: any) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!selectedProject) setIsPlaying(false);
  }, [selectedProject]);

  const handleClose = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setSelectedProject(null);
    }, 50); 
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getInstagramId = (url: string) => {
    if (!url) return null;
    const match = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const isYouTube = selectedProject?.videoUrl?.includes("youtube") || selectedProject?.videoUrl?.includes("youtu.be");
  const isShort = selectedProject?.videoUrl?.includes("shorts");
  const ytVideoId = isYouTube ? getYouTubeVideoId(selectedProject.videoUrl) : null;

  const isInstagram = selectedProject?.videoUrl?.includes("instagram.com");
  const igId = isInstagram ? getInstagramId(selectedProject.videoUrl) : null;

  // If it's IG or a YT Short, snap to a vertical phone ratio (9:16). Otherwise, widescreen (16:9).
  const isVertical = isInstagram || isShort;
  const containerStyle = isVertical 
    ? "relative w-full max-w-sm md:max-w-md aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center"
    : "relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center";

  return (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          key="video-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-12"
          onClick={handleClose}
        >
          <button 
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors z-[210] interactive"
            onClick={handleClose}
          >
            <X className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            // We pass the dynamic shape style right here:
            className={containerStyle}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedProject.videoUrl ? (
              isYouTube && ytVideoId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${ytVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedProject.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              ) : isInstagram && igId ? (
                <iframe
                  src={`https://www.instagram.com/p/${igId}/embed`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  allowtransparency="true"
                  allow="encrypted-media"
                  className="absolute top-0 left-0 w-full h-full bg-white"
                ></iframe>
              ) : (
                <ReactPlayer
                  url={selectedProject.videoUrl}
                  width="100%"
                  height="100%"
                  playing={isPlaying}
                  controls={true}
                  onReady={() => setIsPlaying(true)} 
                />
              )
            ) : (
              <div className="text-zinc-500">No video URL provided.</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}