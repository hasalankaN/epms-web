"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface ChatAvatarProps {
  name: string;
  avatar?: string;
  size?: number;
  online?: boolean;
  className?: string;
}

export function ChatAvatar({
  name,
  avatar,
  size = 24,
  online,
  className,
}: ChatAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          width={size}
          height={size}
          className="rounded-full object-cover border border-[#F8FAFC]"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-full bg-[#FDF2F8] text-[#E60076] font-semibold border border-[#F8FAFC]"
          style={{ width: size, height: size, fontSize: size * 0.35 }}
        >
          {initials}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
      )}
    </div>
  );
}
