import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GalleryImage {
  id: string;
  album_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  thumbnail_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images?: GalleryImage[];
}

export interface CreateAlbumPayload {
  name: string;
  thumbnailUrl?: string;
  sortOrder?: number;
}

export interface UpdateAlbumPayload extends Partial<CreateAlbumPayload> {
  isActive?: boolean;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useGetAlbums() {
  return useQuery<GalleryAlbum[]>({
    queryKey: [queryKeys.websiteGallery],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.website.GALLERY);

      return response.data.data;
    },
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAlbumPayload) => {
      const response = await api.post(API_ENDPOINTS.website.GALLERY, payload);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteGallery] });
      toast.success("Album created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create album.");
    },
  });
}

export function useUpdateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: UpdateAlbumPayload & { id: string }) => {
      const response = await api.patch(
        API_ENDPOINTS.website.ALBUM(id),
        payload,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteGallery] });
      toast.success("Album updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update album.");
    },
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(API_ENDPOINTS.website.ALBUM(id));

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteGallery] });
      toast.success("Album deleted successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete album.");
    },
  });
}

export function useAddAlbumImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      albumId,
      imageUrls,
    }: {
      albumId: string;
      imageUrls: string[];
    }) => {
      const response = await api.post(
        API_ENDPOINTS.website.ALBUM_IMAGES(albumId),
        {
          imageUrls,
        },
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteGallery] });
      toast.success("Images added successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add images.");
    },
  });
}

export function useDeleteAlbumImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      albumId,
      imageId,
    }: {
      albumId: string;
      imageId: string;
    }) => {
      const response = await api.delete(
        API_ENDPOINTS.website.ALBUM_IMAGE(albumId, imageId),
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteGallery] });
      toast.success("Image removed.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove image.");
    },
  });
}
