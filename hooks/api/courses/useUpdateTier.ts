import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

interface UpdateTierPayload {
    title?: string;
    description?: string;
    is_enabled?: boolean;
    display_order?: number;
}

export const useUpdateTier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: UpdateTierPayload }) => {
            const response = await axiosInstance.patch(API_ENDPOINTS.lecturer.CONTENT_TIER(id), payload);

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course-tiers"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update tier");
        },
    });
};
