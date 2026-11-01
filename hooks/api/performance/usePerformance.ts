import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { performanceService } from "@/lib/api/performance.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { SelfEvaluation } from "@/types/dto/performance.dto";

export const useCurrentSelfEvaluationQuery = () => {
  return useQuery({
    queryKey: [queryKeys.selfEvaluations, "current"],
    queryFn: () => performanceService.getCurrentSelfEvaluation(),
  });
};

export const useMyReviewsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.performanceReviews],
    queryFn: () => performanceService.getMyReviews(),
  });
};

export const useTeamSelfEvaluationsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.selfEvaluations, "team"],
    queryFn: () => performanceService.getTeamSelfEvaluations(),
  });
};

export const useSaveSelfEvaluationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      isSubmit,
    }: {
      payload: Partial<SelfEvaluation>;
      isSubmit: boolean;
    }) => performanceService.saveSelfEvaluation(payload, isSubmit),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.selfEvaluations] });
      toast.success(
        variables.isSubmit
          ? "Self evaluation submitted for supervisor review!"
          : "Self evaluation draft saved successfully!"
      );
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save self evaluation.");
    },
  });
};

export const useSubmitSupervisorEvaluationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      evalId,
      payload,
    }: {
      evalId: string;
      payload: {
        supervisorRating: number;
        supervisorFeedback: string;
        supervisorComments: string;
        strengths: string;
        areasToImprove: string;
        recommendation: "NONE" | "REWARD" | "TRAINING" | "PROMOTION";
      };
    }) => performanceService.submitSupervisorEvaluation(evalId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.selfEvaluations] });
      toast.success("Supervisor appraisal finalized and submitted!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to finalize evaluation.");
    },
  });
};

export const useEvaluationMeetingsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.evaluationMeetings],
    queryFn: () => performanceService.getEvaluationMeetings(),
  });
};

export const useScheduleEvaluationMeetingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      employeeId: string;
      dateTime: string;
      location: string;
      notes?: string;
    }) => performanceService.scheduleEvaluationMeeting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.evaluationMeetings] });
      toast.success("Appraisal meeting scheduled!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to schedule meeting.");
    },
  });
};

export const useDepartmentPerformanceQuery = () => {
  return useQuery({
    queryKey: [queryKeys.departmentPerformance],
    queryFn: () => performanceService.getDepartmentPerformance(),
  });
};

export const useRewardsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.rewards],
    queryFn: () => performanceService.getRewards(),
  });
};

export const useAssignRewardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      employeeId: string;
      type: "BONUS" | "INCENTIVE" | "RECOGNITION";
      amount?: number;
      reason: string;
    }) => performanceService.assignReward(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.rewards] });
      toast.success("Reward assigned successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to assign reward.");
    },
  });
};

