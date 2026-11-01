import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, USE_MOCK } from "@/lib/mock/mockUtils";
import {
  mockJobPostings,
  mockJobApplications,
  mockInterviews,
} from "@/lib/mock/job.mock";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";
import type {
  JobPosting,
  JobApplication,
  InterviewSchedule,
  ApplicationStatus,
} from "@/types/dto/job.dto";

let postingsStore: JobPosting[] = [...mockJobPostings];
let applicationsStore: JobApplication[] = [...mockJobApplications];
let interviewsStore: InterviewSchedule[] = [...mockInterviews];

function mapBackendJob(row: any): JobPosting {
  const isOp = (row.status || "OPEN") === "OPEN";
  return {
    id: row.posting_id || row.id,
    title: row.title || "Open Position",
    department: row.department_name || row.department || "Garment Operations",
    position: row.position || row.title || "Position",
    postedDate: row.posted_date || row.postedDate || new Date().toISOString().split("T")[0],
    closingDate: row.closing_date || row.closingDate || row.deadline || new Date().toISOString().split("T")[0],
    isOpen: isOp,
    location: row.location || "Main Factory, Biyagama",
    employmentType: row.employment_type || row.employmentType || "Full-time",
    experienceLevel: row.experience_level || row.experienceLevel || "Mid Level",
    salaryRange: row.salary_range || row.salaryRange || "LKR 75,000 - 110,000",
    deadline: row.deadline || row.closingDate || new Date().toISOString().split("T")[0],
    description: row.description || "",
    requirements: row.requirements || [
      "Minimum 2 years experience in garment production",
      "Good team coordination and communication skills",
    ],
    status: (row.status || "OPEN") as any,
    applicantCount: Number(row.applicant_count || row.applicantCount || 0),
  };
}

function mapBackendApplication(row: any): JobApplication {
  return {
    id: row.application_id || row.id,
    jobId: row.posting_id || row.jobId,
    jobTitle: row.job_title || row.jobTitle || "Internal Position",
    department: row.department_name || row.department || "Operations",
    candidateName: row.candidate_name || row.candidateName || "Applicant",
    candidateEmail: row.candidate_email || row.candidateEmail || "",
    candidatePhone: row.candidate_phone || row.candidatePhone || "",
    appliedDate: row.applied_date || row.created_at || new Date().toISOString().split("T")[0],
    status: (row.status || "APPLIED") as ApplicationStatus,
  };
}

