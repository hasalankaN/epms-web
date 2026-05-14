"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// Removed next/image import to use standard HTML img

import { X, FileUp } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/hooks/api/files/useUploadFile";

interface ImageUploadProps {
  setImage: (image: string, file?: File) => void;
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

  // Keep internal preview state synced with external imageUrl prop
  // This is crucial for form resets when the panel is closed and reopened
  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelTokenSourceRef = useRef<any>(null);

  const { mutateAsync: uploadFile } = useUploadFile();

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

      setFileName(file.name);
      const reader = new FileReader();

      reader.onloadend = async () => {
        const dataUrl = reader.result as string;

        setPreview(dataUrl);
        setIsUploading(true);
        setUploadProgress(0);

        try {
          const res = await uploadFile({
            file,
            onUploadProgress: (progressEvent: any) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || file.size)
              );

              setUploadProgress(percentCompleted);
            },
          });
          
          // Image successfully uploaded to server
          setImage(res.data.url, file);
        } catch (error) {
          console.log(error);
          setPreview(null);
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setImage, uploadFile, limit]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) handleFile(file);
  };

  const resetUploadState = () => {
    setPreview(null);
    setUploadProgress(0);
    setFileName(null);
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
    <div className={cn("w-full h-fit mx-auto", className)}>
      <div
        className={cn("relative h-full w-full", isUploading && "pointer-events-none")}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview && (
          <div className={cn("flex flex-col w-full h-[171px] relative", className)}>
            <div
              className={cn(
                "relative w-full h-full bg-slate-100 rounded-lg overflow-hidden",
                isUploading && "animate-pulse"
              )}
            >
              {preview.startsWith("data:video") || preview.match(/\.(mp4|webm|mov)$/i) || accept?.includes("video") ? (
                <video
                  src={preview}
                  className={cn("w-full h-full object-cover transition-opacity duration-300", isUploading && "opacity-20")}
                  controls
                  muted
                />
              ) : preview.startsWith("data:image") || preview.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? (
                <img
                  src={preview}
                  alt="Selected file preview"
                  className={cn("w-full h-full object-cover transition-opacity duration-300", isUploading && "opacity-20")}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm border border-[#E2E8F0]">
                    <FileUp className="h-6 w-6 text-[#62748E]" />
                  </div>
                  <span className="text-xs font-medium text-[#45556C] text-center line-clamp-2 px-2">
                    {(fileName || (preview.startsWith("data:") ? "Document Uploaded" : preview.split("/").pop()))}
                  </span>
                </div>
              )}
              {!isUploading && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-5 w-5 rounded-sm bg-red-500 hover:bg-red-600 z-10"
                  onClick={(e) => { e.stopPropagation(); handleDiscard(); }}
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {isUploading && (
                 <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-white/60">
                    <span className="text-lg font-bold text-[#E60076]">{uploadProgress}%</span>
                 </div>
              )}
              {isUploading && (
                 <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
                    <Progress 
                      value={uploadProgress} 
                      className="h-1.5 w-full bg-slate-200 [&>div]:bg-[#E60076]" 
                    />
                 </div>
              )}
            </div>
            {isUploading && (
               <p className="mt-2 text-center text-xs font-medium text-[#E60076] animate-pulse">
                 Uploading...
               </p>
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
                  <div className="text-[#62748E] text-center text-[14px] italic font-normal leading-5">
                    {placeholder ?? "Upload Image Here or drag and drop here"}
                  </div>
                )}
                {showSupportedFormats && (
                  <>
                    <div className="text-[#90A1B9] text-center text-[12px] italic font-normal leading-4 mt-1">
                      {supportedFormats || "Supported File format: png, jpeg, WebP"}
                    </div>
                    <div className="text-[#90A1B9] text-center text-[12px] italic font-normal leading-4">
                      {maxSize || `(Max ${limit ?? 10}MB)`}
                    </div>
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
