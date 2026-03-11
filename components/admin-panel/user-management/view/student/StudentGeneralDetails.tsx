"use client";

import React, { useEffect } from "react";

import { CalendarDays } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";

// ============================
// Types
// ============================
interface StudentGeneralDetailsProps {
  name?: string;
  studentId?: string;
  enrolledDate?: string;
  address?: string;
  mobileNumber?: string;
  whatsAppNumber?: string;
  gender?: string;
  emailAddress?: string;
  progressPercent?: number;
  paymentPending?: string;
  paymentPaid?: string;
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
export function StudentGeneralDetails({
  name = "Student Name",
  studentId = "Student ID",
  enrolledDate = "2025/01/01",
  address = "no: XX/1, Schol Lane, City, Post office, Postal code",
  mobileNumber = "+70 XXX XXXX",
  whatsAppNumber = "+70 XXX XXXX",
  gender = "XXXX",
  emailAddress = "user@gmail.com",
  progressPercent = 70,
  paymentPending = "5,000.00",
  paymentPaid = "5,000.00",
  profileImageUrl,
}: StudentGeneralDetailsProps) {
  const pendingVal = parseFloat(paymentPending.replace(/,/g, ""));
  const paidVal = parseFloat(paymentPaid.replace(/,/g, ""));

  const chartData = [
    { name: "Paid", value: paidVal, color: "#16A34A" },
    { name: "Pending", value: pendingVal, color: "#EF4444" },
  ];

  useEffect(() => {
    if (!document.getElementById("form-stepper-animations")) {
      const styleSheet = document.createElement("style");

      styleSheet.id = "form-stepper-animations";
      styleSheet.textContent = `
        @keyframes expand-width {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

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
        
        {/* ROW 1 & 2 */}
        
        {/* Address: Col 1, Row 1 & 2 */}
        <div className="flex flex-col gap-1 col-span-2 xl:col-span-2 xl:row-span-2">
          <FieldLabel>Address</FieldLabel>
          <FieldValue>
            {address.split(",").map((line, i) => (
              <React.Fragment key={i}>
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

        {/* ROW 3 & 4 */}
        
        {/* Student Progress */}
        <div className="flex flex-col gap-2 col-span-2 xl:col-span-3 xl:row-span-2 mt-2 xl:mt-8">
          <FieldLabel>Student Progress</FieldLabel>
          <div className="flex items-center gap-3 xl:w-[90%]">
            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[#E2E8F0]">
              <div
                className="absolute left-0 top-0 h-full rounded-full origin-left"
                style={{
                  width: `${progressPercent}%`,
                  background: "linear-gradient(90deg, #F9A8D4 0%, #E60076 100%)",
                  animation: "expand-width 0.7s ease-out forwards",
                }}
              />
            </div>
            <span className="shrink-0 font-inter text-[14px] font-medium text-[#0F172B]">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="flex flex-col gap-3 col-span-2 xl:col-span-3 xl:row-span-2 mt-2 xl:mt-8">
          <FieldLabel>Payment Details</FieldLabel>
          <div className="flex items-center gap-6">
            <div className="relative h-[96px] w-[96px] shrink-0">
              <PieChart width={96} height={96}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={34}
                  outerRadius={48}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-sm bg-[#FEE2E2] px-2 py-[2px] font-inter text-[13px] font-medium text-[#EF4444]">
                  Pending
                </span>
                <span className="rounded-sm bg-[#FEE2E2] px-2 py-[2px] font-inter text-[13px] font-semibold text-[#EF4444]">
                  LKR {paymentPending}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-sm bg-[#DCFCE7] px-2 py-[2px] font-inter text-[13px] font-medium text-[#16A34A]">
                  Paid
                </span>
                <span className="rounded-sm bg-[#DCFCE7] px-2 py-[2px] font-inter text-[13px] font-semibold text-[#16A34A]">
                  LKR {paymentPaid}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
