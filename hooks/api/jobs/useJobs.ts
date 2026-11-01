import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { jobService } from "@/lib/api/job.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ApplicationStatus } from "@/types/dto/job.dto";

export const useJobPostingsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.jobPostings],
    queryFn: () => jobService.getJobPostings(),
  });
};

export const useMyApplicationsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.myJobApplications],
    queryFn: () => jobService.getMyApplications(),
  });
};

export const useApplyJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.applyForJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.jobPostings] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.myJobApplications] });
      toast.success("Job application submitted successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to submit application.");
    },
  });
};

export const useCancelApplicationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobService.cancelApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.myJobApplications] });
      toast.success("Job application cancelled.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to cancel application.");
    },
  });
};

export const useHrVacanciesQuery = () => {
  return useQuery({
    queryKey: [queryKeys.recruitmentVacancies],
    queryFn: () => jobService.getHrVacancies(),
  });
};

export const useCreateVacancyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      title: string;
      department: string;
      position: string;
      requirements: string[];
      description: string;
      closingDate: string;
    }) => jobService.createVacancy(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.recruitmentVacancies] });
      toast.success("Vacancy created successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create vacancy.");
    },
  });
};

export const useHrCandidatesQuery = (vacancyId?: string) => {
  return useQuery({
    queryKey: [queryKeys.recruitmentCandidates, vacancyId],
    queryFn: () => jobService.getHrCandidates(vacancyId),
  });
};

export const useUpdateCandidateStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      jobService.updateCandidateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.recruitmentCandidates] });
      toast.success("Candidate stage updated!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update candidate status.");
    },
  });
};

export const useInterviewsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.recruitmentInterviews],
    queryFn: () => jobService.getInterviews(),
  });
};

export const useScheduleInterviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      applicationId: string;
      dateTime: string;
      interviewerName: string;
      notes?: string;
    }) => jobService.scheduleInterview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.recruitmentInterviews] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.recruitmentCandidates] });
      toast.success("Interview scheduled successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to schedule interview.");
    },
  });
};

