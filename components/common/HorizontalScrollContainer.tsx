"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  className?: string; // Class for the inner scrollable div
  containerClassName?: string; // Class for the outer relative wrapper
  scrollAmount?: number; // Fraction of clientWidth to scroll (default 0.6)
  showArrowsOnHover?: boolean;
}

export function HorizontalScrollContainer({
  children,
  className,
  containerClassName,
  scrollAmount = 0.6,
  showArrowsOnHover = true,
}: HorizontalScrollContainerProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;

    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;

      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;

    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      
      // Observer for content changes
      const observer = new MutationObserver(checkScroll);

      observer.observe(el, { childList: true, subtree: true });

      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
        observer.disconnect();
      };
    }
  }, [checkScroll, children]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;

    if (el) {
      const amount = el.clientWidth * scrollAmount;

      el.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={cn("relative group/scroll w-full", containerClassName)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {canScrollLeft && (showArrowsOnHover ? isHovered : true) && (
          <motion.button
            key="left-scroll"
            initial={{ opacity: 0, x: -10, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: -10, y: "-50%" }}
            onClick={() => handleScroll("left")}
            className="absolute left-2 top-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/90 text-[#64748B] shadow-sm backdrop-blur-sm transition-all hover:text-[#E60076]"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
        )}
        {canScrollRight && (showArrowsOnHover ? isHovered : true) && (
          <motion.button
            key="right-scroll"
            initial={{ opacity: 0, x: 10, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: 10, y: "-50%" }}
            onClick={() => handleScroll("right")}
            className="absolute right-2 top-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/90 text-[#64748B] shadow-sm backdrop-blur-sm transition-all hover:text-[#E60076]"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        ref={scrollRef}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className={cn("overflow-x-auto", className)}
      >
        {children}
      </div>
    </div>
  );
}
