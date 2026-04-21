"use client";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface ZoomClass {
  id: string;
  batchName: string;
  batchNumber: string;
  dateTime: string;
}

interface ZoomClassesCardProps {
  title: string;
  classes: ZoomClass[];
  className?: string;
}

export function ZoomClassesCard({ title, classes, className }: ZoomClassesCardProps) {
  return (
    <div className={cn(
      "flex flex-1 flex-col gap-4 rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
      className
    )}>
      <h3 className="font-sans text-[18px] font-semibold leading-7 text-[#1D293D]">
        {title}
      </h3>

      <div className="flex flex-col gap-4">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between border-b border-[#F1F5F9] pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#F1F5F9] shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                    {/* Zoom Text/Logo base */}
                    <div className="text-[10px] font-black tracking-tight text-[#0B5CFF]">ZOOM</div>
                  </div>
                  {/* Camera Badge Icon at bottom right */}
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g filter="url(#filter0_d_1312_63008)">
                        <circle cx="12" cy="11" r="8" fill="white"/>
                      </g>
                      <path d="M17.8017 8.42188C17.7419 8.38982 17.6745 8.37459 17.6068 8.37781C17.539 8.38103 17.4734 8.40258 17.4169 8.44016L15.75 9.54922V8.375C15.75 8.17609 15.671 7.98532 15.5303 7.84467C15.3897 7.70402 15.1989 7.625 15 7.625H7.5C7.30109 7.625 7.11032 7.70402 6.96967 7.84467C6.82902 7.98532 6.75 8.17609 6.75 8.375V13.625C6.75 13.8239 6.82902 14.0147 6.96967 14.1553C7.11032 14.296 7.30109 14.375 7.5 14.375H15C15.1989 14.375 15.3897 14.296 15.5303 14.1553C15.671 14.0147 15.75 13.8239 15.75 13.625V12.4531L17.4169 13.5645C17.4788 13.6047 17.5512 13.6258 17.625 13.625C17.7245 13.625 17.8198 13.5855 17.8902 13.5152C17.9605 13.4448 18 13.3495 18 13.25V8.75C17.9995 8.68253 17.9809 8.61643 17.946 8.55868C17.9111 8.50093 17.8612 8.45367 17.8017 8.42188ZM15 13.625H7.5V8.375H15V13.625ZM17.25 12.5492L15.75 11.5494V10.4506L17.25 9.45312V12.5492Z" fill="#0F172B"/>
                      <defs>
                        <filter id="filter0_d_1312_63008" x="0" y="0" width="24" height="24" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                          <feOffset dy="1"/>
                          <feGaussianBlur stdDeviation="2"/>
                          <feComposite in2="hardAlpha" operator="out"/>
                          <feColorMatrix type="matrix" values="0 0 0 0 0.101961 0 0 0 0 0.0588235 0 0 0 0 0.00392157 0 0 0 0.12 0"/>
                          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1312_63008"/>
                          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1312_63008" result="shape"/>
                        </filter>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-[#314158]">
                    {cls.batchName} - {cls.batchNumber}
                  </span>
                  <span className="text-[12px] text-[#90A1B9]">
                    {cls.dateTime}
                  </span>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="h-8 rounded-[6px] bg-[#F1F5F9] px-4 text-xs font-semibold text-[#0F172B] hover:bg-[#E2E8F0]">
                Start
              </Button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-[14px] text-[#90A1B9]">No classes scheduled</span>
          </div>
        )}
      </div>
    </div>
  );
}
