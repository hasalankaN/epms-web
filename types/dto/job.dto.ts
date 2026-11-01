export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED"
  | "CANCELLED";

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  position: string;
  postedDate: string;
  closingDate: string;
  description: string;
  requirements: string[];
  applicantCount: number;
  isOpen: boolean;
  status: "OPEN" | "CLOSED";
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  appliedDate: string;
  status: ApplicationStatus;
  interviewDate?: string;
  interviewTime?: string;
  notes?: string;
}

export interface InterviewSchedule {
  id: string;
  applicationId: string;
  candidateName: string;
  vacancyTitle: string;
  dateTime: string;
  interviewerName: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  notes?: string;
}

