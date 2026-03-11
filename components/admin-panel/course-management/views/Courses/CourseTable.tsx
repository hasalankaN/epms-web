"use client";

import React, { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { MoreVertical } from "lucide-react";

import type { CourseDataType } from "@/types/course";
import { COURSE_STATUS_CONFIG } from "@/types/course";

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

interface CourseTableProps {
  data: CourseDataType[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function CourseTable({
  data,
  rowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
}: CourseTableProps) {
  const itemsPerPage = 10;

  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseDataType | null>(null);
  const router = useRouter();

  const handleAction = (action: string, course: CourseDataType) => {
    console.log(`Action: ${action}`, course);
    
    if (action === "view") {
      router.push(`/admin-panel/course-management/view/${course.id}`);
    } else if (action === "edit") {
      router.push(`/admin-panel/course-management/edit/${course.id}`);
    } else if (action === "preview-manage") {
      router.push(`/admin-panel/course-management/preview-and-manage/${course.id}`);
    } else if (action === "deactivate") {
      setSelectedCourse(course);
      setIsDeactivateModalOpen(true);
    }
  };

  const handleDeactivateConfirm = () => {
    // Implement actual deactivate logic (e.g., API call)
    console.log("Deactivating course:", selectedCourse?.id);
    setIsDeactivateModalOpen(false);
  };

  const columns: Column<CourseDataType>[] = [
    {
      header: "ID",
      accessorKey: "courseId",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[80px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.courseId}</div>,
    },
    {
      header: "C. Name",
      accessorKey: "courseName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.courseName}</div>,
    },
    {
      header: "C. Category",
      accessorKey: "courseCategory",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.courseCategory}</div>,
    },
    {
      header: "Total Enroll",
      accessorKey: "totalEnroll",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[90px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.totalEnroll}</div>,
    },
    {
      header: "C. Level",
      accessorKey: "courseLevel",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.courseLevel}</div>,
    },
    {
      header: "C. Type",
      accessorKey: "courseType",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[80px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.courseType}</div>,
    },
    {
      header: "Language",
      accessorKey: "language",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[80px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.language}</div>,
    },
    {
      header: "Staff",
      accessorKey: "staff",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.staff}</div>,
    },
    {
      header: "Lecturer",
      accessorKey: "lecturer",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.lecturer}</div>,
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
          />
        );
      },
    },
    {
      header: "Last Update",
      accessorKey: "lastUpdate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.lastUpdate}</div>,
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
              <DropdownMenuItem onClick={() => handleAction("view", course)} className="cursor-pointer focus:bg-[#FDF2F8]">
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("edit", course)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("preview-manage", course)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Preview & Manage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("deactivate", course)} className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600">
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        showCheckboxes={false}
        pagination={{
          variant: "simple",
          totalCount,
          currentPage,
          totalPages,
          onPageChange: onPageChange,
        }}
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
      />
      <DeleteConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Confirm Deactivation"
        description={`Are you sure you want to deactivate [${selectedCourse?.courseName || 'course name'}]?`}
        confirmText="Confirm Deactivation"
        cancelText="Go Back"
        confirmVariant="destructive"
      />
    </>
  );
}
