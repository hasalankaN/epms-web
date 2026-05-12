"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import { generateEnrollmentCSV } from "@/utils/export/CSV/generate-enrollment-csv";

import { EnrollStatsRow } from "@/components/admin-panel/enroll-management/EnrollStatsRow";
import { EnrollTableToolbar } from "@/components/admin-panel/enroll-management/EnrollTableToolbar";
import { EnrollTable } from "@/components/admin-panel/enroll-management/EnrollTable";
import { useGetEnrollments } from "@/hooks/api/enrollments/useGetEnrollments";
import type { EnrollDataType, EnrollStatus } from "@/types/enroll";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";

  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function EnrollManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || undefined;
  const district = searchParams.get("district") || undefined;
  const gender = searchParams.get("gender") || undefined;
  const batch_or_course_id = searchParams.get("batch_or_course_id") || undefined;
  const enrollment_type = (searchParams.get("enrollment_type") as "DIRECT" | "REFERRAL") || undefined;
  const lifecycle_status = searchParams.get("lifecycle_status") || undefined;
  const date_from = searchParams.get("date_from") || undefined;
  const date_to = searchParams.get("date_to") || undefined;
  const enrollment_target = (searchParams.get("enrollment_target") as "BATCH" | "COURSE") || undefined;
  const orderBy = searchParams.get("orderBy") || undefined;
  const order = (searchParams.get("order") as "asc" | "desc") || undefined;

  // ===== API CALL =====
  const { data: responseData, isLoading, isError } = useGetEnrollments({
    page: currentPage,
    size: 10,
    search,
    district,
    gender,
    batch_or_course_id,
    enrollment_type,
    lifecycle_status,
    date_from,
    date_to,
    enrollment_target,
    orderBy,
    order,
  });

  // Map API data to UI format
  const data: EnrollDataType[] = useMemo(() => {
    const rawData = responseData?.results || [];

    return rawData.map((apiRow) => {
      // Basic normalization of status to match UI keys (EnrollStatus)
      let normalizedStatus: EnrollStatus = "Pending";
      const apiStatus = apiRow.lifecycle_status?.toUpperCase() || "";

      if (apiStatus === "ONGOING" || apiStatus === "ON GOING") normalizedStatus = "On Going";
      else if (apiStatus === "COMPLETED") normalizedStatus = "Completed";
      else if (apiStatus === "HOLD") normalizedStatus = "Hold";
      else if (apiStatus === "DROPPED") normalizedStatus = "Dropped";
      else if (apiStatus === "PENDING") normalizedStatus = "Pending";

      return {
        id: apiRow.enrollment_id,
        date: formatDate(apiRow.created_at),
        enrollId: apiRow.enroll_public_id || `ENR-${apiRow.enrollment_id.slice(0, 8).toUpperCase()}`,
        type: apiRow.enrollment_type === "DIRECT" ? "Direct" : "Referral",
        studentId: apiRow.student_public_id,
        studentUserId: apiRow.student_user_id,
        studentName: apiRow.student_name,
        phone: apiRow.mobile_number,
        whatsapp: apiRow.whatsapp_number,
        scope: apiRow.batch_name || apiRow.course_name || "-",
        targetType: apiRow.enrollment_target,
        status: normalizedStatus,
      };
    });
  }, [responseData]);

  const totalCount = responseData?.totalResults || 0;

  // ===== SHARED STATE =====
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [isExportingCSV, setIsExportingCSV] = useState(false);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleExportCSV = useCallback(async () => {
    setIsExportingCSV(true);

    try {
      await generateEnrollmentCSV({
        search,
        district,
        gender,
        batch_or_course_id,
        enrollment_type,
        lifecycle_status,
        date_from,
        date_to,
        enrollment_target,
      });
      toast.success("CSV exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export CSV. Please try again.");
    } finally {
      setIsExportingCSV(false);
    }
  }, [
    search,
    district,
    gender,
    batch_or_course_id,
    enrollment_type,
    lifecycle_status,
    date_from,
    date_to,
    enrollment_target,
  ]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Top Stats Row */}
      <EnrollStatsRow />

      {/* Toolbar (Search & Filters) */}
      <div className="mt-6">
        <EnrollTableToolbar 
          totalCount={totalCount} 
          onExportCSV={handleExportCSV}
          isExportingCSV={isExportingCSV}
        />
      </div>

      {/* Main Data Table */}
      <div className="mt-4">
        <EnrollTable
          data={data}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          isError={isError}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
