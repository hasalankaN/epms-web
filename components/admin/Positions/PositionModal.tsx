"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, Calendar, AlignLeft, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CreatePositionDto } from "@/types/dto/position.dto";

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePositionDto) => Promise<void> | void;
  isLoading?: boolean;
}

export function PositionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: PositionModalProps) {
  const [positionName, setPositionName] = useState("");
  const [description, setDescription] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setPositionName("");
      setDescription("");
      // Default to today
      setEffectiveDate(new Date().toISOString().split("T")[0]);
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!positionName.trim()) {
      errs.positionName = "Position / Role name is required";
    } else if (positionName.length > 100) {
      errs.positionName = "Position name must be less than 100 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      positionName: positionName.trim(),
      description: description.trim() || undefined,
      effectiveDate: effectiveDate || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Create New Role / Position
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Define a job title, responsibilities, and effective commencement date.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Position Name */}
          <div className="space-y-1.5">
            <Label htmlFor="positionName" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Position Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="positionName"
                placeholder="e.g. Senior Software Engineer, Operations Manager"
                value={positionName}
                onChange={(e) => {
                  setPositionName(e.target.value);
                  if (errors.positionName) setErrors((prev) => ({ ...prev, positionName: "" }));
                }}
                className={`pl-9 text-xs h-10 ${
                  errors.positionName ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                disabled={isLoading}
                maxLength={100}
              />
            </div>
            {errors.positionName && (
              <p className="text-[11px] text-red-500 font-medium">{errors.positionName}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="posDescription" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Description & Scope
            </Label>
            <div className="relative">
              <Textarea
                id="posDescription"
                placeholder="Detailed duties, scope of responsibility, leadership duties…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="text-xs resize-none"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Effective Date */}
          <div className="space-y-1.5">
            <Label htmlFor="effectiveDate" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Effective Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="effectiveDate"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="pl-9 text-xs h-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="text-xs h-9 bg-purple-600 hover:bg-purple-500 text-white min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Position"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
