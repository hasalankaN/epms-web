import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { ApiLecturerRow } from "@/types/user-management";
import type { GetLecturersResponse, GetLecturersParams } from "@/hooks/api/lecturers/useGetLecturers";
import { generateBaseCSV, DebouncedExportGenerator } from "@/utils/export/generate-base-csv";

// ─────────────────────────────────────────────────────────────────
// Filters (matches the URL params used by LecturerTab)
// ─────────────────────────────────────────────────────────────────

export interface LecturerCSVFilters {
  search?: string;
  status?: string;
  salaryStatus?: string;
  from?: string;
  to?: string;
}

// ─────────────────────────────────────────────────────────────────
// Data Fetching — fetches ALL pages
// ─────────────────────────────────────────────────────────────────

async function fetchAllLecturers(filters: LecturerCSVFilters): Promise<ApiLecturerRow[]> {
  const PAGE_SIZE = 100;
  let allResults: ApiLecturerRow[] = [];
  let currentPage = 1;
  let totalPages = 1;

  const apiParams: GetLecturersParams = {
    size: PAGE_SIZE,
    search: filters.search || undefined,
    status: filters.status || undefined,
    salary_payment_status: filters.salaryStatus || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
  };

  do {
    const response = await api.get<{ data: GetLecturersResponse }>(
      API_ENDPOINTS.lecturers.GET_ALL,
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

function formatSalaryStatus(status: string | null | undefined): string {
  if (!status) return "-";

  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function formatMemberStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function formatSalaryType(type: string | null | undefined): string {
  if (!type) return "-";

  return type
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─────────────────────────────────────────────────────────────────
// Report Generator
// ─────────────────────────────────────────────────────────────────

async function runGenerateLecturerCSV(filters: LecturerCSVFilters): Promise<void> {
  const allLecturers = await fetchAllLecturers(filters);

  const rows = allLecturers.map((item) => [
    new Date(item.created_at).toLocaleDateString(),
    `${item.first_name} ${item.last_name}`,
    item.email,
    item.mobile_number || "-",
    item.whatsapp_number || "-",
    formatSalaryType(item.salary_type),
    formatSalaryStatus(item.salary_payment_status),
    formatMemberStatus(item.status),
    item.branch_name || "-",
    String(item.assigned_courses),
    String(item.assigned_batches),
  ]);

  generateBaseCSV({
    fileNamePrefix: "Lecturers_Report",
    headers: [
      "Reg. Date",
      "Name",
      "Email",
      "Phone",
      "WhatsApp",
      "Salary Type",
      "Salary Status",
      "Status",
      "Branch",
      "Assigned Courses",
      "Assigned Batches",
    ],
    rows,
  });
}

// ─────────────────────────────────────────────────────────────────
// Debounced Export (public API)
// ─────────────────────────────────────────────────────────────────

const lecturerCSVGenerator = new DebouncedExportGenerator(runGenerateLecturerCSV);

export function generateLecturerCSV(filters: LecturerCSVFilters): Promise<void> {
  return lecturerCSVGenerator.request(filters);
}
