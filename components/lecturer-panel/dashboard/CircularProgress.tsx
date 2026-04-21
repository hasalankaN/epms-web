"use client";

import { cn } from "@/lib/utils";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export function CircularProgress({
  progress,
  size = 140,
  strokeWidth = 4,
  color = "#E60076",
  className,
}: CircularProgressProps) {
  const radius = 62;
  const center = size / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Generate a unique ID for the gradient to avoid conflicts if multiple charts are present
  const gradientId = `progress-gradient-${progress}-${color.replace("#", "")}`;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform rotate-90 drop-shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-sans text-[18px] font-semibold leading-[30px] text-[#E60076]">
          {progress}%
        </span>
        <span className="font-sans text-[12px] font-normal leading-[16px] text-[#1D293D]">
          Completion Rate
        </span>
      </div>
    </div>
  );
}
