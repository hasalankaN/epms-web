"use client";

import { useState, useRef, useEffect } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CourseCard } from "./CourseCard";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  progress: number;
}

interface CourseCategorySectionProps {
  title: string;
  courses: Course[];
}

export function CourseCategorySection({ title, courses }: CourseCategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);

    return () => window.removeEventListener("resize", checkScroll);
  }, [courses]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-[20px] font-semibold leading-8 text-[#0F172B]">
          {title}
        </h2>
      </div>

      <div className="relative group">
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
          style={{ 
            msOverflowStyle: 'none', 
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {courses.map((course) => (
            <div key={course.id} className="w-[288px] shrink-0">
              <CourseCard {...course} />
            </div>
          ))}
        </div>
        
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-[#020618] text-white shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-[#0F172A]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Right Arrow Button */}
        {showRightArrow && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-[#020618] text-white shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-[#0F172A]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
