import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

// Schema
const categorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
});

type CategoryValues = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: { id: string; categoryName: string } | null;
}

export function AddCategoryModal({ isOpen, onClose, category }: AddCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
    },
  });

  // Reset form when modal opens or category changes
  useEffect(() => {
    if (isOpen) {
      setValue("categoryName", category?.categoryName || "");
    }
  }, [isOpen, category, setValue]);

  const onSubmit = async (data: CategoryValues) => {
    setIsSubmitting(true);

    try {
      // TODO: Implement API call
      if (isEditing) {
        console.log("Updating category:", { id: category.id, ...data });
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Category updated successfully");
      } else {
        console.log("Creating category:", data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Category created successfully");
      }

      reset();
      onClose();
    } catch (error) {
      toast.error(isEditing ? "Failed to update category" : "Failed to create category");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="flex w-full max-w-[480px] flex-col items-start gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden">
        {/* ===== HEADER ===== */}
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold leading-7 text-[#0F172B]">
              {isEditing ? "Rename Category" : "Create New Category"}
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
              Enter Category Name <span className="text-[#E60076]">*</span>
            </Label>
            <Input
              {...register("categoryName")}
              placeholder="eg. Category Name"
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                errors.categoryName && AUTH_INPUT.error
              )}
            />
            {errors.categoryName && (
              <p className="text-xs text-red-500">{errors.categoryName.message}</p>
            )}
          </div>

          {/* ===== FOOTER ===== */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(BUTTON_STYLES.primary.full, "w-auto px-6")}
            >
              {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update" : "Create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
