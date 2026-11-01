import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { leaveService, type LeaveFilterQuery } from "@/lib/api/leave.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { CreateLeaveDto, AdjustLeaveBalanceDto, LeavePolicy } from "@/types/dto/leave.dto";

export const useLeaveBalancesQuery = () => {
  return useQuery({
    queryKey: [queryKeys.leaveBalances],
    queryFn: () => leaveService.getMyLeaveBalances(),
  });
};

export const useMyLeavesQuery = (query: LeaveFilterQuery = {}) => {
  return useQuery({
    queryKey: [queryKeys.leaves, query],
    queryFn: () => leaveService.getMyLeaves(query),
  });
};

export const useSupervisorLeavesQuery = (query: LeaveFilterQuery = {}) => {
  return useQuery({
    queryKey: [queryKeys.supervisorLeaves, query],
    queryFn: () => leaveService.getSupervisorLeaves(query),
  });
};

export const useLeavePoliciesQuery = () => {
  return useQuery({
    queryKey: [queryKeys.leavePolicies],
    queryFn: () => leaveService.getLeavePolicies(),
  });
};

export const useApplyLeaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeaveDto) => leaveService.applyLeave(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.leaves] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.leaveBalances] });
      toast.success("Leave application submitted successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to submit leave application.");
    },
  });
};

export const useCancelLeaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leaveService.cancelLeave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.leaves] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.leaveBalances] });
      toast.success("Leave application cancelled.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to cancel leave.");
    },
  });
};

export const useDecideLeaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      decision,
      comment,
    }: {
      id: string;
      decision: "APPROVED" | "REJECTED" | "ESCALATED";
      comment: string;
    }) => leaveService.decideLeave(id, decision, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.supervisorLeaves] });
      toast.success(`Leave request marked as ${variables.decision}!`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to process leave decision.");
    },
  });
};

export const useAdjustLeaveBalanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdjustLeaveBalanceDto) =>
      leaveService.adjustLeaveBalance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.leaveBalances] });
      toast.success("Leave balance adjusted successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to adjust balance.");
    },
  });
};

export const useUpdateLeavePolicyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<LeavePolicy> }) =>
      leaveService.updateLeavePolicy(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.leavePolicies] });
      toast.success("Leave policy updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update policy.");
    },
  });
};

