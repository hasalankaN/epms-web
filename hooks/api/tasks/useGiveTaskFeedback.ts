import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface TaskFeedbackPayload {
  score?: string;
  feedback?: string;
}

export function useGiveTaskFeedback(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submissionId,
      payload,
    }: {
      submissionId: string;
      payload: TaskFeedbackPayload;
    }) => {
      const response = await api.patch(
        API_ENDPOINTS.tasks.FEEDBACK(submissionId),
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.tasks, taskId],
      });
      toast.success("Feedback submitted successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to submit feedback."
      );
    },
  });
}
