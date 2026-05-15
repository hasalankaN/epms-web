"use client";

import React from "react";

import { cn } from "@/lib/utils";

// Mock data
// strokeWidth is 2px for outline style
const STATS = [
  {
    label: "Completed Payments",
    value: "28",
    subLabel: "Eligible for certificates",
    iconClass: "circle-check",
    color: "#2563EB",
    bgClass: "bg-[rgba(217,233,255,0.50)]",
  },
  {
    label: "Issued Certificates",
    value: "18",
    subLabel: "Successfully issued",
    iconClass: "medal",
    color: "#16A34A",
    bgClass: "bg-[rgba(223,255,240,0.60)]",
  },
  {
    label: "Total Downloads",
    value: "81",
    subLabel: "Free certificates",
    iconClass: "download-simple",
    color: "#8225FB",
    bgClass: "bg-[rgba(232,223,243,0.50)]",
  },
  {
    label: "Pending Certificates",
    value: "28",
    subLabel: "Awaiting issuance",
    iconClass: "clock-countdown",
    color: "#F59E0B",
    bgClass: "bg-[rgba(255,247,215,0.70)]",
  },
];

export function CourseCertificateStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat) => (
        <div
          key={`cert-stat-${stat.label}`}
          className="flex flex-1 flex-col items-start rounded-lg border border-slate-200 bg-transparent p-4"
        >
          {/* Icon */}
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-[31px] mb-2",
              stat.bgClass,
            )}
          >
            <i
              className={cn(stat.iconClass, "h-5 w-5")}
              style={{ color: stat.color }}
            />
          </div>

          {/* Title */}
          <span className="font-inter text-sm font-normal leading-5 text-slate-700 mb-1">
            {stat.label}
          </span>

          {/* Value */}
          <span className="font-inter text-lg font-semibold leading-[30px] text-slate-950">
            {stat.value}
          </span>

          {/* Subtitle */}
          <span className="font-inter text-xs font-normal leading-4 text-slate-400">
            {stat.subLabel}
          </span>
        </div>
      ))}
    </div>
  );
}
