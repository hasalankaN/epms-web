import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import api from "@/lib/axios";

export interface FileUploadResponse {
  status: string;
  message: string | null;
  data: {
    url: string;
    fileName: string;
    mimetype: string;
    size: number;
  };
}

interface UploadFileArgs {
  file: File;
  onUploadProgress?: (progressEvent: any) => void;
}

export function useUploadFile() {
  return useMutation({
    mutationFn: async ({ file, onUploadProgress }: UploadFileArgs) => {
      const formData = new FormData();

      formData.append("file", file);

      const response = await api.post<FileUploadResponse>(
        API_ENDPOINTS.files.UPLOAD,
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
      // Optional: Add a success toast here if needed, 
      // though usually uploading is a background sub-task of a larger form.
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload file");
    },
  });
}
