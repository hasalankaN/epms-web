"use client";

import { useState, useRef, useCallback } from "react";

// Removed next/image import to use standard HTML img

import { X, FileUp } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  setImage: (image: string) => void;
  removeImage: () => void;
  imageUrl: string;
  className?: string;
  dropzoneClassName?: string;
  iconClassName?: string;
  placeholder?: React.ReactNode;
  limit?: number;
  supportedFormats?: string;
  maxSize?: string;
  accept?: string;
  showSupportedFormats?: boolean;
}

export default function ImageUpload({
  setImage,
  removeImage,
  imageUrl,
  className,
  dropzoneClassName,
  iconClassName,
  placeholder,
  limit,
  supportedFormats,
  maxSize,
  accept,
  showSupportedFormats = true,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelTokenSourceRef = useRef<any>(null);

  const handleFile = useCallback(
    async (file: File) => {
      // Skip file type validation for now - accept any file
      if (file.size > (limit ?? 10) * 1024 * 1024) {
        toast.error(
          `File size exceeds the ${
            limit ?? 10
          }MB limit. Please upload a smaller file.`
        );

        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();

      formData.append("files", file);

      const res = await Promise.resolve({
        status: "FAILED",
        message: "Failed to upload image",
        data: ["https://via.placeholder.com/150"],
      });

      if (res.status === "SUCCESS") {
        setImage(res.data[0]);
        setUploadProgress(100);
      } else {
        if (res.message === "canceled") {
          setIsUploading(false);

          return resetUploadState();
        }

        toast.error(res.message || "Failed to upload image");
        resetUploadState();
      }

      setIsUploading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setImage]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) handleFile(file);
  };

  const resetUploadState = () => {
    setPreview(null);
    setUploadProgress(0);
    removeImage();
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (isUploading) {
      cancelUpload();
    }
  };

  const handleDiscard = () => resetUploadState();

  const cancelUpload = () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel();
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];

    if (file) handleFile(file);
  };

  return (
    <div className="w-full mx-auto">
      <div
        className="relative"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview && (
          <div className={cn("flex flex-col", className)}>
            <div
              className={cn(
                "relative w-full h-full bg-gray-100 rounded-lg overflow-hidden"
              )}
            >
              <img
                src={preview}
                alt="Selected file preview"
                style={{ opacity: isUploading ? uploadProgress / 100 : 1 }}
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-5 w-5 rounded-sm bg-red-500 hover:bg-red-600"
                onClick={handleDiscard}
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            {isUploading && (
              <div className={cn("mt-2", uploadProgress === 100 && "hidden")}>
                <Progress value={uploadProgress} className="w-full h-2" />
              </div>
            )}
          </div>
        )}
        {!isUploading && !preview && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center p-2 h-[171px] w-full border border-dashed border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-slate-50 transition-colors gap-2 bg-transparent overflow-hidden",
              isDragging && "bg-blue-50",
              dropzoneClassName
            )}
          >
            <FileUp className={cn("w-8 h-8 text-[#62748E] shrink-0", iconClassName)} />
            
            {(placeholder !== null) && (
              <div className="flex flex-col items-center gap-0">
                {placeholder !== "" && (
                  <p className="text-[#62748E] text-center text-[14px] italic font-normal leading-5">
                    {placeholder ?? "Upload Image Here or drag and drop here"}
                  </p>
                )}
                {showSupportedFormats && (
                  <>
                    <p className="text-[#90A1B9] text-center text-[12px] italic font-normal leading-4 mt-1">
                      {supportedFormats || "Supported File format: png, jpeg, WebP"}
                    </p>
                    <p className="text-[#90A1B9] text-center text-[12px] italic font-normal leading-4">
                      {maxSize || `(Max ${limit ?? 10}MB)`}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        <input
          type="file"
          accept={accept || "image/png, image/jpeg, image/svg+xml"}
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          aria-label="Upload file"
          title="Upload file"
        />
      </div>
    </div>
  );
}