export const jobService = {
  /**
   * GET /me/job-postings
   */
  getJobPostings: async (): Promise<JobPosting[]> => {
    if (USE_MOCK) {
      return mockResponse(postingsStore);
    }
    const res = await api.get(API_ENDPOINTS.me.JOB_POSTINGS);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendJob);
  },

  /**
   * GET /me/applications
   */
  getMyApplications: async (): Promise<JobApplication[]> => {
    if (USE_MOCK) {
      return mockResponse(applicationsStore.filter((a) => a.candidateName === "Nuwan Perera"));
    }
    const res = await api.get(API_ENDPOINTS.me.APPLICATIONS);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendApplication);
  },

  /**
   * POST /me/job-postings/:id/apply
   */
  applyForJob: async (jobId: string): Promise<JobApplication> => {
    if (USE_MOCK) {
      const job = postingsStore.find((j) => j.id === jobId);
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        jobId,
        jobTitle: job ? job.title : "Internal Position",
        department: job ? job.department : "Technology",
        candidateName: "Nuwan Perera",
        candidateEmail: "nuwan.perera@epms.lk",
        candidatePhone: "+94 77 123 4567",
        appliedDate: new Date().toISOString().split("T")[0],
        status: "APPLIED",
      };
      if (job) job.applicantCount += 1;
      applicationsStore = [newApp, ...applicationsStore];
      return mockResponse(newApp);
    }

    const res = await api.post(`/me/job-postings/${jobId}/apply`);
    return mapBackendApplication(normalizeDetailResponse(res.data));
  },

  /**
   * DELETE /me/applications/:id
   */
  cancelApplication: async (applicationId: string): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK) {
      applicationsStore = applicationsStore.filter((a) => a.id !== applicationId);
      return mockResponse({ success: true, message: "Application withdrawn successfully" });
    }

    const res = await api.delete(API_ENDPOINTS.me.CANCEL_APPLICATION(applicationId));
    return normalizeMutationResponse(res.data, "Application cancelled");
  },

  /**
   * POST /hr/vacancies
   */
  createVacancy: async (payload: Partial<JobPosting>): Promise<JobPosting> => {
    if (USE_MOCK) {
      const newJob: JobPosting = {
        id: `job-${Date.now()}`,
        title: payload.title || "New Vacancy",
        department: payload.department || "Operations",
        position: payload.position || payload.title || "Position",
        postedDate: new Date().toISOString().split("T")[0],
        closingDate: payload.closingDate || payload.deadline || new Date().toISOString().split("T")[0],
        isOpen: true,
        location: payload.location || "Colombo",
        employmentType: payload.employmentType || "Full-time",
        experienceLevel: payload.experienceLevel || "Mid",
        salaryRange: payload.salaryRange || "Competitive",
        deadline: payload.deadline || new Date().toISOString().split("T")[0],
        description: payload.description || "",
        requirements: payload.requirements || [],
        status: "OPEN",
        applicantCount: 0,
      };
      postingsStore = [newJob, ...postingsStore];
      return mockResponse(newJob);
    }

    const res = await api.post(API_ENDPOINTS.hr.VACANCIES, {
      title: payload.title,
      department_name: payload.department,
      location: payload.location,
      employment_type: payload.employmentType,
      experience_level: payload.experienceLevel,
      salary_range: payload.salaryRange,
      deadline: payload.deadline,
      description: payload.description,
      requirements: payload.requirements,
    });
    return mapBackendJob(normalizeDetailResponse(res.data));
  },

  /**
   * PATCH /hr/vacancies/:id
   */
  updateVacancy: async (id: string, payload: Partial<JobPosting>): Promise<JobPosting> => {
    if (USE_MOCK) {
      const j = postingsStore.find((item) => item.id === id);
      if (j) Object.assign(j, payload);
      return mockResponse(j || postingsStore[0]);
    }

    const res = await api.patch(API_ENDPOINTS.hr.VACANCY_DETAIL(id), payload);
    return mapBackendJob(normalizeDetailResponse(res.data));
  },

  /**
   * DELETE /hr/vacancies/:id
   */
  deleteVacancy: async (id: string): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK) {
      postingsStore = postingsStore.filter((j) => j.id !== id);
      return mockResponse({ success: true, message: "Vacancy closed" });
    }

    const res = await api.delete(API_ENDPOINTS.hr.VACANCY_DETAIL(id));
    return normalizeMutationResponse(res.data, "Vacancy removed");
  },

  /**
   * GET /hr/vacancies/:id/applications
   */
  getVacancyApplications: async (id: string): Promise<JobApplication[]> => {
    if (USE_MOCK) {
      return mockResponse(applicationsStore.filter((a) => a.jobId === id));
    }

    const res = await api.get(API_ENDPOINTS.hr.VACANCY_APPLICATIONS(id));
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendApplication);
  },

  /**
   * POST /hr/interviews
   */
  scheduleInterview: async (payload: any): Promise<InterviewSchedule> => {
    if (USE_MOCK) {
      const interview: InterviewSchedule = {
        id: `int-${Date.now()}`,
        applicationId: payload.applicationId,
        candidateName: payload.candidateName || "Candidate",
        candidateEmail: payload.candidateEmail || "applicant@example.com",
        jobTitle: payload.jobTitle || payload.vacancyTitle || "Job",
        vacancyTitle: payload.vacancyTitle || payload.jobTitle || "Job",
        round: (payload.round || "Round 1") as any,
        date: payload.date || payload.dateTime?.split(" ")[0] || new Date().toISOString().split("T")[0],
        time: payload.time || payload.dateTime?.split(" ")[1] || "10:00 AM",
        dateTime: payload.dateTime || `${payload.date || ""} ${payload.time || ""}`.trim() || new Date().toISOString(),
        interviewer: payload.interviewer || payload.interviewerName || "Interviewer",
        interviewerName: payload.interviewerName || payload.interviewer || "Interviewer",
        meetingLink: payload.meetingLink,
        status: "SCHEDULED",
        notes: payload.notes,
      };
      interviewsStore = [interview, ...interviewsStore];
      return mockResponse(interview);
    }

    const res = await api.post(API_ENDPOINTS.hr.INTERVIEWS, {
      application_id: payload.applicationId,
      round: payload.round || "Round 1",
      date: payload.date || payload.dateTime?.split(" ")[0],
      time: payload.time || payload.dateTime?.split(" ")[1] || "10:00 AM",
      interviewer: payload.interviewer || payload.interviewerName,
      meeting_link: payload.meetingLink,
    });
    return normalizeDetailResponse(res.data);
  },

  /**
   * GET interviews list
   */
  getInterviews: async (): Promise<InterviewSchedule[]> => {
    if (USE_MOCK) {
      return mockResponse(interviewsStore);
    }
    return interviewsStore;
  },

  getHrVacancies: async (): Promise<JobPosting[]> => {
    return jobService.getJobPostings();
  },

  getHrCandidates: async (vacancyId?: string): Promise<JobApplication[]> => {
    if (USE_MOCK) {
      if (vacancyId) {
        return mockResponse(applicationsStore.filter((a) => a.jobId === vacancyId));
      }
      return mockResponse(applicationsStore);
    }
    const endpoint = vacancyId
      ? API_ENDPOINTS.hr.VACANCY_APPLICATIONS(vacancyId)
      : API_ENDPOINTS.me.APPLICATIONS;
    const res = await api.get(endpoint);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendApplication);
  },

  updateCandidateStatus: async (
    applicationId: string,
    status: ApplicationStatus
  ): Promise<any> => {
    if (USE_MOCK) {
      const app = applicationsStore.find((a) => a.id === applicationId);
      if (app) app.status = status;
      return mockResponse({ success: true });
    }
    const res = await api.patch(API_ENDPOINTS.hr.INTERVIEW_DETAIL(applicationId), { status });
    return res.data;
  },
};
