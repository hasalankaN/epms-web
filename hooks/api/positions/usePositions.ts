import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { positionService } from "@/lib/api/position.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type {
  CreatePositionDto,
  PositionListQuery,
  PositionListResponse,
} from "@/types/dto/position.dto";

export const usePositionsQuery = (query: PositionListQuery = { page: 1, pageSize: 10 }) => {
  return useQuery<PositionListResponse, Error>({
    queryKey: [queryKeys.positions, query],
    queryFn: () => positionService.getPositions(query),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
};

export const useCreatePositionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePositionDto) => positionService.createPosition(payload),
    onSuccess: (newPos) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.positions] });
      toast.success(`Position "${newPos.positionName}" created successfully!`);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create position.";
      toast.error(msg);
    },
  });
};
