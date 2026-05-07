import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsPostImage {
  id: string;
  news_post_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: NewsPostImage[];
}

export interface CreateNewsPostPayload {
  title: string;
  content?: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  publishedAt?: string;
}

export interface UpdateNewsPostPayload extends Partial<CreateNewsPostPayload> {
  isActive?: boolean;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useGetNewsPosts() {
  return useQuery<NewsPost[]>({
    queryKey: [queryKeys.websiteNewsPosts],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.website.NEWS_POSTS);

      return response.data.data;
    },
  });
}

export function useCreateNewsPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateNewsPostPayload) => {
      const response = await api.post(
        API_ENDPOINTS.website.NEWS_POSTS,
        payload,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteNewsPosts] });
      toast.success("News post created successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create news post.",
      );
    },
  });
}

export function useUpdateNewsPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: UpdateNewsPostPayload & { id: string }) => {
      const response = await api.patch(
        API_ENDPOINTS.website.NEWS_POST(id),
        payload,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteNewsPosts] });
      toast.success("News post updated successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update news post.",
      );
    },
  });
}

export function useDeleteNewsPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(API_ENDPOINTS.website.NEWS_POST(id));

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteNewsPosts] });
      toast.success("News post deleted successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete news post.",
      );
    },
  });
}
