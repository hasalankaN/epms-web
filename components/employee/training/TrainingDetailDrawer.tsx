"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Calendar, Clock, MapPin, Users, Download, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TrainingItem } from "@/types/dto/training.dto";

interface TrainingDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  training: TrainingItem | null;
}

export function TrainingDetailDrawer({
  isOpen,
  onClose,
  training,
}: TrainingDetailDrawerProps) {
  if (!training) return null;

  const handleDownload = (materialName: string) => {
    toast.success(`Downloading ${materialName}...`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Training Session · {training.mode}
            </span>
            <StatusBadge status={training.status} />
          </div>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white pt-1">
            {training.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Schedule & Venue Card */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-pink-600" />
              <div>
                <p className="text-slate-400 text-[10px]">Date</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{training.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-pink-600" />
              <div>
                <p className="text-slate-400 text-[10px]">Time</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {training.startTime} - {training.endTime}
                </p>
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <MapPin className="h-4 w-4 text-pink-600 shrink-0" />
              <div>
                <p className="text-slate-400 text-[10px]">Venue / Location</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{training.venue}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Overview</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              {training.description}
            </p>
          </div>

          {/* Instructors */}
          <div className="space-y-1">
            <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Instructors</p>
            <div className="flex flex-wrap gap-2">
              {training.instructors.map((inst, i) => (
                <span
                  key={i}
                  className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-300 font-medium"
                >
                  {inst}
                </span>
              ))}
            </div>
          </div>

          {/* Training Materials & Handouts */}
          <div className="space-y-2">
            <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
              Course Materials ({training.materials?.length || 0})
            </p>
            {training.materials?.length > 0 ? (
              <div className="space-y-2">
                {training.materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 bg-white dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#E60076]" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{mat.name}</p>
                        <p className="text-[10px] text-slate-400">{mat.type} · {mat.size}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(mat.name)}
                      className="h-7 text-xs gap-1"
                    >
                      <Download className="h-3 w-3" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No downloadable handouts uploaded yet.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

