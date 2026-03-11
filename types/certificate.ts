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
