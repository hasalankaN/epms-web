"use client";

import { useState } from "react";

import { MoreVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewAssessmentModal } from "./ViewAssessmentModal";

interface Assignment {
  id: string;
  title: string;
  courseName: string;
  batchName: string;
  dueDate: string;
  totalMarks: number;
  submittedCount: number;
  totalStudents: number;
  status: "Active" | "Closed" | "Draft";
}

interface AssignmentTableProps {
  assignments: Assignment[];
}

export function AssignmentTable({ assignments }: AssignmentTableProps) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const statusStyles: Record<string, string> = {
    Active: "bg-[#DCFCE7] text-[#16A34A]",
    Closed: "bg-[#FEF2F2] text-[#DC2626]",
    Draft: "bg-[#F1F5F9] text-[#64748B]",
  };

  return (
    <>
      <div className="overflow-hidden rounded-[10px] border border-[#E2E8F0]">
      <table className="w-full text-left">
        <thead className="bg-[#FFF1F8] text-[12px] font-bold text-[#0F172B]">
          <tr>
            <th className="px-6 py-3.5">Assignment Title</th>
            <th className="px-6 py-3.5">Course / Batch</th>
            <th className="px-6 py-3.5">Due Date</th>
            <th className="px-6 py-3.5">Submissions</th>
            <th className="px-6 py-3.5">Total Marks</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#F1F5F9]">
          {assignments.map((assignment) => {
            const submissionPct = Math.round((assignment.submittedCount / assignment.totalStudents) * 100);

            return (
              <tr key={assignment.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-6 py-4 text-[13px] font-medium text-[#0F172B]">
                  {assignment.title}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-[#0F172B]">{assignment.courseName}</span>
                    <span className="text-[11px] text-[#90A1B9]">{assignment.batchName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-[#45556C]">{assignment.dueDate}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-[#45556C]">
                        {assignment.submittedCount}/{assignment.totalStudents}
                      </span>
                      <span className="text-[11px] text-[#90A1B9]">{submissionPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${submissionPct}%`,
                          background: "linear-gradient(90deg, #EC4899 0%, #F472B6 100%)",
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] font-semibold text-[#0F172B]">
                  {assignment.totalMarks}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                    statusStyles[assignment.status]
                  )}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          type="button"
                          className="text-[#90A1B9] hover:text-[#0b5cff] p-1.5 bg-[#f8fafc] rounded-full transition-colors flex items-center justify-center border-0 outline-none"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="w-[136px] min-w-[128px] p-1 bg-white border-[#E5E7EB] rounded-[6px] shadow-lg animate-in fade-in-0 zoom-in-95"
                      >
                        <DropdownMenuItem 
                          id={`view_assignment_${assignment.id}`}
                          className="h-[30px] px-2 flex items-center gap-2 text-[12px] text-[#314158] font-normal rounded-[6px] hover:bg-slate-100 transition-colors cursor-pointer focus:bg-slate-100 focus:outline-none"
                          onSelect={(e) => {
                            e.preventDefault();
                            setSelectedAssignment(assignment);
                            setViewModalOpen(true);
                          }}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          id={`edit_assignment_${assignment.id}`}
                          className="h-[30px] px-2 flex items-center gap-2 text-[12px] text-[#314158] font-normal rounded-[6px] hover:bg-slate-100 transition-colors cursor-pointer focus:bg-slate-100 focus:outline-none"
                          onClick={() => { /* Handle edit */ }}
                        >
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {selectedAssignment && (
      <ViewAssessmentModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedAssignment(null);
        }}
      />
    )}
    </>
  );
}
