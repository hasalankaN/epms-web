"use client";

import React, { useEffect, useRef, useState } from "react";

import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

import { cn } from "@/lib/utils";

// --- VideoSlider Component ---

interface VideoSliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
  fillColor?: string;
}

function VideoSlider({ value, max, onChange, className, fillColor = "bg-white" }: VideoSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculatePercentage = (clientX: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));

    return (x / rect.width) * max;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const newValue = calculatePercentage(e.clientX);

    onChange(newValue);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newValue = calculatePercentage(e.clientX);

        onChange(newValue);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const percentage = (value / max) * 100;

  return (
    <div 
      ref={containerRef}
      className={cn("relative h-4 flex items-center cursor-pointer group/slider", className)}
      onMouseDown={handleMouseDown}
    >
      {/* Track Background */}
      <div className="absolute w-full h-[4px] bg-[#FFFFFF4D] rounded-lg overflow-hidden">
        {/* Track Fill */}
        <div 
          className={cn("h-full", fillColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Thumb - Centered at the end of the fill */}
      <div 
        className="absolute h-3 w-3 bg-[#E60076] rounded-full shadow-sm transform -translate-x-1/2 opacity-0 group-hover/slider:opacity-100 transition-opacity"
        style={{ left: `${percentage}%`, backgroundColor: fillColor === "bg-white" ? "white" : "#E60076" }}
      />
    </div>
  );
}

// --- MediaPlayer Component ---

export interface MediaPlayerProps {
  url: string;
  className?: string;
  accentColor?: string;
}

export function MediaPlayer({ url, className, accentColor = "#E60076" }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }

      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !videoRef.current.paused) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;

      if (Number.isFinite(total) && total !== duration) {
        setDuration(total);
      }

      if (Number.isFinite(total) && total > 0 && Number.isFinite(current)) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && Number.isFinite(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      const currentDuration = videoRef.current.duration || duration;
      
      if (Number.isFinite(currentDuration) && currentDuration > 0) {
        const newTime = (value / 100) * currentDuration;

        videoRef.current.currentTime = newTime;
        setProgress(value);
      }
    }
  };

  const handleVolumeChange = (value: number) => {
    if (Number.isFinite(value)) {
      const newVolume = Math.max(0, Math.min(1, value));

      setVolume(newVolume);

      if (videoRef.current) {
        videoRef.current.volume = newVolume;
      }

      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div 
      className={cn(
        "group relative w-full h-full rounded-lg overflow-hidden border border-slate-200 bg-black shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={url || undefined}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        playsInline
      >
        Your browser does not support the video tag.
      </video>

      {/* Play Overlay */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform hover:scale-110">
            <Play className="h-8 w-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Custom Controls Bar */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress Bar */}
        <VideoSlider 
          value={progress} 
          max={100} 
          onChange={handleSeek} 
          fillColor={`bg-[${accentColor}]`}
          className="w-full"
        />

        <div className="flex items-center justify-between mt-2 text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-[#E60076] transition-colors" style={{ ['--accent' as string]: accentColor }}>
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </button>
            
            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="hover:text-[#E60076] transition-colors">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <div className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300 flex items-center pl-2">
                <VideoSlider 
                  value={isMuted ? 0 : volume} 
                  max={1} 
                  onChange={handleVolumeChange}
                  fillColor="bg-white"
                  className="w-20"
                />
              </div>
            </div>

            <span className="text-xs font-medium font-inter">
              {formatTime((progress / 100) * duration)} / {formatTime(duration)}
            </span>
          </div>

          <button onClick={toggleFullscreen} className="hover:text-[#E60076] transition-colors">
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
