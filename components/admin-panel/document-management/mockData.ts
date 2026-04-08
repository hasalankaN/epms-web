import type { DocumentTemplateRow, IssuedDocumentRow, IssuedDocumentStatus } from "@/types/document";

// ===== ALL TEMPLATE MOCK DATA =====
const docTypes: string[] = ["Transcript", "Envelope Letter", "ID", "Enrollment Letter", "Application Form"];

export const mockDocumentTemplatesData: DocumentTemplateRow[] = Array.from({ length: 15 }, (_, i) => ({
  id: `dt-${i + 1}`,
  addedDate: "2026/01/21",
  documentName: "Lorem Ipsum",
  documentType: docTypes[i % docTypes.length],
  template: "View",
  assignedCoursesBatches: "View",
  issuedNumber: i % 3 === 2 ? 0 : 60 + i * 5,
  status: i % 3 === 2 ? "Inactive" : "Active",
}));

// ===== ISSUED DOCUMENTS MOCK DATA =====
const issuedStatuses: IssuedDocumentStatus[] = ["Pending", "In Progress", "Downloaded", "Delivered"];

export const mockIssuedDocumentsData: IssuedDocumentRow[] = Array.from({ length: 15 }, (_, i) => {
  const status = issuedStatuses[i % issuedStatuses.length];
  const isPending = status === "Pending";

  return {
    id: `id-${i + 1}`,
    studentName: "Student Name",
    documentName: "Lorem Ipsum",
    coursesBatchesName: "Batch 1",
    documentType: docTypes[i % docTypes.length],
    status,
    issuedDate: isPending ? "-" : "2026/01/21",
    verificationNo: isPending ? "-" : `#${234567 + i}`,
  };
});

export const TOTAL_ISSUED_DOCUMENTS_COUNT = mockIssuedDocumentsData.filter(
  (r) => r.status === "Downloaded" || r.status === "Delivered"
).length;
