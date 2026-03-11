"use client";

import React from "react";

import { CalendarDays, User } from "lucide-react";

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
  paymentType?: string;
  commissionRate?: string;
  profileImageUrl?: string;
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
  name = "Memer Name", // Keeping typo from image for strictness, or fixing to "Member Name" later, but using exactly what it says: "Memer Name"
  staffId = "Member ID",
  enrolledDate = "2025/01/01",
  mobileNumber = "+70 XXX XXXX",
  whatsAppNumber = "+70 XXX XXXX",
  gender = "XXXX",
  emailAddress = "user@gmail.com",
  paymentType = "Monthly Salary",
  commissionRate = "Commission per enroll 20%",
  profileImageUrl,
}: StaffGeneralDetailsProps) {
  return (
    <div className="flex w-full flex-col xl:flex-row gap-6 xl:gap-8 rounded-[8px] border border-[#E2E8F0] bg-white p-4" style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}>
      
      {/* Profile Section */}
      <div className="flex items-center gap-4 xl:w-[280px] shrink-0">
        <div className="flex h-[108px] w-[108px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FCE7F3]">
          {profileImageUrl && profileImageUrl.trim() !== "" ? (
            <img
              src={profileImageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1E293B]">
                <User strokeWidth={2} className="text-[#1E293B] h-8 w-8" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>{name}</FieldLabel>
          <FieldValue>{staffId}</FieldValue>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-2 py-[2px] text-[12px] font-medium leading-[16px] text-[#45556C] w-fit">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{enrolledDate}</span>
          </div>
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 xl:gap-x-6 xl:items-start pt-2 xl:pt-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <FieldLabel>Mobile Number</FieldLabel>
            <FieldValue>{mobileNumber}</FieldValue>
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>WhatsApp Number</FieldLabel>
            <FieldValue>{whatsAppNumber}</FieldValue>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <FieldLabel>Gender</FieldLabel>
            <FieldValue>{gender}</FieldValue>
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Email Address</FieldLabel>
            <FieldValue>{emailAddress}</FieldValue>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <FieldLabel>Payment</FieldLabel>
            <FieldValue>{paymentType}</FieldValue>
            <FieldValue>{commissionRate}</FieldValue>
          </div>
        </div>
      </div>

    </div>
  );
}
