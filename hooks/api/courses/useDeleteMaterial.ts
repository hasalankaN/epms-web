import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useDeleteMaterial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await axiosInstance.delete(`/api/v1/lecturer/content/materials/${id}`);
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
