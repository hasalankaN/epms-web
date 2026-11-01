import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountRequestService } from "@/lib/api/accountRequest.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { CreateAccountRequestDto } from "@/types/dto/accountRequest.dto";

export const useAccountRequestsQuery = (status?: string) => {
  return useQuery({
    queryKey: [queryKeys.adminAccountRequests, status],
    queryFn: () => accountRequestService.getAccountRequests(status),
  });
};

export const useCreateAccountRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccountRequestDto) =>
      accountRequestService.createAccountRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.adminAccountRequests] });
      toast.success("Account request dispatched to Administrator!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to submit account request.");
    },
  });
};

export const useDecideAccountRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      decision,
      adminComment,
    }: {
      id: string;
      decision: "APPROVED" | "REJECTED";
      adminComment?: string;
    }) => accountRequestService.decideAccountRequest(id, decision, adminComment || ""),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.adminAccountRequests] });
      toast.success(
        `Account request ${variables.decision === "APPROVED" ? "approved" : "rejected"}!`
      );
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to process account request.");
    },
  });
};

