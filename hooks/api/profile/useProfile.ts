import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileService } from "@/lib/api/profile.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { CreateProfileUpdateRequestDto } from "@/types/dto/profile.dto";

export const useProfileQuery = () => {
  return useQuery({
    queryKey: [queryKeys.employeeProfile],
    queryFn: () => profileService.getProfile(),
  });
};

export const useProfileUpdateRequestsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.profileUpdateRequests],
    queryFn: () => profileService.getProfileUpdateRequests(),
  });
};

export const useCreateProfileUpdateRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProfileUpdateRequestDto) =>
      profileService.createUpdateRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.employeeProfile] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.profileUpdateRequests] });
      toast.success("Profile update request submitted for HR approval!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to submit profile update request.");
    },
  });
};

export const useDecideProfileRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      decision,
      comment,
    }: {
      id: string;
      decision: "APPROVED" | "REJECTED";
      comment: string;
    }) => profileService.decideProfileRequest(id, decision, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.profileUpdateRequests] });
      toast.success(
        `Request ${variables.decision === "APPROVED" ? "approved" : "rejected"} successfully!`
      );
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to process request decision.");
    },
  });
};

