"use client";

import React from "react";

import Link from "next/link";

import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

interface BackButtonProps {
  href: string;
  label: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function BackButton({ href, label, className, onClick }: BackButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <Link 
      href={href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 text-[#0F172B] font-sans text-sm font-semibold leading-5 hover:underline w-fit",
        className
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
