import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

interface UpdateMaterialPayload {
    title?: string;
    content_url?: string;
    content_text?: string;
    file_name?: string;
    file_format?: string;
    display_order?: number;
    zoom_link?: string;
    zoom_start_time?: string;
    zoom_duration?: number;
}

export const useUpdateMaterial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: UpdateMaterialPayload }) => {
            const response = await axiosInstance.patch(`/api/v1/lecturer/content/materials/${id}`, payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Material updated successfully");
            queryClient.invalidateQueries({ queryKey: ["tier-materials"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update material");
        },
    });
};
