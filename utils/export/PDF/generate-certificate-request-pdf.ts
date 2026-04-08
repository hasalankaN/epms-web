import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { CertificateRequestItem, GetCertificateRequestsParams, CertificateRequestsListResponse } from "@/types/certificate";
import { generateBasePDF, DebouncedPDFGenerator } from "@/utils/export/generate-base-pdf";

// ─────────────────────────────────────────────────────────────────
// Filters (matches the params used by the API and hook)
// ─────────────────────────────────────────────────────────────────

export type CertificateRequestPDFFilters = GetCertificateRequestsParams;

// ─────────────────────────────────────────────────────────────────
// Data Fetching — fetches ALL pages
// ─────────────────────────────────────────────────────────────────

async function fetchAllCertificateRequests(filters: CertificateRequestPDFFilters): Promise<CertificateRequestItem[]> {
  const PAGE_SIZE = 100;
  let allResults: CertificateRequestItem[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const searchParams = new URLSearchParams();

    searchParams.set("page", String(currentPage));
    searchParams.set("limit", String(PAGE_SIZE));

    if (filters.search) searchParams.set("search", filters.search);
    if (filters.batch_id) searchParams.set("batch_id", filters.batch_id);
    if (filters.course_id) searchParams.set("course_id", filters.course_id);
    if (filters.certificate_type) searchParams.set("certificate_type", filters.certificate_type);
    if (filters.status) searchParams.set("status", filters.status);
    if (filters.date_from) searchParams.set("date_from", filters.date_from);
    if (filters.date_to) searchParams.set("date_to", filters.date_to);

    const response = await api.get(
      `${API_ENDPOINTS.certificateRequests.GET_ALL}?${searchParams.toString()}`
    );

    const pageData = response.data.data as CertificateRequestsListResponse;
    
    allResults = [...allResults, ...(pageData.data ?? [])];
    totalPages = pageData.meta?.totalPages ?? 1;
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

  const statusMap: Record<string, string> = {
    PENDING: "Pending",
    IN_PROGRESS: "Printing in progress",
    ISSUED: "Issued",
    DELIVERED: "Delivered",
    DOWNLOADED: "Downloaded",
  };

  return statusMap[status] || status;
}

// ─────────────────────────────────────────────────────────────────
// Report Generator
// ─────────────────────────────────────────────────────────────────

async function runGenerateCertificateRequestPDF(filters: CertificateRequestPDFFilters): Promise<void> {
  const allRequests = await fetchAllCertificateRequests(filters);

  const rows = allRequests.map((item) => [
    item.student?.full_name || "-",
    item.template?.name || "-",
    item.course?.name || "-",
    item.batch?.name || "-",
    item.certificate_type || "-",
    formatStatus(item.status),
    formatDate(item.created_at),
    "-", // Verification No placeholder
  ]);

  const fileNamePrefix = "Certificate_Requests_Report";
  const title = "Certificate Requests Report";
  
  let subtitle = `Total Records: ${allRequests.length}`;

  if (filters.status) {
      subtitle += ` | Status: ${formatStatus(filters.status)}`;
  }

  generateBasePDF({
    fileNamePrefix,
    title,
    subtitle,
    headers: [
      "Student Name",
      "Certificate Name",
      "Course",
      "Batch",
      "Type",
      "Status",
      "Issued Date",
      "Verification No",
    ],
    rows,
    orientation: "landscape",
    columnStyles: {
        0: { cellWidth: 35 }, // Student Name
        1: { cellWidth: 40 }, // Certificate Name
        2: { cellWidth: 35 }, // Course
        3: { cellWidth: 30 }, // Batch
        4: { cellWidth: 15 }, // Type
        5: { cellWidth: 25 }, // Status
        6: { cellWidth: 25 }, // Issued Date
        7: { cellWidth: 25 }, // Verification No
    },
    fontSize: 8,
  });
}

// ─────────────────────────────────────────────────────────────────
// Debounced Export (public API)
// ─────────────────────────────────────────────────────────────────

const certRequestPDFGenerator = new DebouncedPDFGenerator(runGenerateCertificateRequestPDF);

export function generateCertificateRequestPDF(filters: CertificateRequestPDFFilters): Promise<void> {
  return certRequestPDFGenerator.request(filters);
}
