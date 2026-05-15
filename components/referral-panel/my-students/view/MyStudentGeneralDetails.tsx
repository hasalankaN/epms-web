"use client";

import React from "react";

import { CalendarDays } from "lucide-react";

// ============================
// Types
// ============================
interface MyStudentGeneralDetailsProps {
  name?: string;
  studentId?: string;
  enrolledDate?: string;
  address?: string;
  mobileNumber?: string;
  whatsAppNumber?: string;
  gender?: string;
  emailAddress?: string;
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
export function MyStudentGeneralDetails({
  name = "Student Name",
  studentId = "Student ID",
  enrolledDate = "2025/01/01",
  address = "no: XX/1, Schol Lane, City, Post office, Postal code",
  mobileNumber = "+70 XXX XXXX",
  whatsAppNumber = "+70 XXX XXXX",
  gender = "XXXX",
  emailAddress = "user@gmail.com",
  profileImageUrl,
}: MyStudentGeneralDetailsProps) {
  return (
    <div
      className="flex w-full flex-col xl:flex-row gap-6 xl:gap-8 rounded-lg border border-[#E2E8F0] bg-white p-4"
      style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}
    >
      {/* ========== Profile Isolated Section ========== */}
      <div className="flex items-start gap-4 xl:w-[280px] shrink-0 pb-2 xl:pb-0 xl:pr-6">
        <div
          className="h-[108px] w-[108px] shrink-0 overflow-hidden rounded-full bg-[#D9D9D9]"
          style={{
            background:
              profileImageUrl && profileImageUrl.trim() !== ""
                ? `url(${profileImageUrl}) lightgray 50% / cover no-repeat`
                : "#D9D9D9",
          }}
        >
          {profileImageUrl && profileImageUrl.trim() !== "" && (
            <img
              src={profileImageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-1 sm:mt-2">
          <FieldLabel>{name}</FieldLabel>
          <FieldValue>{studentId}</FieldValue>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-2 py-[2px] text-[12px] font-medium leading-[16px] text-[#45556C]">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{enrolledDate}</span>
          </div>
        </div>
      </div>

      {/* ========== Details Grid Section ========== */}
      <div className="grid flex-1 grid-cols-2 xl:grid-cols-6 gap-y-6 flex-wrap gap-x-4 xl:gap-x-6">
        {/* Address: Col 1, Row 1 & 2 */}
        <div className="flex flex-col gap-1 col-span-2 xl:col-span-2 xl:row-span-2">
          <FieldLabel>Address</FieldLabel>
          <FieldValue>
            {address.split(",").map((line, i) => (
              <React.Fragment key={`mystudent-field-${i}`}>
                {line.trim()}
                {i < address.split(",").length - 1 && ","}
                <br />
              </React.Fragment>
            ))}
          </FieldValue>
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col gap-1 col-span-1 xl:col-span-2">
          <FieldLabel>Mobile Number</FieldLabel>
          <FieldValue>{mobileNumber}</FieldValue>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1 col-span-1 xl:col-span-2">
          <FieldLabel>Gender</FieldLabel>
          <FieldValue>{gender}</FieldValue>
        </div>

        {/* WhatsApp Number */}
        <div className="flex flex-col gap-1 col-span-1 xl:col-span-2">
          <FieldLabel>WhatsApp Number</FieldLabel>
          <FieldValue>{whatsAppNumber}</FieldValue>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1 col-span-1 xl:col-span-2">
          <FieldLabel>Email Address</FieldLabel>
          <FieldValue>{emailAddress}</FieldValue>
        </div>
      </div>
    </div>
  );
}
