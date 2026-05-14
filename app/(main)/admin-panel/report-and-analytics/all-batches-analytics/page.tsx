"use client";

import React, { useState } from "react";

import { format } from "date-fns";

import { AnalyticsTopBar } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsTopBar";
import { AnalyticsStatsRow } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsStatsRow";
import { AnalyticsStudentStats } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsStudentStats";
import { AnalyticsEnrollmentByDistrict } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsEnrollmentByDistrict";
import { AnalyticsBreakdown } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsBreakdown";

import {
  useGetBatchAnalyticsSummary,
  useGetBatchStudentSummary,
  useGetBatchEnrollmentByDistrict,
  useGetBatchWiseBreakdown,
} from "@/hooks/api/analytics/useGetBatchAnalytics";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

function fmt(n: number | undefined) {
  return n != null ? String(n) : "—";
}

export default function AllBatchesAnalyticsPage() {
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);

  const params = { date_from: dateFrom, date_to: dateTo };

  const { data: summary } = useGetBatchAnalyticsSummary(params);
  const { data: studentSummary } = useGetBatchStudentSummary(params);
  const { data: districtData } = useGetBatchEnrollmentByDistrict(params);
  const { data: breakdown } = useGetBatchWiseBreakdown(params);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setDateFrom(start ? format(start, "yyyy-MM-dd") : undefined);
    setDateTo(end ? format(end, "yyyy-MM-dd") : undefined);
  };

  const handleExport = () => {
    const p = new URLSearchParams({
      ...(dateFrom ? { date_from: dateFrom } : {}),
      ...(dateTo ? { date_to: dateTo } : {}),
    });

    window.open(`${API_ENDPOINTS.finances.BATCH_ANALYTICS_SUMMARY}?${p.toString()}`, "_blank");
  };

  const batchStats = [
    { key: "total-batches", title: "Total Batches", value: fmt(summary?.total_batches) },
    { key: "ongoing-batches", title: "Ongoing Batches", value: fmt(summary?.ongoing_batches) },
    { key: "completed-batches", title: "Completed Batches", value: fmt(summary?.completed_batches) },
    { key: "online-batches", title: "Online Batches", value: fmt(summary?.online_batches) },
    { key: "offline-batches", title: "Offline Batches", value: fmt(summary?.offline_batches) },
  ];

  const districtItems = (districtData ?? []).map((d) => ({
    district: d.branch_name,
    count: d.enrollment_count,
  }));

  const byLanguage = (breakdown?.by_language ?? []).map((l) => ({
    label: l.language.charAt(0) + l.language.slice(1).toLowerCase(),
    value: l.student_count,
  }));

  const byBatchType = (breakdown?.by_batch_type ?? []).map((t) => ({
    label: t.batch_type.charAt(0) + t.batch_type.slice(1).toLowerCase(),
    value: t.student_count,
  }));

  return (
    <div className="w-full space-y-6 p-4 pb-10 md:p-6">
      <AnalyticsTopBar onDateChange={handleDateChange} onExport={handleExport} />

      <AnalyticsStatsRow stats={batchStats} />

      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-[1fr,1px,1fr] md:gap-x-12">
        <div className="flex flex-col gap-4">
          <h2 className="border-b border-[#E2E8F0] pb-2 font-inter text-[20px] font-semibold leading-[32px] text-[#020618]">
            Student Statistics
          </h2>
          <AnalyticsStudentStats
            totalEnrollment={fmt(studentSummary?.total_enrollments)}
            active={fmt(studentSummary?.active)}
            nonResponsive={fmt(studentSummary?.non_responsive)}
            dropped={fmt(studentSummary?.dropped)}
            completed={fmt(studentSummary?.completed)}
            male={fmt(studentSummary?.male)}
            female={fmt(studentSummary?.female)}
          />
        </div>

        <div className="hidden bg-[#E2E8F0] md:block" />

        <div className="flex flex-col gap-4">
          <h2 className="border-b border-[#E2E8F0] pb-2 font-inter text-[20px] font-semibold leading-[32px] text-[#020618]">
            Enrollment by District
          </h2>
          <AnalyticsEnrollmentByDistrict data={districtItems} />
        </div>
      </div>

      <AnalyticsBreakdown
        title="Batch wise Breakdown"
        column1Title="By Language"
        column1Items={byLanguage}
        column2Title="Batch Type"
        column2Items={byBatchType}
      />
    </div>
  );
}
