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
  pricing_type: "FREE" | "PAID";
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

// ─── Certificate Request Types ────────────────────────────────────────────────

export type CertificateRequestStatus = "PENDING" | "IN_PROGRESS" | "DELIVERED" | "DOWNLOADED";
export type CertificateRequestType = "FREE" | "PAID";

export interface CertificateRequestItem {
  id: string;
  certificate_type: CertificateRequestType;
  payment_required: boolean;
  status: CertificateRequestStatus;
  effective_status: CertificateRequestStatus | "ISSUED";
  verification_no: string | null;
  issued_at: string | null;
  student: {
    id: string;
    full_name: string;
    email: string;
  };
  lecturer?: {
    id: string;
    full_name: string;
  };
  template: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
  };
  batch?: {
    id: string;
    name: string;
  };
  created_at: string;
}

export interface GetCertificateRequestsParams {
  search?: string;
  batch_id?: string;
  course_id?: string;
  certificate_type?: CertificateRequestType;
  status?: CertificateRequestStatus;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface CertificateRequestsListResponse {
  data: CertificateRequestItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
