"use client";

import React, { useState } from "react";

import { format } from "date-fns";

import { AnalyticsTopBar } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsTopBar";
import { AnalyticsStatsRow } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsStatsRow";
import { AnalyticsStudentStats } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsStudentStats";
import { AnalyticsEnrollmentByDistrict } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsEnrollmentByDistrict";
import { AnalyticsBreakdown } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsBreakdown";

import {
  useGetCourseAnalyticsSummary,
  useGetCourseStudentSummary,
  useGetCourseEnrollmentByDistrict,
  useGetCourseWiseBreakdownAll,
} from "@/hooks/api/analytics/useGetCourseAnalyticsAll";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

function fmt(n: number | undefined) {
  return n != null ? String(n) : "—";
}

export default function AllCoursesAnalyticsPage() {
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);


  const params = { date_from: dateFrom, date_to: dateTo };


  const { data: summary } = useGetCourseAnalyticsSummary(params);
  const { data: studentSummary } = useGetCourseStudentSummary(params);
  const { data: districtData } = useGetCourseEnrollmentByDistrict(params);
  const { data: breakdown } = useGetCourseWiseBreakdownAll(params);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setDateFrom(start ? format(start, "yyyy-MM-dd") : undefined);
    setDateTo(end ? format(end, "yyyy-MM-dd") : undefined);
  };

  const handleExport = () => {
    const p = new URLSearchParams();

    if (dateFrom) {
      p.set("date_from", dateFrom);
    }

    if (dateTo) {
      p.set("date_to", dateTo);
    }

    window.open(`${API_ENDPOINTS.finances.COURSE_ANALYTICS_SUMMARY}?${p.toString()}`, "_blank");
  };

  const courseStats = [
    { key: "total-courses", title: "Total Courses", value: fmt(summary?.total_courses) },
    { key: "ongoing-courses", title: "Ongoing Courses", value: fmt(summary?.ongoing_courses) },
    { key: "deactivated-courses", title: "Deactivated Courses", value: fmt(summary?.deactivated_courses) },
  ];

  const districtItems = (districtData ?? []).map((d) => ({
    district: d.district_name,
    count: d.enrollment_count,
  }));

  const byLanguage = (breakdown?.by_language ?? []).map((l) => ({
    label: l.language.charAt(0) + l.language.slice(1).toLowerCase(),
    value: l.student_count,
  }));

  const byCategory = (breakdown?.by_category ?? []).map((c) => ({
    label: c.category_name,
    value: c.student_count,
  }));

  return (
    <div className="w-full space-y-6 p-4 pb-10 md:p-6">
      <AnalyticsTopBar onDateChange={handleDateChange} onExport={handleExport} />

      <AnalyticsStatsRow stats={courseStats} />

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
        title="Course wise Breakdown"
        column1Title="By Language"
        column1Items={byLanguage}
        column2Title="Category"
        column2Items={byCategory}
      />
    </div>
  );
}
