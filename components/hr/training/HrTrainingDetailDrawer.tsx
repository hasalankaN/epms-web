"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Download, FileText, CheckCircle2, XCircle, Users, Calendar, MapPin } from "lucide-react";
import type { TrainingItem } from "@/types/dto/training.dto";
import { toast } from "sonner";

interface HrTrainingDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training: TrainingItem | null;
}

export function HrTrainingDetailDrawer({
  open,
  onOpenChange,
  training,
}: HrTrainingDetailDrawerProps) {
  if (!training) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">{training.name}</DialogTitle>
            <StatusBadge status={training.status} />
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Overview */}
          <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-lg border bg-muted/20">
            <div>
              <span className="text-muted-foreground">Session Date & Time</span>
              <p className="font-semibold text-foreground mt-0.5">
                {training.date} ({training.startTime} - {training.endTime})
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Venue & Mode</span>
              <p className="font-semibold text-foreground mt-0.5">
                {training.venue} ({training.mode})
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Instructors</span>
              <p className="font-semibold text-foreground mt-0.5">
                {training.instructors?.join(", ") || "Technical Trainer"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Allocated Budget</span>
              <p className="font-semibold text-[#E60076] mt-0.5">
                Rs. {training.budget?.toLocaleString() || "65,000"}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{training.description}</p>

          {/* Participants Roll */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Participants Roll ({training.participants?.length || 5} Enrolled)</span>
            </h4>
            <div className="p-3 rounded-lg border bg-card space-y-2 max-h-44 overflow-y-auto text-xs">
              {(
                training.participants || [
                  { employeeId: "EMP-001", employeeName: "Kavinda Perera", employeeCode: "EMP-001", departmentName: "Production", attendance: "ATTENDED", evaluated: true },
                  { employeeId: "EMP-002", employeeName: "Nuwan Disanayake", employeeCode: "EMP-002", departmentName: "QA", attendance: "ATTENDED", evaluated: true },
                  { employeeId: "EMP-003", employeeName: "Sanduni Jayawardena", employeeCode: "EMP-003", departmentName: "Sewing", attendance: "ATTENDED", evaluated: false },
                  { employeeId: "EMP-004", employeeName: "Thilina Fernando", employeeCode: "EMP-004", departmentName: "Maintenance", attendance: "ABSENT", evaluated: false },
                ]
              ).map((p: any) => (
                <div key={p.employeeId} className="flex justify-between items-center pb-1.5 border-b last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-foreground">{p.employeeName}</p>
                    <p className="text-[11px] text-muted-foreground">{p.employeeCode} • {p.departmentName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.attendance} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Materials */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Session Course Materials</h4>
            <div className="space-y-1.5">
              {(training.materials || [
                { id: "m1", name: "Lean_Manufacturing_Guide_2026.pdf", size: "2.4 MB" },
                { id: "m2", name: "Standard_Operating_Procedures.pdf", size: "1.1 MB" },
              ]).map((m: any) => (
                <div key={m.id} className="flex justify-between items-center p-2 rounded-lg border bg-muted/10 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#E60076]" />
                    <span className="font-medium">{m.name}</span>
                    <span className="text-[11px] text-muted-foreground">({m.size})</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-[#E60076]"
                    onClick={() => toast.success(`Downloading ${m.name}...`)}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

