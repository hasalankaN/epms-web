import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productionService, type ProductionFilterQuery } from "@/lib/api/production.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ReviewProductionDto } from "@/types/dto/production.dto";

export const useMyProductionQuery = (query: ProductionFilterQuery = {}) => {
  return useQuery({
    queryKey: [queryKeys.productionRecords, query],
    queryFn: () => productionService.getMyProduction(query),
  });
};

export const useSupervisorProductionQuery = (query: ProductionFilterQuery = {}) => {
  return useQuery({
    queryKey: [queryKeys.productionRecords, "supervisor", query],
    queryFn: () => productionService.getSupervisorProduction(query),
  });
};

export const useProductionStatsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.productionRecords, "stats"],
    queryFn: () => productionService.getProductionStats(),
  });
};

export const useReviewProductionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewProductionDto) =>
      productionService.reviewProduction(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.productionRecords] });
      toast.success(
        `Production record ${variables.approvalStatus === "APPROVED" ? "approved" : "rejected"}!`
      );
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to process production review.");
    },
  });
};

