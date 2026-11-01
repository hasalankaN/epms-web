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

export const useAdminEmployeeRequestsQuery = (params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: [queryKeys.adminAccountRequests, "admin", params],
    queryFn: () => accountRequestService.getAdminEmployeeRequests(params),
  });
};

export const useHrEmployeeRequestsQuery = (params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: [queryKeys.adminAccountRequests, "hr", params],
    queryFn: () => accountRequestService.getHrEmployeeRequests(params),
  });
};

export const useAcceptEmployeeRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountRequestService.acceptEmployeeRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.adminAccountRequests] });
      toast.success("Employee account request approved and user provisioned!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to approve employee request.");
    },
  });
};

export const useRejectEmployeeRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      accountRequestService.rejectEmployeeRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.adminAccountRequests] });
      toast.success("Employee account request rejected.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to reject employee request.");
    },
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
      toast.error(err?.response?.data?.message || err?.message || "Failed to submit account request.");
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
      toast.error(err?.response?.data?.message || err?.message || "Failed to process account request.");
    },
  });
};
