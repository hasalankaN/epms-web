"use client";

import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Mock data to match the screenshot
// In a real app, this would come from props.
const COURSE_INFO = {
    level: "Beginner",
    lecturer: {
        name: "Mr. Ruwan",
        handle: "@ruwan",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ruwan"
    },
    language: "English",
    certificates: ["Available {Free}", "United Kingdom"],
    branch: "Main",
    courseType: "Diploma",
    category: "Online",
    lessonDuration: "2h",
    assessment: "Assignment",
    staffMembers: [
        {
            name: "Kalpa",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kalpa"
        },
        {
            name: "Saduni",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=saduni"
        }
    ]
};

const InfoItem = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="flex flex-col items-start gap-1 w-full">
        <span className="font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
            {label}
        </span>
        <div className="font-inter text-[16px] font-medium leading-[24px] text-[#314158] w-full">
            {children}
        </div>
    </div>
);

// Helper to render staff item
const StaffItem = ({ staff }: { staff: { name: string; avatar: string } }) => (
    <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
            <img src={staff.avatar} alt={staff.name} className="h-full w-full object-cover" />
        </div>
        <span className="whitespace-nowrap text-sm">{staff.name}</span>
    </div>
);

export function CourseGeneralInfo() {
  return (
    <div 
        className={cn(
            "flex flex-col items-start gap-6 self-stretch p-4 rounded-lg border border-slate-200 bg-slate-50 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",

        )}
    >
        {/* Row 1 / Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
            
            <InfoItem label="Level">
                {COURSE_INFO.level}
            </InfoItem>

            <InfoItem label="Lecturer">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                         <img src={COURSE_INFO.lecturer.avatar} alt="lecturer" className="h-full w-full object-cover" />
                    </div>
                    <span>{COURSE_INFO.lecturer.name}</span>
                </div>
            </InfoItem>

            <InfoItem label="Language">
                {COURSE_INFO.language}
            </InfoItem>

            <InfoItem label="Certificates">
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Show first item */}
                     {COURSE_INFO.certificates.length > 0 && (
                        <span className="truncate">{COURSE_INFO.certificates[0]}</span>
                     )}
                     
                     {/* Overflow Popover */}
                     {COURSE_INFO.certificates.length > 1 && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-1.5 text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-300 transition-colors">
                                    +{COURSE_INFO.certificates.length - 1}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-3 bg-white" align="start">
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-semibold text-slate-500 mb-1">All Certificates</span>
                                    {COURSE_INFO.certificates.map((cert, idx) => (
                                        <div key={idx} className="text-sm text-slate-700 py-1 border-b border-slate-100 last:border-0">
                                            {cert}
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                     )}
                </div>
            </InfoItem>

            <InfoItem label="Branch">
                {COURSE_INFO.branch}
            </InfoItem>

            {/* Row 2 implicitly flows here in grid */}
            
            <InfoItem label="Course Type">
                {COURSE_INFO.courseType}
            </InfoItem>

            <InfoItem label="Category">
                {COURSE_INFO.category}
            </InfoItem>

            <InfoItem label="Lesson Duration">
                {COURSE_INFO.lessonDuration}
            </InfoItem>

            <InfoItem label="Assessment">
                {COURSE_INFO.assessment}
            </InfoItem>

            <InfoItem label="Staff Members">
                 <div className="flex items-center gap-2 flex-wrap">
                    {/* Show first item */}
                    {COURSE_INFO.staffMembers.length > 0 && (
                        <StaffItem staff={COURSE_INFO.staffMembers[0]} />
                    )}

                    {/* Overflow Popover */}
                    {COURSE_INFO.staffMembers.length > 1 && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-1.5 text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-300 transition-colors">
                                    +{COURSE_INFO.staffMembers.length - 1}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-3 bg-white" align="start">
                                <div className="flex flex-col gap-3">
                                    <span className="text-xs font-semibold text-slate-500">All Staff Members</span>
                                    {COURSE_INFO.staffMembers.map((staff, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="h-7 w-7 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                                <img src={staff.avatar} alt={staff.name} className="h-full w-full object-cover" />
                                            </div>
                                            <span className="text-sm text-slate-700">{staff.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                 </div>
            </InfoItem>

        </div>
    </div>
  );
}
