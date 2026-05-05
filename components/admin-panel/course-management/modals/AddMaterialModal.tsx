import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/common/ImageUpload";
import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

const materialSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type MaterialValues = z.infer<typeof materialSchema>;

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MaterialValues & { file: File | null; url: string }) => void;
  initialData?: (MaterialValues & { url: string }) | null;
}

export function AddMaterialModal({ isOpen, onClose, onSave, initialData }: AddMaterialModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MaterialValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setValue("title", initialData.title);
      setUrl(initialData.url);
    } else if (isOpen && !initialData) {
      reset({ title: "" });
      setUrl("");
      setFile(null);
    }
  }, [isOpen, initialData, setValue, reset]);

  const onSubmit = (data: MaterialValues) => {
    onSave({ ...data, file, url });
    reset();
    setFile(null);
    setUrl("");
    onClose();
  };

  const handleClose = () => {
    reset();
    setFile(null);
    setUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="flex w-full max-w-[480px] flex-col items-start gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden">
        {/* ===== HEADER ===== */}
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold leading-7 text-[#0F172B]">
              {isEditing ? "Edit Material" : "Add New Materials"}
            </DialogTitle>
            <button
              title="Close"
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-sm transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </div>

        {/* ===== BODY ===== */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-1.5">
            <Label className={cn(AUTH_TYPOGRAPHY.label)}>
              Title <span className="text-[#E60076]">*</span>
            </Label>
            <Input
              {...register("title")}
              placeholder="eg: lorem ipsum"
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                errors.title && AUTH_INPUT.error
              )}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="flex w-full flex-col gap-1.5">
            <Label className={cn(AUTH_TYPOGRAPHY.label)}>
              Upload Material
            </Label>
            <ImageUpload 
              imageUrl={url}
              setImage={(uploadedUrl, uploadedFile) => {
                setUrl(uploadedUrl);
                if (uploadedFile) setFile(uploadedFile);
              }}
              removeImage={() => {
                setUrl("");
                setFile(null);
              }}
              placeholder="Click Here to upload or drag and drop here"
              supportedFormats="Supported File format: PDF, DOC, PPTX, MP4"
              accept="*" // Accept any file for material
              className="h-auto"
            />
          </div>

          {/* ===== FOOTER ===== */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!url}
              className={cn(BUTTON_STYLES.primary.full, "w-auto px-6")}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
