// ===== API-ALIGNED DOCUMENT TYPES =====

/** Document type enum matching backend API */
export type ApiDocumentType =
  | "ID"
  | "TRANSCRIPT"
  | "ENVELOPE_LETTER"
  | "ENROLLMENT_LETTER"
  | "APPLICATION_FORM"
  | "OTHER";

/** Display-friendly labels for document types */
export const DOCUMENT_TYPE_LABELS: Record<ApiDocumentType, string> = {
  ID: "ID",
  TRANSCRIPT: "Transcript",
  ENVELOPE_LETTER: "Envelope Letter",
  ENROLLMENT_LETTER: "Enrollment Letter",
  APPLICATION_FORM: "Application Form",
  OTHER: "Other",
};

/** Field types that can be placed on a document template */
export type DocumentFieldType =
  | "STUDENT_NAME"
  | "COURSE_NAME"
  | "ISSUE_DATE"
  | "SIGNATURE"
  | "DOC_ID"
  | "CUSTOM";

/** Display-friendly labels for field types */
export const DOCUMENT_FIELD_LABELS: Record<DocumentFieldType, string> = {
  STUDENT_NAME: "Student Name",
  COURSE_NAME: "Course Name",
  ISSUE_DATE: "Issue Date",
  SIGNATURE: "Signature",
  DOC_ID: "Document ID",
  CUSTOM: "Custom",
};

export type DocumentTemplateStatus = "Active" | "Inactive";

export type IssuedDocumentStatus =
  | "Pending"
  | "In Progress"
  | "Downloaded"
  | "Delivered";

// ===== CREATE PAYLOAD TYPES =====

export interface TemplateFieldPositionDto {
  field_type: DocumentFieldType;
  label?: string;
  x_position: number;
  y_position: number;
  font_size?: number;
}

export interface TemplateAssignmentDto {
  course_id?: string;
  batch_id?: string;
}

export interface CreateDocumentTemplatePayload {
  name: string;
  document_type: ApiDocumentType;
  template_image_url?: string;
  price?: number;
  fields?: TemplateFieldPositionDto[];
  assignments?: TemplateAssignmentDto[];
}

export interface UpdateDocumentTemplatePayload {
  name?: string;
  document_type?: ApiDocumentType;
  template_image_url?: string;
  price?: number;
  fields?: TemplateFieldPositionDto[];
  assignments?: TemplateAssignmentDto[];
}

// ===== TABLE ROW TYPES (for existing tables) =====

export interface DocumentTemplateRow {
  id: string;
  addedDate: string;
  documentName: string;
  documentType: string;

  /** Display string for the template view link */
  template: string;

  /** Display string for the assigned courses/batches link */
  assignedCoursesBatches: string;
  issuedNumber: number;
  status: DocumentTemplateStatus;
}

export interface IssuedDocumentRow {
  id: string;
  studentName: string;
  documentName: string;
  coursesBatchesName: string;
  documentType: string;
  status: IssuedDocumentStatus;

  /** ISO date string or dash "-" if pending */
  issuedDate: string;

  /** Verification number string or dash "-" if pending */
  verificationNo: string;
}

// ===== API RESPONSE TYPES =====

/** Single item returned in GET /documents/templates list */
export interface DocumentTemplateListItem {
  id: string;
  name: string;
  document_type: ApiDocumentType;
  is_active: boolean;
  created_at: string;
  issued_count: string;
}

export interface GetDocumentTemplatesParams {
  search?: string;
  document_type?: ApiDocumentType;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface GetDocumentTemplatesResponse {
  data: DocumentTemplateListItem[];
  total: number;
  page: number;
  limit: number;
}

// ===== DOCUMENT TEMPLATE DETAIL =====

export interface DocumentTemplateField {
  id: string;
  version_id: string;
  field_type: DocumentFieldType;
  label: string;
  x_position: string;
  y_position: string;
  font_size: number;
  created_at: string;
}

export interface DocumentTemplateVersion {
  id: string;
  template_id: string;
  version_number: number;
  template_image_url: string;
  price: string;
  is_current: boolean;
  created_by_user_id: string;
  created_at: string;
  fields: DocumentTemplateField[];
}

export interface DocumentTemplateAssignment {
  id: string;
  template_id: string;
  course_id: string | null;
  batch_id: string | null;
}

export interface DocumentTemplateDetail {
  id: string;
  name: string;
  document_type: ApiDocumentType;
  is_active: boolean;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  current_version: DocumentTemplateVersion | null;
  assignments: DocumentTemplateAssignment[];
}

// ===== ISSUED DOCUMENTS API TYPES =====

export type IssuedDocumentApiStatus =
  | "Pending"
  | "In Progress"
  | "Downloaded"
  | "Delivered";

/** Single item returned in GET /admin/documents/issued list */
export interface IssuedDocumentApiItem {
  id: string;
  document_code: string;
  template_id: string;
  template_name: string | null;
  document_type_snapshot: string;
  student_user_id: string;
  student_name: string | null;
  course_id: string | null;
  batch_id: string | null;
  source_name: string | null;
  issued_method: string;
  file_snapshot_url: string | null;
  issued_at: string | null;
  deleted_at: string | null;
  deletion_reason: string | null;
  superseded_at: string | null;
  reissued_from_document_id: string | null;
  verification_token: string;
  status: IssuedDocumentApiStatus;
}

export interface GetIssuedDocumentsParams {
  search?: string;
  document_type?: ApiDocumentType;
  course_id?: string;
  batch_id?: string;
  issued_from?: string;
  issued_to?: string;
  include_deleted?: boolean;
  page?: number;
  limit?: number;
}

export interface GetIssuedDocumentsResponse {
  data: IssuedDocumentApiItem[];
  total: number;
  page: number;
  limit: number;
}

