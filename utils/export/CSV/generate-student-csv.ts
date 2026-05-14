import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { ApiStudentRow } from "@/types/user-management";
import type { GetStudentsResponse, GetStudentsParams } from "@/hooks/api/user-management/useGetStudents";
import { generateBaseCSV, DebouncedExportGenerator } from "@/utils/export/generate-base-csv";

// ─────────────────────────────────────────────────────────────────
// Filters (matches the URL params used by StudentTab)
// ─────────────────────────────────────────────────────────────────

export interface StudentCSVFilters {
  search?: string;
  district?: string;
  student_status?: string;
  payment_status?: string;
  certificate_status?: string;
  enrollment_date_from?: string;
  enrollment_date_to?: string;
}

// ─────────────────────────────────────────────────────────────────
// Data Fetching — fetches ALL pages
// ─────────────────────────────────────────────────────────────────

async function fetchAllStudents(filters: StudentCSVFilters): Promise<ApiStudentRow[]> {
  const PAGE_SIZE = 100;
  let allResults: ApiStudentRow[] = [];
  let currentPage = 1;
  let totalPages = 1;

  const apiParams: GetStudentsParams = {
    size: PAGE_SIZE,
    search: filters.search || undefined,
    district: filters.district || undefined,
    student_status: filters.student_status || undefined,
    payment_status: filters.payment_status || undefined,
    certificate_status: filters.certificate_status || undefined,
    enrollment_date_from: filters.enrollment_date_from || undefined,
    enrollment_date_to: filters.enrollment_date_to || undefined,
  };

  do {
    const response = await api.get<{ data: GetStudentsResponse }>(
      API_ENDPOINTS.adminStudents.GET_ALL,
      { params: { ...apiParams, page: currentPage } }
    );

    const pageData = response.data?.data;

    allResults = [...allResults, ...(pageData?.results ?? [])];
    totalPages = pageData?.totalPages ?? 1;
    currentPage++;
  } while (currentPage <= totalPages);

  return allResults;
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

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

export interface StudentExportRequest {
  filters: StudentCSVFilters;
  selectedIds?: string[];
}

async function runGenerateStudentCSV(request: StudentExportRequest): Promise<void> {
  const { filters, selectedIds } = request;
  const allStudents = await fetchAllStudents(filters);
  
  // If specific students are selected, filter the generic fetch result
  const filteredStudents = selectedIds && selectedIds.length > 0 
    ? allStudents.filter(s => selectedIds.includes(s.user_id))
    : allStudents;

  const rows = filteredStudents.map((item) => [
    item.created_at ? new Date(item.created_at).toLocaleDateString() : "-",
    item.full_name || "-",
    item.email || "-",
    item.mobile_number || "-",
    item.whatsapp_number || "-",
    item.district || "-",
    item.referral_code || "-",
    formatStatus(item.payment_status?.status),
    item.payment_status?.total_pending_amount || "0.00",
    item.certificate_status?.has_certificate ? "Completed" : "Pending",
    item.commissions?.total_earned || "0.00",
    formatStatus(item.status),
  ]);

  generateBaseCSV({
    fileNamePrefix: "Students_Report",
    headers: [
      "Reg. Date",
      "Name",
      "Email",
      "Phone",
      "WhatsApp",
      "District",
      "Referral Code",
      "Payment Status",
      "Pending Amount",
      "Certificate Status",
      "Commissions Earned",
      "Status",
    ],
    rows,
  });
}

// ─────────────────────────────────────────────────────────────────
// Debounced Export (public API)
// ─────────────────────────────────────────────────────────────────

const studentCSVGenerator = new DebouncedExportGenerator(runGenerateStudentCSV);

export function generateStudentCSV(filters: StudentCSVFilters, selectedIds?: string[]): Promise<void> {
  return studentCSVGenerator.request({ filters, selectedIds });
}
