import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, USE_MOCK } from "@/lib/mock/mockUtils";
import {
  mockJobPostings,
  mockJobApplications,
  mockInterviews,
} from "@/lib/mock/job.mock";
import type {
  JobPosting,
  JobApplication,
  InterviewSchedule,
  ApplicationStatus,
} from "@/types/dto/job.dto";

let postingsStore: JobPosting[] = [...mockJobPostings];
let applicationsStore: JobApplication[] = [...mockJobApplications];
let interviewsStore: InterviewSchedule[] = [...mockInterviews];

export const jobService = {
  /**
   * GET /api/v1/me/job-postings
   */
  getJobPostings: async (): Promise<JobPosting[]> => {
    if (USE_MOCK) {
      return mockResponse(postingsStore);
    }
    const res = await api.get(API_ENDPOINTS.me.JOB_POSTINGS);
    return res.data;
  },

  /**
   * GET /api/v1/me/applications
   */
  getMyApplications: async (): Promise<JobApplication[]> => {
    if (USE_MOCK) {
      return mockResponse(applicationsStore.filter((a) => a.candidateName === "Nuwan Perera"));
    }
    const res = await api.get(API_ENDPOINTS.me.APPLICATIONS);
    return res.data;
  },

  /**
   * POST /api/v1/me/job-postings/apply
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
    const res = await api.post(API_ENDPOINTS.me.APPLY_JOB, { jobId });
    return res.data;
  },

  /**
   * DELETE /api/v1/me/applications/:id
   */
  cancelApplication: async (id: string): Promise<{ success: boolean }> => {
    if (USE_MOCK) {
      const app = applicationsStore.find((a) => a.id === id);
      if (app) app.status = "CANCELLED";
      return mockResponse({ success: true });
    }
    const res = await api.delete(API_ENDPOINTS.me.CANCEL_APPLICATION(id));
    return res.data;
  },

  /**
   * GET /api/v1/hr/vacancies
   */
  getHrVacancies: async (): Promise<JobPosting[]> => {
    if (USE_MOCK) {
      return mockResponse(postingsStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.VACANCIES);
    return res.data;
  },

  /**
   * POST /api/v1/hr/vacancies
   */
  createVacancy: async (payload: {
    title: string;
    department: string;
    position: string;
    requirements: string[];
    description: string;
    closingDate: string;
  }): Promise<JobPosting> => {
    if (USE_MOCK) {
      const newJob: JobPosting = {
        id: `job-${Date.now()}`,
        title: payload.title,
        department: payload.department,
        position: payload.position,
        postedDate: new Date().toISOString().split("T")[0],
        closingDate: payload.closingDate,
        description: payload.description,
        requirements: payload.requirements,
        applicantCount: 0,
        isOpen: true,
        status: "OPEN",
      };
      postingsStore = [newJob, ...postingsStore];
      return mockResponse(newJob);
    }
    const res = await api.post(API_ENDPOINTS.hr.VACANCIES, payload);
    return res.data;
  },

  /**
   * GET /api/v1/hr/candidates
   */
  getHrCandidates: async (vacancyId?: string): Promise<JobApplication[]> => {
    if (USE_MOCK) {
      if (vacancyId && vacancyId !== "ALL") {
        return mockResponse(applicationsStore.filter((a) => a.jobId === vacancyId));
      }
      return mockResponse(applicationsStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.CANDIDATES, { params: { vacancyId } });
    return res.data;
  },

  /**
   * PATCH /api/v1/hr/candidates/:id/status
   */
  updateCandidateStatus: async (
    id: string,
    status: ApplicationStatus
  ): Promise<JobApplication> => {
    if (USE_MOCK) {
      const app = applicationsStore.find((a) => a.id === id);
      if (app) app.status = status;
      return mockResponse(app || applicationsStore[0]);
    }
    const res = await api.patch(`${API_ENDPOINTS.hr.CANDIDATES}/${id}/status`, { status });
    return res.data;
  },

  /**
   * GET /api/v1/hr/interviews
   */
  getInterviews: async (): Promise<InterviewSchedule[]> => {
    if (USE_MOCK) {
      return mockResponse(interviewsStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.INTERVIEWS);
    return res.data;
  },

  /**
   * POST /api/v1/hr/interviews
   */
  scheduleInterview: async (payload: {
    applicationId: string;
    dateTime: string;
    interviewerName: string;
    notes?: string;
  }): Promise<InterviewSchedule> => {
    if (USE_MOCK) {
      const app = applicationsStore.find((a) => a.id === payload.applicationId);
      const newInt: InterviewSchedule = {
        id: `int-${Date.now()}`,
        applicationId: payload.applicationId,
        candidateName: app ? app.candidateName : "Candidate",
        vacancyTitle: app ? app.jobTitle : "Position",
        dateTime: payload.dateTime,
        interviewerName: payload.interviewerName,
        status: "SCHEDULED",
        notes: payload.notes,
      };
      if (app) {
        app.status = "INTERVIEW";
        app.interviewDate = payload.dateTime.split(" ")[0];
        app.interviewTime = payload.dateTime.split(" ")[1] || "10:00 AM";
      }
      interviewsStore = [newInt, ...interviewsStore];
      return mockResponse(newInt);
    }
    const res = await api.post(API_ENDPOINTS.hr.INTERVIEWS, payload);
    return res.data;
  },
};

