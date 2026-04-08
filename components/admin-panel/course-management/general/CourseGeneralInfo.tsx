import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiCourseGeneralDetails, ApiStaffMember } from "@/hooks/api/courses/useGetCourseById";

interface CourseGeneralInfoProps {
  data?: ApiCourseGeneralDetails;
  isLoading?: boolean;
}

const InfoItem = ({
  label,
  children,
  isLoading,
}: {
  label: string;
  children: React.ReactNode;
  isLoading?: boolean;
}) => (
  <div className="flex flex-col items-start gap-1 w-full">
    <span className="font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
      {label}
    </span>
    <div className="font-inter text-[16px] font-medium leading-[24px] text-[#314158] w-full min-h-[24px]">
      {isLoading ? <Skeleton className="h-5 w-3/4 rounded" /> : children}
    </div>
  </div>
);

// Helper to render a staff member using full_name or email
const StaffIdItem = ({ member }: { member: ApiStaffMember }) => (
  <div className="flex items-center gap-2">
    <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
      <span className="text-[10px] text-slate-500 font-bold">
        {(member.full_name || member.email)?.[0]?.toUpperCase() ?? "?"}
      </span>
    </div>
    <span className="whitespace-nowrap text-sm text-[#314158] truncate max-w-[120px]">
      {member.full_name || member.email}
    </span>
  </div>
);

export function CourseGeneralInfo({ data, isLoading }: CourseGeneralInfoProps) {
  const staffMembers = data?.staff_members || [];
  const certificates = data?.certificates || [];

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-6 self-stretch p-4 rounded-lg border border-slate-200 bg-slate-50 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
      )}
    >
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        <InfoItem label="Level" isLoading={isLoading}>
          {data?.level}
        </InfoItem>

        <InfoItem label="Lecturer" isLoading={isLoading}>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
              <span className="text-[10px] text-slate-500 font-bold">
                {(data?.lecturer?.full_name || data?.lecturer?.email)?.[0]?.toUpperCase() ?? "L"}
              </span>
            </div>
            <span className="text-sm truncate">
              {data?.lecturer?.full_name || data?.lecturer?.email || data?.lecturer_id || "Not assigned"}
            </span>
          </div>
        </InfoItem>

        <InfoItem label="Language" isLoading={isLoading}>
          {data?.language}
        </InfoItem>

        <InfoItem label="Certificates" isLoading={isLoading}>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Show first item */}
            {certificates.length > 0 && (
              <span className="truncate text-sm">{certificates[0].name}</span>
            )}

            {/* Overflow Popover */}
            {certificates.length > 1 && (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-1.5 text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-300 transition-colors">
                    +{certificates.length - 1}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-white" align="start">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-slate-500 mb-1">
                      All Certificates
                    </span>
                    {certificates.map((cert, idx) => (
                      <div
                        key={cert.id || idx}
                        className="text-sm text-slate-700 py-1 border-b border-slate-100 last:border-0"
                      >
                        {cert.name}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {certificates.length === 0 && (
              <span className="text-sm text-slate-400 italic">None</span>
            )}
          </div>
        </InfoItem>

        <InfoItem label="Hierarchy Type" isLoading={isLoading}>
          {data?.hierarchy_type || "N/A"}
        </InfoItem>

        <InfoItem label="Course Type" isLoading={isLoading}>
          {data?.course_type || "N/A"}
        </InfoItem>

        <InfoItem label="Assessment" isLoading={isLoading}>
          {data?.has_assessment ? "Yes" : "No"}
        </InfoItem>

        <InfoItem label="Lesson Duration" isLoading={isLoading}>
          {data?.lesson_duration_hours
            ? `${data.lesson_duration_hours}h`
            : "N/A"}
        </InfoItem>

        <InfoItem label="Staff Members" isLoading={isLoading}>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Show first item */}
            {staffMembers.length > 0 && <StaffIdItem member={staffMembers[0]} />}

            {/* Overflow Popover */}
            {staffMembers.length > 1 && (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-1.5 text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-300 transition-colors">
                    +{staffMembers.length - 1}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-white" align="start">
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                      All Staff IDs
                    </span>
                    {staffMembers.map((member, idx) => (
                      <StaffIdItem key={member.id || idx} member={member} />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {staffMembers.length === 0 && (
              <span className="text-sm text-slate-400 italic">None</span>
            )}
          </div>
        </InfoItem>
      </div>
    </div>
  );
}
