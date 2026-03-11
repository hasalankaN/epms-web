export type DocumentType =
  | "Transcript"
  | "Envelop Letter"
  | "ID"
  | "Enrollment Letter"
  | "Application Form";

export type DocumentTemplateStatus = "Active" | "Inactive";

export type IssuedDocumentStatus = "Pending" | "In Progress" | "Downloaded" | "Delivered";

export interface DocumentTemplateRow {
  id: string;
  addedDate: string;
  documentName: string;
  documentType: DocumentType;
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
  documentType: DocumentType;
  status: IssuedDocumentStatus;
  /** ISO date string or dash "-" if pending */
  issuedDate: string;
  /** Verification number string or dash "-" if pending */
  verificationNo: string;
}
