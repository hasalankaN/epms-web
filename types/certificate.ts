export type TemplateStatus = "Active" | "Inactive";

export type IssuedStatus =
  | "Pending"
  | "Printing in progress"
  | "Issued"
  | "Downloaded"
  | "Delivered";

export type CertificateType = "Free" | "UK" | "Local";

export interface CertificateTemplateRow {
  id: string;
  addedDate: string;
  certificateName: string;

  /** Display string for the template link */
  template: string;

  /** Display string for the assigned courses/batches link */
  assignedCoursesBatches: string;
  issuedNumber: number;
  price: string;
  status: TemplateStatus;
}

export interface IssuedCertificateRow {
  id: string;
  studentName: string;
  certificateName: string;
  coursesBatchesName: string;
  certificateType: CertificateType;
  status: IssuedStatus;

  /** ISO date string or dash "-" if pending */
  issuedDate: string;

  /** Verification number string or dash "-" if pending */
  verificationNo: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export type CertificateTemplateStatus = "ACTIVE" | "INACTIVE";

export interface CertificateTemplateItem {
  id: string;
  name: string;
  price: string;
  template_file_url: string;
  file_type: string;
  tag_layout: Record<string, unknown>;
  signature_layout: Record<string, unknown> | null;
  signature_image_url: string | null;
  status: CertificateTemplateStatus;
  version: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface GetCertificateTemplatesParams {
  page?: number;
  limit?: number;
  status?: CertificateTemplateStatus;
  name?: string;
  courseId?: string;
  batchId?: string;
}

export interface GetCertificateTemplatesResponse {
  results: CertificateTemplateItem[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}
