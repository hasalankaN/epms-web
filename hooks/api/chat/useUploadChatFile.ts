import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import api from "@/lib/axios";

export interface ChatFileUploadResponse {
  status: string;
  message: string | null;
  data: {
    url: string;
    fileName: string;
    fileSize: number;
    type: string;
  };
}

interface UploadChatFileArgs {
  file: File;
  onUploadProgress?: (progressEvent: any) => void;
}

export function useUploadChatFile() {
  return useMutation({
    mutationFn: async ({ file, onUploadProgress }: UploadChatFileArgs) => {
      const formData = new FormData();

      formData.append("file", file);

      const response = await api.post<ChatFileUploadResponse>(
        API_ENDPOINTS.chat.UPLOAD_FILE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress,
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // Upload success handled by caller
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload file");
    },
  });
}
