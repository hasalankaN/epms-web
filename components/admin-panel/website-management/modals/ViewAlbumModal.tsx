"use client";

import React, { useState, useEffect, useRef } from "react";

import { X, Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import type { Album } from "@/types/website-management";
import { useUploadFile } from "@/hooks/api/files/useUploadFile";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

interface ViewAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  album: Album | null;
}

type GridImage = 
  | { id: string; type: "existing"; url: string }
  | { id: string; type: "new"; url: string }
  | { id: string; type: "uploading"; file: File; preview: string; progress: number };

function UploadingGridItem({ 
  item, 
  onComplete, 
  onRemove 
}: { 
  item: { id: string; type: "uploading"; file: File; preview: string; progress: number };
  onComplete: (id: string, url: string) => void;
  onRemove: (id: string) => void;
}) {
  const { mutateAsync: uploadFile } = useUploadFile();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    uploadFile({
      file: item.file,
      onUploadProgress: (progressEvent: any) => {
        if (!isMounted) return;

        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || item.file.size)
        );

        setProgress(percentCompleted);
      },
    })
      .then((res) => {
        if (isMounted) onComplete(item.id, res.data.url);
      })
      .catch((err) => {
        console.error("Upload failed", err);
        if (isMounted) onRemove(item.id);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="group relative w-[172px] h-[172px] rounded-lg overflow-hidden shadow-sm border-2 border-[#E60076]">
      <img
        src={item.preview}
        alt="Uploading"
        className="h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <span className="text-sm font-bold text-[#E60076]">{progress}%</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <Progress 
          value={progress} 
          className="h-1.5 w-full bg-slate-200 [&>div]:bg-[#E60076]" 
        />
      </div>
      <button 
        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
      >
        <X className="h-4 w-4 text-[#FB2C36]" />
      </button>
    </div>
  );
}

export function ViewAlbumModal({ isOpen, onClose, album }: ViewAlbumModalProps) {
  const [images, setImages] = useState<GridImage[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deletion Confirmation state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [imageToDeleteId, setImageToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (album && isOpen) {
      setImages(
        (album.images || []).map((url, i) => ({
          id: `existing-${i}`,
          type: "existing",
          url,
        }))
      );
      setIsDirty(false);
    }
  }, [album, isOpen]);

  if (!album) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    handleFiles(Array.from(files));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFiles = (files: File[]) => {
    const toUpload = files.slice(0, 5);

    if (toUpload.length === 0) return;

    const newItems: GridImage[] = toUpload.map((file) => ({
      id: `upload-${Date.now()}-${Math.random()}`,
      type: "uploading",
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));

    setImages((prev) => [...prev, ...newItems]);
    setIsDirty(true);
  };

  const handleUploadComplete = (id: string, url: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, type: "new", url } : img))
    );
  };

  const confirmRemoveImage = () => {
    if (!imageToDeleteId) return;

    setImages((prev) => {
      const target = prev.find((i) => i.id === imageToDeleteId);

      if (target?.type === "uploading") {
        URL.revokeObjectURL(target.preview);
      }

      return prev.filter((i) => i.id !== imageToDeleteId);
    });
    setIsDirty(true);
    setIsDeleteConfirmOpen(false);
    setImageToDeleteId(null);
  };

  const handleRemoveImage = (id: string) => {
    const target = images.find((i) => i.id === id);
    
    // Only show confirmation for existing images
    if (target?.type === "existing") {
      setImageToDeleteId(id);
      setIsDeleteConfirmOpen(true);
    } else {
      // For new or uploading images, delete immediately
      setImages((prev) => {
        if (target?.type === "uploading") {
          URL.revokeObjectURL(target.preview);
        }

        return prev.filter((i) => i.id !== id);
      });
      setIsDirty(true);
    }
  };

  // Drag and Drop
  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          animateChildren={true}
          className="flex max-h-[90vh] w-[95%] max-w-[830px] flex-col gap-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between p-6 pb-4 shrink-0">
            <DialogTitle className="font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              View Album
            </DialogTitle>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </motion.div>

          <div className="h-[1px] bg-[#E2E8F0] mx-6" />

          {/* Body */}
          <motion.div
            variants={itemVariants}
            className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar"
          >
            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,172px)] gap-4 justify-items-center sm:justify-items-start">
              
              {/* Add New Image Trigger */}
              <div 
                className={cn(
                  "flex flex-col items-center justify-center w-[172px] h-[172px] border-2 border-dashed rounded-lg cursor-pointer transition-colors gap-2",
                  isDragging ? "border-blue-400 bg-blue-50" : "border-[#E2E8F0] bg-transparent hover:bg-slate-50"
                )}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC]">
                  <Plus className="h-5 w-5 text-[#64748B]" />
                </div>
                <div className="flex flex-col items-center gap-0 px-2">
                  <p className="text-[#62748E] text-center text-[14px] italic font-normal leading-5">
                    Add New Image
                  </p>
                  <p className="text-[#90A1B9] text-center text-[10px] italic font-normal leading-4 mt-0.5">
                    Supported File format: png, jpeg, WebP
                  </p>
                  <p className="text-[#90A1B9] text-center text-[10px] italic font-normal leading-4">
                    (Max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>

              {/* Album Images Grid */}
              {images.map((img) => {
                if (img.type === "uploading") {
                  return (
                    <UploadingGridItem
                      key={img.id}
                      item={img}
                      onComplete={handleUploadComplete}
                      onRemove={handleRemoveImage}
                    />
                  );
                }

                return (
                  <div 
                    key={img.id} 
                    className={cn(
                      "group relative w-[172px] h-[172px] rounded-lg overflow-hidden shadow-sm border-2",
                      img.type === "new" ? "border-[#E60076]" : "border-transparent"
                    )}
                  >
                    <img
                      src={img.url}
                      alt="Album content"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {img.type === "new" && (
                      <div className="absolute top-2 left-2 bg-[#E60076] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-10">
                        NEW
                      </div>
                    )}
                    <button 
                      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors z-10 opacity-0 group-hover:opacity-100 sm:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(img.id);
                      }}
                    >
                      {img.type === "new" ? (
                        <X className="h-4 w-4 text-[#FB2C36]" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-[#FB2C36]" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-end gap-3 p-4 sm:p-6 pt-4 border-t border-[#E2E8F0] shrink-0 mt-auto"
          >
            <Button
              type="button"
              className={cn(
                BUTTON_STYLES.primary.md,
                "font-inter text-[14px] font-semibold text-white leading-5 px-8"
              )}
              disabled={!isDirty || images.some(img => img.type === "uploading")}
              onClick={onClose}
            >
              Update Album
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setImageToDeleteId(null);
        }}
        onConfirm={confirmRemoveImage}
        title="Delete Image"
        description="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Confirm Delete"
      />
    </>
  );
}
