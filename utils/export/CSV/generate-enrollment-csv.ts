import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { ApiEnrollmentRow, GetEnrollmentsParams, GetEnrollmentsResponse } from "@/types/enroll";
import { generateBaseCSV, DebouncedExportGenerator } from "@/utils/export/generate-base-csv";

// ─────────────────────────────────────────────────────────────────
// Filters
// ─────────────────────────────────────────────────────────────────

export interface EnrollmentCSVFilters {
  search?: string;
  district?: string;
  gender?: string;
  batch_or_course_id?: string;
  enrollment_type?: "DIRECT" | "REFERRAL";
  lifecycle_status?: string;
  date_from?: string;
  date_to?: string;
  enrollment_target?: "BATCH" | "COURSE";
}

// ─────────────────────────────────────────────────────────────────
// Data Fetching — fetches ALL pages
// ─────────────────────────────────────────────────────────────────

async function fetchAllEnrollments(filters: EnrollmentCSVFilters): Promise<ApiEnrollmentRow[]> {
  const PAGE_SIZE = 100;
  let allResults: ApiEnrollmentRow[] = [];
  let currentPage = 1;
  let totalPages = 1;

  const apiParams: GetEnrollmentsParams = {
    size: PAGE_SIZE,
    search: filters.search || undefined,
    district: filters.district || undefined,
    gender: filters.gender || undefined,
    batch_or_course_id: filters.batch_or_course_id || undefined,
    enrollment_type: filters.enrollment_type || undefined,
    lifecycle_status: filters.lifecycle_status || undefined,
    date_from: filters.date_from || undefined,
    date_to: filters.date_to || undefined,
    enrollment_target: filters.enrollment_target || undefined,
  };

  do {
    const response = await api.get<{ data: GetEnrollmentsResponse }>(
      API_ENDPOINTS.enrollments.GET_ALL,
      { params: { ...apiParams, page: currentPage } }
    );

    const pageData = response.data.data;

    allResults = [...allResults, ...(pageData?.results ?? [])];
    totalPages = pageData?.totalPages ?? 1;
    currentPage++;
  } while (currentPage <= totalPages);

  return allResults;
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";

  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatStatus(status: string | null | undefined): string {
  if (!status) return "-";

  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// ─────────────────────────────────────────────────────────────────
// Report Generator
// ─────────────────────────────────────────────────────────────────

async function runGenerateEnrollmentCSV(filters: EnrollmentCSVFilters): Promise<void> {
  const allEnrollments = await fetchAllEnrollments(filters);

  const rows = allEnrollments.map((item) => [
    formatDate(item.created_at),
    item.enroll_public_id || `ENR-${item.enrollment_id.slice(0, 8).toUpperCase()}`,
    item.enrollment_type === "DIRECT" ? "Direct" : "Referral",
    item.student_public_id || "-",
    item.student_name || "-",
    item.gender || "-",
    item.mobile_number || "-",
    item.whatsapp_number || "-",
    item.batch_name || item.course_name || "-",
    item.enrollment_target === "BATCH" ? "Batch" : "Course",
    formatStatus(item.lifecycle_status),
    item.payment_type || "-",
    item.payment_status || "-",
  ]);

  generateBaseCSV({
    fileNamePrefix: "Enrollments_Report",
    headers: [
      "Enrollment Date",
      "Enrollment ID",
      "Enrollment Type",
      "Student ID",
      "Student Name",
      "Gender",
      "Phone",
      "WhatsApp",
      "Batch or Course",
      "Target Type",
      "Status",
      "Payment Type",
      "Payment Status",
    ],
    rows,
  });
}

// ─────────────────────────────────────────────────────────────────
// Debounced Export (public API)
// ─────────────────────────────────────────────────────────────────

const enrollmentCSVGenerator = new DebouncedExportGenerator(runGenerateEnrollmentCSV);

export function generateEnrollmentCSV(filters: EnrollmentCSVFilters): Promise<void> {
  return enrollmentCSVGenerator.request(filters);
}
