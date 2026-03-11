import type { CertificateTemplateRow, IssuedCertificateRow, IssuedStatus, CertificateType } from "@/types/certificate";

// ===== ALL TEMPLATE MOCK DATA =====
export const mockTemplatesData: CertificateTemplateRow[] = [
  { id: "t1", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 120, price: "XXXX.00", status: "Active" },
  { id: "t2", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 120, price: "XXXX.00", status: "Active" },
  { id: "t3", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 0, price: "XXXX.00", status: "Inactive" },
  { id: "t4", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 120, price: "XXXX.00", status: "Active" },
  { id: "t5", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 50, price: "XXXX.00", status: "Active" },
  { id: "t6", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 0, price: "XXXX.00", status: "Inactive" },
  { id: "t7", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 75, price: "XXXX.00", status: "Active" },
  { id: "t8", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 30, price: "XXXX.00", status: "Active" },
  { id: "t9", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 0, price: "XXXX.00", status: "Inactive" },
  { id: "t10", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 90, price: "XXXX.00", status: "Active" },
  { id: "t11", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 110, price: "XXXX.00", status: "Active" },
  { id: "t12", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 0, price: "XXXX.00", status: "Inactive" },
  { id: "t13", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 45, price: "XXXX.00", status: "Active" },
  { id: "t14", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 60, price: "XXXX.00", status: "Active" },
  { id: "t15", addedDate: "2026/01/21", certificateName: "Lorem Ipsum", template: "View", assignedCoursesBatches: "View", issuedNumber: 0, price: "XXXX.00", status: "Inactive" },
];

// ===== CERTIFICATE TO BE ISSUED MOCK DATA =====
const issuedStatuses: IssuedStatus[] = ["Pending", "Printing in progress", "Issued", "Downloaded", "Delivered"];
const certTypes: CertificateType[] = ["Free", "UK", "Local"];

export const mockIssuedData: IssuedCertificateRow[] = Array.from({ length: 15 }, (_, i) => {
  const status = issuedStatuses[i % issuedStatuses.length];
  const isPending = status === "Pending";

  return {
    id: `ic-${i + 1}`,
    studentName: "Student Name",
    certificateName: "Lorem Ipsum",
    coursesBatchesName: "Batch 1",
    certificateType: certTypes[i % certTypes.length],
    status,
    issuedDate: isPending ? "-" : "2026/01/21",
    verificationNo: isPending ? "-" : `#${123456 + i}`,
  };
});

export const TOTAL_ISSUED_COUNT = mockIssuedData.filter(
  (r) => r.status === "Issued" || r.status === "Downloaded" || r.status === "Delivered"
).length;
