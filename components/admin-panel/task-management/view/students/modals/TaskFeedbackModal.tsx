import React, { useState } from "react";

import { Download, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";
import type { TaskSubmissionRow } from "@/components/admin-panel/task-management/view/students/TaskSubmissionTable";
import { useGiveTaskFeedback } from "@/hooks/api/tasks/useGiveTaskFeedback";

interface TaskFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  submission: TaskSubmissionRow | null;
}

export function TaskFeedbackModal({
  isOpen,
  onClose,
  taskId,
  submission,
}: TaskFeedbackModalProps) {
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");

  const giveFeedback = useGiveTaskFeedback(taskId);

  if (!submission) return null;

  const handleClose = () => {
    setScore("");
    setFeedback("");
    onClose();
  };

  const handleSubmit = () => {
    if (!submission.submissionId) {
      // Cannot give feedback on a pending submission that hasn't been submitted yet
      return;
    }

    giveFeedback.mutate(
      {
        submissionId: submission.submissionId,
        payload: {
          score: score || undefined,
          feedback: feedback || undefined,
        },
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        className="flex w-[95%] max-w-[451px] max-h-[90vh] flex-col gap-0 rounded-[8px] border border-[#E4E4E7] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] outline-none [&>button]:hidden text-left overflow-hidden"
      >
        {/* Header (Static) */}
        <div className="flex flex-col items-start self-stretch gap-[14px] p-6 pb-0">
          <div className="flex items-center justify-between self-stretch">
            <DialogTitle className="font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
              Task feedback
            </DialogTitle>
            <button
              title="Close"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-100"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0] w-full" />
        </div>

        {/* Scrollable Middle Section */}
        <div className="flex flex-col flex-1 overflow-y-auto p-6 pt-4 gap-4 custom-scrollbar">

        {/* User Summary */}
        <div className="flex items-start gap-4 self-stretch w-full mb-0">
          <div 
            className="w-16 h-16 shrink-0 rounded-full border border-gray-200 bg-gray-300 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.studentName.replace(/\s+/g, '')})` }}
          />
          <div className="flex flex-col text-left justify-center pb-1">
             <h3 className="text-base font-semibold text-[#1D293D] font-inter leading-[24px]">{submission.studentName}</h3>
             <p className="text-xs font-normal text-[#45556C] font-inter leading-[16px]">{submission.id}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-[#E2E8F0] w-full" />

        {/* Download Submission Button */}
        {submission.files && submission.files.length > 0 && (
          <div className="w-full flex justify-start">
              <button
                  className={cn(
                      BUTTON_STYLES.outline.md,
                      "font-inter font-semibold text-[14px] leading-[20px] shadow-sm bg-white"
                  )}
                  onClick={() => {
                    if (submission.files && submission.files.length > 0) {
                      window.open(submission.files[0].file_url, "_blank");
                    }
                  }}
              >
                  <Download className="w-[18px] h-[18px] text-[#0F172B]" />
                  Download Submission
              </button>
          </div>
        )}

        {/* Input Fields */}
        <div className="flex flex-col gap-8 w-full mt-2">
            {/* Score */}
            <div className="flex flex-col gap-1.5 w-full">
                <label className={cn(AUTH_TYPOGRAPHY.label, "font-inter")}>
                    Score
                </label>
                <Input
                    type="text"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className={cn(AUTH_INPUT.base, "font-inter")}
                />
            </div>

            {/* Feedback */}
            <div className="flex flex-col gap-1.5 w-full">
                <label className={cn(AUTH_TYPOGRAPHY.label, "font-inter")}>
                    Feedback <span className={AUTH_TYPOGRAPHY.required}>*</span>
                </label>
                <textarea
                    title="Feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className={cn(
                       "flex min-h-[120px] w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#0F172B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E60076] disabled:cursor-not-allowed disabled:opacity-50 resize-none font-inter",
                       AUTH_INPUT.placeholder
                    )}
                />
            </div>
        </div>
        </div> {/* End Scrollable Middle Section */}

        {/* Footer (Static Action Button) */}
        <div className="w-full flex justify-end p-6 pt-4 border-t border-[#E2E8F0] mt-auto">
             <button
                 onClick={handleSubmit}
                 disabled={giveFeedback.isPending || !submission.submissionId}
                 className={cn(
                    BUTTON_STYLES.primary.md,
                    "font-inter font-semibold text-[14px] leading-[20px] text-white",
                    (!submission.submissionId || giveFeedback.isPending) && "opacity-50 cursor-not-allowed"
                 )}
             >
                 {giveFeedback.isPending ? "Sending..." : "Send Feedback"}
             </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
