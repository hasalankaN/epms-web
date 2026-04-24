"use client";

import React from "react";

import { AnalyticsTopBar } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsTopBar";
import { AnalyticsStatsRow } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsStatsRow";
import { AnalyticsStudentStats } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsStudentStats";
import { AnalyticsEnrollmentByDistrict } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsEnrollmentByDistrict";
import { AnalyticsBreakdown } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsBreakdown";

const BATCH_STATS = [
  { key: "total-batches", title: "Total Batches", value: "XX" },
  { key: "ongoing-batches", title: "Ongoing Batches", value: "XX" },
  { key: "completed-batches", title: "Completed Batches", value: "XX" },
  { key: "online-batches", title: "Online Batches", value: "XX" },
  { key: "offline-batches", title: "Offline Batches", value: "XX" },
];

const BY_LANGUAGE = [
  { label: "Sinhala", value: "XX" },
  { label: "English", value: "XX" },
  { label: "Tamil", value: "XX" },
];

const BATCH_TYPES = [
  { label: "Type 1", value: "XX" },
  { label: "Type 2", value: "XX" },
  { label: "Type 3", value: "XX" },
];

export default function AllBatchesAnalyticsPage() {
  return (
    <div className="w-full space-y-6 p-4 pb-10 md:p-6">
      <AnalyticsTopBar onExport={() => console.log("Exporting Batches...")} />
      
      <AnalyticsStatsRow stats={BATCH_STATS} />

      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-[1fr,1px,1fr] md:gap-x-12">
        <div className="flex flex-col gap-4">
          <h2 className="border-b border-[#E2E8F0] pb-2 font-inter text-[20px] font-semibold leading-[32px] text-[#020618]">
            Student Statistics
          </h2>
          <AnalyticsStudentStats />
        </div>

        <div className="hidden bg-[#E2E8F0] md:block" />

        <div className="flex flex-col gap-4">
          <h2 className="border-b border-[#E2E8F0] pb-2 font-inter text-[20px] font-semibold leading-[32px] text-[#020618]">
            Enrollment by District
          </h2>
          <AnalyticsEnrollmentByDistrict />
        </div>
      </div>

      <AnalyticsBreakdown
        title="Batch wise Breakdown"
        column1Title="By Language"
        column1Items={BY_LANGUAGE}
        column2Title="Batch Type"
        column2Items={BATCH_TYPES}
      />
    </div>
  );
}
