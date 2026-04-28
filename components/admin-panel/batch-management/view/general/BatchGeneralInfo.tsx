"use client";

import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ApiBatchDetail } from "@/hooks/api/batches/useGetBatchById";
import { useGetLecturerById } from "@/hooks/api/lecturers/useGetLecturerById";
import { useGetBranchById } from "@/hooks/api/branches/useGetBranchById";
import { useGetStaffById } from "@/hooks/api/staff/useGetStaffById";
import { useGetCertificateTemplateById } from "@/hooks/api/certificates/useGetCertificateTemplateById";

// ── Helpers ────────────────────────────────────────────────────────────────────

const InfoItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-start gap-1 w-full">
      <span className="font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
        {label}
      </span>
      <div className="font-inter text-[16px] font-medium leading-[24px] text-[#314158] w-full">
        {children}
      </div>
    </div>
  );
};

const Avatar = ({
  src,
  name,
}: {
  src: string | null | undefined;
  name: string;
}) => {
  return (
    <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-slate-300 text-[10px] font-semibold text-white">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

// ── Staff chip (fetches one staff member) ─────────────────────────────────────

function StaffChip({ staffId }: { staffId: string }) {
  const { data } = useGetStaffById(staffId);
  const profile = data?.profile;

  if (!profile) return null;

  const name = `${profile.first_name} ${profile.last_name}`;

  return (
    <div className="flex items-center gap-2">
      <Avatar src={profile.profile_image_url} name={name} />
      <span className="whitespace-nowrap text-sm">{name}</span>
    </div>
  );
}

// ── Certificate chip (fetches one template) ───────────────────────────────────

function CertChip({ certId }: { certId: string }) {
  const { data } = useGetCertificateTemplateById(certId);

  if (!data) return null;

  const label =
    data.pricing_type === "FREE" ? `${data.name} {Free}` : `${data.name}`;

  return <span className="truncate">{label}</span>;
}

// ── Main Component ────────────────────────────────────────────────────────────

interface BatchGeneralInfoProps {
  batch: ApiBatchDetail | null | undefined;
}

export function BatchGeneralInfo({ batch }: BatchGeneralInfoProps) {
  const { data: lecturer } = useGetLecturerById(batch?.lecturer_id ?? null);
  const { data: branch } = useGetBranchById(batch?.branch_id ?? null);

  const lecturerName = lecturer
    ? `${lecturer.profile.first_name} ${lecturer.profile.last_name}`
    : "—";

  const branchName = branch?.name ?? "—";
  const assessment = batch?.has_assignment ? "Assignment" : "—";
  const staffIds = batch?.staff_ids ?? [];
  const certIds = batch?.certificate_ids ?? [];

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-6 self-stretch p-4 rounded-lg border border-slate-200 bg-slate-50 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        {/* Level */}
        <InfoItem label="Level">{batch?.level ?? "—"}</InfoItem>

        {/* Lecturer */}
        <InfoItem label="Lecturer">
          <div className="flex items-center gap-2">
            <Avatar
              src={lecturer?.profile.profile_image_url}
              name={lecturerName}
            />
            <span>{lecturerName}</span>
          </div>
        </InfoItem>

        {/* Language */}
        <InfoItem label="Language">{batch?.language ?? "—"}</InfoItem>

        {/* Certificates */}
        <InfoItem label="Certificates">
          <div className="flex items-center gap-2 flex-wrap">
            {certIds.length === 0 && <span className="text-slate-400">—</span>}
            {certIds.length > 0 && <CertChip certId={certIds[0]} />}
            {certIds.length > 1 && (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-1.5 text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-300 transition-colors">
                    +{certIds.length - 1}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-white" align="start">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-slate-500 mb-1">
                      All Certificates
                    </span>
                    {certIds.map((id) => (
                      <div
                        key={id}
                        className="text-sm text-slate-700 py-1 border-b border-slate-100 last:border-0"
                      >
                        <CertChip certId={id} />
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </InfoItem>

        {/* Branch */}
        <InfoItem label="Branch">{branchName}</InfoItem>

        {/* Batch Type */}
        <InfoItem label="Batch Type">{batch?.type ?? "—"}</InfoItem>

        {/* Category */}
        <InfoItem label="Category">{batch?.category ?? "—"}</InfoItem>

        {/* Lesson Duration */}
        <InfoItem label="Lesson Duration">
          {batch?.lesson_duration ?? "—"}
        </InfoItem>

        {/* Assessment */}
        <InfoItem label="Assessment">{assessment}</InfoItem>

        {/* Staff Members */}
        <InfoItem label="Staff Members">
          <div className="flex items-center gap-2 flex-wrap">
            {staffIds.length === 0 && <span className="text-slate-400">—</span>}
            {staffIds.length > 0 && <StaffChip staffId={staffIds[0]} />}
            {staffIds.length > 1 && (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-1.5 text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-300 transition-colors">
                    +{staffIds.length - 1}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-white" align="start">
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                      All Staff Members
                    </span>
                    {staffIds.map((id) => (
                      <StaffChip key={id} staffId={id} />
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
