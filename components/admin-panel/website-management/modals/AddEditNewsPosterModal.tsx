"use client";

import React, { useState, useEffect } from "react";

import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import ImageUpload from "@/components/common/ImageUpload";
import { cn } from "@/lib/utils";
import type { NewsPoster } from "@/types/website-management";

const newsPosterSchema = z.object({
  title: z.string().min(1, "Post title is required"),
  content: z.string().min(1, "Content is required"),
});

type NewsPosterFormValues = z.infer<typeof newsPosterSchema>;

interface AddEditNewsPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: NewsPoster | null;
  onSave: (data: any) => void;
  isSubmitting?: boolean;
}

export function AddEditNewsPosterModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  isSubmitting = false,
}: AddEditNewsPosterModalProps) {
  const [thumbnail, setThumbnail] = useState("");
  const [gallery, setGallery] = useState<string[]>(["", "", "", ""]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty: formIsDirty },
  } = useForm<NewsPosterFormValues>({
    resolver: zodResolver(newsPosterSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const isImagesDirty = (() => {
    const initialThumbnail = initialData?.imageUrl || "";
    const currentThumbnail = thumbnail || "";

    if (initialThumbnail !== currentThumbnail) return true;

    const initialGallery = (initialData?.images || []).filter(Boolean);
    const currentGallery = (gallery || []).filter(Boolean);
    
    return JSON.stringify(initialGallery) !== JSON.stringify(currentGallery);
  })();

  const isDirty = formIsDirty || isImagesDirty;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title,
          content: initialData.content || "",
        });
        setThumbnail(initialData.imageUrl || "");
        setGallery(initialData.images?.length ? [...initialData.images, "", "", "", ""].slice(0, 4) : ["", "", "", ""]);
      } else {
        reset({
          title: "",
          content: "",
        });
        setThumbnail("");
        setGallery(["", "", "", ""]);
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (values: NewsPosterFormValues) => {
    onSave({
      ...values,
      imageUrl: thumbnail,
      images: gallery.filter(url => url !== ""),
    });
  };

  const handleClearAll = () => {
    reset({
      title: "",
      content: "",
    });
    setThumbnail("");
    setGallery(["", "", "", ""]);
  };

  const updateGalleryImage = (index: number, url: string) => {
    const newGallery = [...gallery];

    newGallery[index] = url;
    setGallery(newGallery);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[450px] flex-col gap-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] outline-none [&>button]:hidden">
        
        {/* ===== HEADER ===== */}
        <motion.div variants={itemVariants} className="flex items-center justify-between p-6 pb-4 shrink-0">
          <DialogTitle className="font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
            {initialData ? "Edit Post" : "New Post"}
          </DialogTitle>
          <button
            title="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
          >
            <X className="h-4 w-4 text-[#64748B]" />
          </button>
        </motion.div>

        <div className="h-[1px] bg-[#E2E8F0] mx-6 shrink-0" />

        {/* ===== FORM (Scrollable Middle Section) ===== */}
        <motion.form
          id="news-poster-form"
          onSubmit={handleSubmit(onSubmit)}
          variants={itemVariants}
          className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar flex flex-col gap-8"
        >
          {/* Post Title */}
          <div className="flex w-full flex-col gap-1.5">
            <Label className={AUTH_TYPOGRAPHY.label}>
              Post Title <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("title")}
              placeholder="Lorem Ipsum"
              className={cn(
                AUTH_INPUT.base, 
                AUTH_INPUT.placeholder,
                errors.title && "border-red-500 focus:ring-red-500"
              )}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Content */}
          <div className="flex w-full flex-col gap-1.5">
            <Label className={AUTH_TYPOGRAPHY.label}>
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              {...register("content")}
              placeholder="eg: Type your message here"
              className={cn(
                AUTH_INPUT.base, 
                AUTH_INPUT.placeholder,
                "min-h-[120px] resize-none",
                errors.content && "border-red-500 focus:ring-red-500"
              )}
            />
            {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
          </div>

          {/* Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail Image */}
            <div className="flex flex-col gap-1.5">
              <Label className={AUTH_TYPOGRAPHY.label}>Thumbnail Image</Label>
              <ImageUpload
                imageUrl={thumbnail}
                setImage={(url) => setThumbnail(url)}
                removeImage={() => setThumbnail("")}
                className="h-[180px] w-full"
                dropzoneClassName="h-full border border-dashed border-[#E2E8F0] rounded-lg bg-transparent hover:bg-slate-50 transition-colors"
                showSupportedFormats={true}
                supportedFormats="Supported File format: png, jpeg, WebP"
                maxSize="(Max 10MB)"
                iconClassName="w-6 h-6 mb-2"
              />
            </div>

            {/* Gallery */}
            <div className="flex flex-col gap-1.5">
              <Label className={AUTH_TYPOGRAPHY.label}>Gallery</Label>
              <div className="grid grid-cols-2 gap-3">
                {gallery.map((url, i) => (
                  <div key={i} className="aspect-square w-full">
                    <ImageUpload
                      imageUrl={url}
                      setImage={(imgUrl) => updateGalleryImage(i, imgUrl)}
                      removeImage={() => updateGalleryImage(i, "")}
                      className="h-full w-full"
                      dropzoneClassName="h-full border border-dashed border-[#E2E8F0] rounded-lg bg-transparent hover:bg-slate-50 transition-colors"
                      showSupportedFormats={false}
                      placeholder={null}
                      iconClassName="w-5 h-5"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.form>

        <div className="h-[1px] bg-[#E2E8F0] mx-6 shrink-0" />

        {/* ===== FOOTER (Sticky) ===== */}
        <motion.div variants={itemVariants} className="flex w-full items-center justify-end gap-3 p-6 shrink-0">
          <Button
            variant="ghost"
            onClick={handleClearAll}
            disabled={isSubmitting}
            className={cn(
              BUTTON_STYLES.secondary.md,
              "font-inter text-[14px] font-semibold text-[#0F172B] hover:bg-slate-100 bg-[#F1F5F9]"
            )}
          >
            Clear All
          </Button>
          <Button
            type="submit"
            form="news-poster-form"
            disabled={!isDirty || isSubmitting}
            className={cn(
              BUTTON_STYLES.primary.md,
              "font-inter text-[14px] font-semibold text-white leading-5 px-8"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              initialData ? "Update" : "Create"
            )}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
