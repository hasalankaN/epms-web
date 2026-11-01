import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { trainingService, type TrainingFilterQuery } from "@/lib/api/training.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { TrainingEvaluationDto, PlanTrainingDto } from "@/types/dto/training.dto";

export const useMyTrainingsQuery = (query: TrainingFilterQuery = {}) => {
  return useQuery({
    queryKey: [queryKeys.employeeTrainings, query],
    queryFn: () => trainingService.getMyTrainings(query),
  });
};

export const useHrTrainingsQuery = (query: TrainingFilterQuery = {}) => {
  return useQuery({
    queryKey: [queryKeys.hrTrainings, query],
    queryFn: () => trainingService.getHrTrainings(query),
  });
};

export const useTeamTrainingAttendanceQuery = () => {
  return useQuery({
    queryKey: [queryKeys.teamTrainings],
    queryFn: () => trainingService.getTeamTrainingAttendance(),
  });
};

export const useSubmitTrainingEvaluationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TrainingEvaluationDto) =>
      trainingService.submitTrainingEvaluation(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.employeeTrainings] });
      toast.success(data.message);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to submit training evaluation.");
    },
  });
};

export const usePlanTrainingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlanTrainingDto) => trainingService.planTraining(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.hrTrainings] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.employeeTrainings] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.teamTrainings] });
      toast.success("Training session planned and participants notified!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to plan training session.");
    },
  });
};
