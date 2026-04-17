import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { ApiEnquiryRow } from "@/types/inquiry";
import type { GetEnquiriesParams, GetEnquiriesResponse } from "@/hooks/api/enquiries/useGetEnquiries";
import { generateBaseCSV, DebouncedExportGenerator } from "@/utils/export/generate-base-csv";

// ─────────────────────────────────────────────────────────────────
// Filters (matches the URL params used by AllInquiries / PendingInquiries)
// ─────────────────────────────────────────────────────────────────

export interface InquiryCSVFilters {
  search?: string;
  status?: string;
  district?: string;
  branch_id?: string;
  assignee_user_id?: string;
  interest_id?: string;
  source?: string;
  date_from?: string;
  date_to?: string;
  follow_up_from?: string;
  follow_up_to?: string;
  tab?: "all" | "assignment_pending";
  priority_status?: "HOT" | "COLD";
}

// ─────────────────────────────────────────────────────────────────
// Data Fetching — fetches ALL pages
// ─────────────────────────────────────────────────────────────────

async function fetchAllEnquiries(filters: InquiryCSVFilters): Promise<ApiEnquiryRow[]> {
  const PAGE_SIZE = 100;
  let allResults: ApiEnquiryRow[] = [];
  let currentPage = 1;
  let totalPages = 1;

  const apiParams: GetEnquiriesParams = {
    size: PAGE_SIZE,
    tab: filters.tab || "all",
    search: filters.search || undefined,
    status: filters.status || undefined,
    district: filters.district || undefined,
    branch_id: filters.branch_id || undefined,
    assignee_user_id: filters.assignee_user_id || undefined,
    interest_id: filters.interest_id || undefined,
    source: filters.source || undefined,
    date_from: filters.date_from || undefined,
    date_to: filters.date_to || undefined,
    follow_up_from: filters.follow_up_from || undefined,
    follow_up_to: filters.follow_up_to || undefined,
    priority_status: filters.priority_status || undefined,
  };

  do {
    const response = await api.get<{ data: GetEnquiriesResponse }>(
      API_ENDPOINTS.enquiries.GET_ALL,
      { params: { ...apiParams, page: currentPage } }
    );

    const pageData = response.data?.data;

    allResults = [...allResults, ...(pageData?.data ?? [])];
    totalPages = pageData?.meta?.total_pages ?? 1;
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

function formatSource(source: string | null | undefined): string {
  if (!source) return "-";

  return source.charAt(0).toUpperCase() + source.slice(1).toLowerCase();
}

// ─────────────────────────────────────────────────────────────────
// Report Generator
// ─────────────────────────────────────────────────────────────────

async function runGenerateInquiryCSV(filters: InquiryCSVFilters): Promise<void> {
  const allEnquiries = await fetchAllEnquiries(filters);

  const rows = allEnquiries.map((item) => [
    formatDate(item.created_at),
    item.enquiry_code || "-",
    item.name || "-",
    item.phone || "-",
    item.whatsapp_number || "-",
    item.district || "-",
    item.branch_name || "-",
    item.batch_name || item.course_name || "-",
    item.assignee_name || "-",
    formatSource(item.source),
    formatStatus(item.status),
    item.is_overdue ? "Yes" : "No",
    formatDate(item.next_follow_up_at),
  ]);

  const fileNamePrefix = filters.status === "PENDING"
    ? "Pending_Inquiries_Report"
    : "All_Inquiries_Report";

  generateBaseCSV({
    fileNamePrefix,
    headers: [
      "Reg. Date",
      "Enquiry ID",
      "Name",
      "Phone",
      "WhatsApp",
      "District",
      "Branch",
      "Interest",
      "Assigned Staff",
      "Source",
      "Status",
      "Overdue",
      "Next Follow-Up",
    ],
    rows,
  });
}

// ─────────────────────────────────────────────────────────────────
// Debounced Export (public API)
// ─────────────────────────────────────────────────────────────────

const inquiryCSVGenerator = new DebouncedExportGenerator(runGenerateInquiryCSV);

export function generateInquiryCSV(filters: InquiryCSVFilters): Promise<void> {
  return inquiryCSVGenerator.request(filters);
}
