"use client";

import React, { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { MoreVertical, Users } from "lucide-react";

import { type CourseDataType, COURSE_STATUS_CONFIG, type ApiCourseStaffMember } from "@/types/course";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUpdateCourseStatus } from "@/hooks/api/courses/useUpdateCourseStatus";

// ===== STAFF CELL =====
function StaffCell({ staffMembers }: { staffMembers: ApiCourseStaffMember[] }) {
  if (!staffMembers || staffMembers.length === 0) {
    return <div className="text-[11px] font-medium text-[#45556C]">-</div>;
  }

  const displayNames = staffMembers
    .map((s) => s.name || "Unknown")
    .filter(Boolean);

  const firstStaff = displayNames[0] ?? "Unknown";
  const remaining = displayNames.length - 1;

  if (displayNames.length === 1) {
    return (
      <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
        {firstStaff}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-default">
            <span className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis max-w-[65px]">
              {firstStaff}
            </span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] font-medium text-[#64748B]">
              <Users className="h-2.5 w-2.5" />
              +{remaining}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[180px] rounded-[6px] border border-[#E2E8F0] bg-white p-2 shadow-md"
        >
          <div className="flex flex-col gap-1">
            {displayNames.map((name, idx) => (
              <span key={idx} className="text-[11px] font-medium text-[#0F172B]">
                {name}
              </span>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface CourseTableProps {
  data: CourseDataType[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}

// ── Helper ─────────────────────────────────────────────────────────────────────
const toTitleCase = (str?: string | null) => {
  if (!str) return "-";
  
  return str
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export function CourseTable({
  data,
  rowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  totalResults,
  onPageChange,
}: CourseTableProps) {
  const itemsPerPage = 10;
  const router = useRouter();

  const filteredData = useMemo(() => data || [], [data]);
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseDataType | null>(null);
  const [targetStatus, setTargetStatus] = useState<"ACTIVE" | "INACTIVE">("INACTIVE");

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useUpdateCourseStatus(selectedCourse?.id || "");

  const handleAction = (action: string, course: CourseDataType) => {
    if (action === "view") {
      router.push(`/admin-panel/course-management/view/${course.id}`);
    } else if (action === "edit") {
      router.push(`/admin-panel/course-management/edit/${course.id}`);
    } else if (action === "preview-manage") {
      router.push(`/admin-panel/course-management/preview-and-manage/${course.id}`);
    } else if (action === "deactivate") {
      setSelectedCourse(course);
      setTargetStatus("INACTIVE");
      setIsStatusModalOpen(true);
    } else if (action === "activate") {
      setSelectedCourse(course);
      setTargetStatus("ACTIVE");
      setIsStatusModalOpen(true);
    }
  };

  const handleStatusUpdateConfirm = async () => {
    if (!selectedCourse) return;

    try {
      await updateStatus({ status: targetStatus });
      setIsStatusModalOpen(false);
      setSelectedCourse(null);
    } catch {
      // Error handled by hook's toast
    }
  };

  const columns: Column<CourseDataType>[] = [
    {
      header: "ID",
      accessorKey: "courseId",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.courseId}
        </div>
      ),
    },
    {
      header: "Course Name",
      accessorKey: "courseName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.courseName}
        </div>
      ),
    },
    {
      header: "C.Category",
      accessorKey: "courseCategory",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.courseCategory}
        </div>
      ),
    },
    {
      header: "Total Enroll",
      accessorKey: "totalEnroll",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[90px] text-center",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap text-center">
          {item.totalEnroll}
        </div>
      ),
    },
    {
      header: "C.Level",
      accessorKey: "courseLevel",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[90px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {toTitleCase(item.courseLevel)}
        </div>
      ),
    },
    {
      header: "C.Type",
      accessorKey: "courseType",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[80px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {toTitleCase(item.courseType)}
        </div>
      ),
    },
    {
      header: "Language",
      accessorKey: "language",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[80px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {toTitleCase(item.language)}
        </div>
      ),
    },
    {
      header: "Staff",
      accessorKey: "staffMembers",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <StaffCell staffMembers={item.staffMembers} />,
    },
    {
      header: "Lecturer",
      accessorKey: "lecturer",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.lecturer}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[90px]",
      cell: (course) => {
        const options = Object.entries(COURSE_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={course.status}
            options={options}
            readOnly
          />
        );
      },
    },
    {
      header: "Last Update",
      accessorKey: "lastUpdate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.lastUpdate}
        </div>
      ),
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis text-right w-[80px]",
      cell: (course) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Course actions"
                title="Course actions"
              >
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem
                onClick={() => handleAction("view", course)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("edit", course)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("preview-manage", course)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Preview & Manage
              </DropdownMenuItem>
              {course.status === "Active" ? (
                <DropdownMenuItem
                  onClick={() => handleAction("deactivate", course)}
                  className="cursor-pointerfocus:bg-[#FDF2F8]"
                >
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleAction("activate", course)}
                  className="cursor-pointer focus:bg-[#FDF2F8]"
                >
                  Activate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={filteredData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        showCheckboxes={false}
        pagination={{
          variant: "simple",
          totalCount: totalResults,
          currentPage,
          totalPages,
          onPageChange,
        }}
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
      />
      <DeleteConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleStatusUpdateConfirm}
        title={targetStatus === "ACTIVE" ? "Confirm Activation" : "Confirm Deactivation"}
        description={
          targetStatus === "ACTIVE"
            ? `Are you sure you want to activate "${selectedCourse?.courseName}"?`
            : `Are you sure you want to deactivate "${selectedCourse?.courseName}"?`
        }
        confirmText={targetStatus === "ACTIVE" ? "Confirm Activation" : "Confirm Deactivation"}
        cancelText="Go Back"
        isDeleting={isUpdatingStatus}
        confirmVariant={targetStatus === "ACTIVE" ? "primary" : "destructive"}
      />
    </>
  );
}
