"use client";

import React, { useState } from "react";

import { CalendarDays, User } from "lucide-react";

import { SALARY_TYPE_CONFIG } from "@/types/user-management";

// ============================
// Types
// ============================
interface StaffGeneralDetailsProps {
  name?: string;
  staffId?: string;
  enrolledDate?: string;
  mobileNumber?: string;
  whatsAppNumber?: string;
  gender?: string;
  emailAddress?: string;
  salaryType?: string;
  profileImageUrl?: string | null;
}

// ============================
// Field helpers
// ============================
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[16px] font-semibold leading-[24px] text-[#0F172B] font-inter">
    {children}
  </p>
);

const FieldValue = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[14px] font-normal leading-[20px] text-[#90A1B9] font-inter">
    {children}
  </p>
);

// ============================
// Main Component
// ============================
export function StaffGeneralDetails({
  name = "Member Name",
  staffId = "Member ID",
  enrolledDate = "2025/01/01",
  mobileNumber = "+70 XXX XXXX",
  whatsAppNumber = "+70 XXX XXXX",
  gender = "-",
  emailAddress = "user@gmail.com",
  salaryType = "MONTHLY",
  profileImageUrl,
}: StaffGeneralDetailsProps) {
  const [imgError, setImgError] = useState(false);

  const showPlaceholder = !profileImageUrl || profileImageUrl.trim() === "" || imgError;

  return (
    <div
      className="flex w-full flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 rounded-[8px] border border-[#E2E8F0] bg-white p-6"
      style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}
    >
      {/* ========== Profile Isolated Section ========== */}
      <div className="flex items-center gap-6 shrink-0 md:border-r border-transparent md:pr-12">
        <div
          className="flex h-[108px] w-[108px] shrink-0 items-center justify-center overflow-hidden rounded-full font-inter"
          style={{
            background: showPlaceholder
              ? "linear-gradient(315deg, #FFCFEA 0.35%, #F8FAFC 99.65%)"
              : "#D9D9D9",
          }}
        >
          {!showPlaceholder ? (
            <img
              src={profileImageUrl || ""}
              alt={name}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <User className="h-12 w-12" style={{ color: "#1D293D" }} />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>{name}</FieldLabel>
          <FieldValue>{staffId}</FieldValue>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-2 py-[2px] w-fit text-[12px] font-medium leading-[16px] text-[#45556C]">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{enrolledDate}</span>
          </div>
        </div>
      </div>

      {/* ========== Details Grid Section ========== */}
      <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
        {/* Mobile Number */}
        <div className="flex flex-col gap-1">
          <FieldLabel>Mobile Number</FieldLabel>
          <FieldValue>{mobileNumber}</FieldValue>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1">
          <FieldLabel>Gender</FieldLabel>
          <FieldValue>{gender}</FieldValue>
        </div>

        {/* WhatsApp Number */}
        <div className="flex flex-col gap-1">
          <FieldLabel>WhatsApp Number</FieldLabel>
          <FieldValue>{whatsAppNumber}</FieldValue>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1">
          <FieldLabel>Email Address</FieldLabel>
          <FieldValue>{emailAddress}</FieldValue>
        </div>

        {/* Salary Type */}
        <div className="flex flex-col gap-1">
          <FieldLabel>Salary Type</FieldLabel>
          <FieldValue>
            {SALARY_TYPE_CONFIG[salaryType as keyof typeof SALARY_TYPE_CONFIG]?.label || salaryType}
          </FieldValue>
        </div>
      </div>
    </div>
  );
}
