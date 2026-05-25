import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import {
  DOCUMENT_TYPE_LABELS,
  type ApiDocumentType,
  type GetIssuedDocumentsParams,
  type GetIssuedDocumentsResponse,
  type IssuedDocumentApiItem,
} from "@/types/document";
import { generateBasePDF, DebouncedPDFGenerator } from "@/utils/export/generate-base-pdf";

// ─────────────────────────────────────────────────────────────────
// Filters (matches the params used by the API and hook)
// ─────────────────────────────────────────────────────────────────

export type IssuedDocumentPDFFilters = GetIssuedDocumentsParams;

// ─────────────────────────────────────────────────────────────────
// Data Fetching — fetches ALL pages
// ─────────────────────────────────────────────────────────────────

async function fetchAllIssuedDocuments(filters: IssuedDocumentPDFFilters): Promise<IssuedDocumentApiItem[]> {
  const PAGE_SIZE = 100;
  let allResults: IssuedDocumentApiItem[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const searchParams = new URLSearchParams();

    searchParams.set("page", String(currentPage));
    searchParams.set("limit", String(PAGE_SIZE));

    if (filters.search) searchParams.set("search", filters.search);
    if (filters.document_type) searchParams.set("document_type", filters.document_type);
    if (filters.course_id) searchParams.set("course_id", filters.course_id);
    if (filters.batch_id) searchParams.set("batch_id", filters.batch_id);
    if (filters.issued_from) searchParams.set("issued_from", filters.issued_from);
    if (filters.issued_to) searchParams.set("issued_to", filters.issued_to);
    if (filters.include_deleted !== undefined)
      searchParams.set("include_deleted", String(filters.include_deleted));

    const response = await api.get<{ data: GetIssuedDocumentsResponse }>(
      `${API_ENDPOINTS.issuedDocuments.GET_ALL}?${searchParams.toString()}`
    );

    const pageData = response.data?.data;
    
    allResults = [...allResults, ...(pageData?.data ?? [])];
    const total = pageData?.total ?? 0;
    
    totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
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

// ─────────────────────────────────────────────────────────────────
// Report Generator
// ─────────────────────────────────────────────────────────────────

async function runGenerateIssuedDocumentPDF(filters: IssuedDocumentPDFFilters): Promise<void> {
  const allDocuments = await fetchAllIssuedDocuments(filters);

  const rows = allDocuments.map((item) => [
    item.student_name || "-",
    item.template_name || "-",
    item.source_name || "-",
    DOCUMENT_TYPE_LABELS[item.document_type_snapshot as ApiDocumentType] || item.document_type_snapshot || "-",
    item.status || "-",
    formatDate(item.issued_at),
    item.document_code || "-",
  ]);

  const fileNamePrefix = "Issued_Documents_Report";
  const title = "Issued Documents Report";
  
  let subtitle = `Total Records: ${allDocuments.length}`;

  if (filters.document_type) {
    subtitle += ` | Type: ${DOCUMENT_TYPE_LABELS[filters.document_type as ApiDocumentType] || filters.document_type}`;
  }

  generateBasePDF({
    fileNamePrefix,
    title,
    subtitle,
    headers: [
      "Student Name",
      "Document Name",
      "Courses/Batches Name",
      "Document Type",
      "Status",
      "Issued Date",
      "Verification No",
    ],
    rows,
    orientation: "landscape",
    columnStyles: {
      0: { cellWidth: 40 }, // Student Name
      1: { cellWidth: 40 }, // Document Name
      2: { cellWidth: 45 }, // Courses/Batches Name
      3: { cellWidth: 35 }, // Document Type
      4: { cellWidth: 25 }, // Status
      5: { cellWidth: 25 }, // Issued Date
      6: { cellWidth: 35 }, // Verification No
    },
    fontSize: 8,
  });
}

// ─────────────────────────────────────────────────────────────────
// Debounced Export (public API)
// ─────────────────────────────────────────────────────────────────

const issuedDocumentPDFGenerator = new DebouncedPDFGenerator(runGenerateIssuedDocumentPDF);

export function generateIssuedDocumentPDF(filters: IssuedDocumentPDFFilters): Promise<void> {
  return issuedDocumentPDFGenerator.request(filters);
}
