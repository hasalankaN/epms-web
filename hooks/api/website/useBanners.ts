import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BannerType = "HERO" | "SECTION";

export interface WebsiteBanner {
  id: string;
  type: BannerType;
  title: string | null;
  sub_title: string | null;
  paragraph: string | null;
  enable_buttons: boolean;
  number_of_buttons: number;
  button1_text: string | null;
  button1_link: string | null;
  button2_text: string | null;
  button2_link: string | null;
  desktop_image_url: string | null;
  mobile_image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBannerPayload {
  type: BannerType;
  title?: string;
  subTitle?: string;
  paragraph?: string;
  enableButtons?: boolean;
  numberOfButtons?: number;
  button1Text?: string;
  button1Link?: string;
  button2Text?: string;
  button2Link?: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  sortOrder?: number;
}

export interface UpdateBannerPayload extends Partial<CreateBannerPayload> {
  isActive?: boolean;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useGetBanners(type?: BannerType) {
  return useQuery<WebsiteBanner[]>({
    queryKey: [queryKeys.websiteBanners, type],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.website.BANNERS, {
        params: type ? { type } : undefined,
      });

      return response.data.data;
    },
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBannerPayload) => {
      const response = await api.post(API_ENDPOINTS.website.BANNERS, payload);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteBanners] });
      toast.success("Banner created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create banner.");
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: UpdateBannerPayload & { id: string }) => {
      const response = await api.patch(
        API_ENDPOINTS.website.BANNER(id),
        payload,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteBanners] });
      toast.success("Banner updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update banner.");
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(API_ENDPOINTS.website.BANNER(id));

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteBanners] });
      toast.success("Banner deleted successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete banner.");
    },
  });
}

export function useReorderBanners() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: Array<{ id: string; sortOrder: number }>) => {
      const response = await api.patch(API_ENDPOINTS.website.BANNERS_REORDER, {
        items,
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteBanners] });
      toast.success("Banners reordered.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to reorder banners.",
      );
    },
  });
}
