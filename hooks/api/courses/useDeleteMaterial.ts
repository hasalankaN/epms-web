import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export const useDeleteMaterial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await axiosInstance.delete(API_ENDPOINTS.lecturer.CONTENT_MATERIAL(id));
            
            return response.data;
        },
        onSuccess: () => {
            toast.success("Material deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["tier-materials"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete material");
        },
    });
};
