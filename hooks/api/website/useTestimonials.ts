import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  student_name: string;
  content: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTestimonialPayload {
  studentName: string;
  content: string;
  sortOrder?: number;
}

export interface UpdateTestimonialPayload extends Partial<CreateTestimonialPayload> {
  isVisible?: boolean;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useGetTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: [queryKeys.websiteTestimonials],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.website.TESTIMONIALS);

      return response.data.data;
    },
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTestimonialPayload) => {
      const response = await api.post(
        API_ENDPOINTS.website.TESTIMONIALS,
        payload,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.websiteTestimonials],
      });
      toast.success("Testimonial added successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to add testimonial.",
      );
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: UpdateTestimonialPayload & { id: string }) => {
      const response = await api.patch(
        API_ENDPOINTS.website.TESTIMONIAL(id),
        payload,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.websiteTestimonials],
      });
      toast.success("Testimonial updated successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update testimonial.",
      );
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(API_ENDPOINTS.website.TESTIMONIAL(id));

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.websiteTestimonials],
      });
      toast.success("Testimonial deleted successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete testimonial.",
      );
    },
  });
}

export function useToggleTestimonialVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(
        API_ENDPOINTS.website.TESTIMONIAL_VISIBILITY(id),
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.websiteTestimonials],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to toggle visibility.",
      );
    },
  });
}

export function useReorderTestimonials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: Array<{ id: string; sortOrder: number }>) => {
      const response = await api.patch(
        API_ENDPOINTS.website.TESTIMONIALS_REORDER,
        {
          items,
        },
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.websiteTestimonials],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to reorder testimonials.",
      );
    },
  });
}
