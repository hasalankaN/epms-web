"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import type { StudentDataType } from "@/types/student";
import { CERTIFICATE_STATUS_CONFIG, PAYMENT_STATUS_CONFIG, STUDENT_STATUS_CONFIG } from "@/types/student";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CourseStudentTableProps {
  data: StudentDataType[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;

  /** Current course ID for context */
  courseId?: string;

  /** Course name for display */
  courseName?: string;
}

export function CourseStudentTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
  courseId,
  courseName,
}: CourseStudentTableProps) {
  // Suppress unused variable warnings
  void courseId;
  void courseName;

  const itemsPerPage = 10;

  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const newSelection = Object.fromEntries(filteredData.map((item) => [item.id, true]));

      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  };

  const [isDroppedModalOpen, setIsDroppedModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedStudentForAction, setSelectedStudentForAction] = useState<StudentDataType | null>(null);

  const handleConfirmDropped = () => {
    if (selectedStudentForAction) {
      console.log("Confirmed Mark as Dropped:", selectedStudentForAction.id);

      // Implementation for API call would go here
    }

    setIsDroppedModalOpen(false);
    setSelectedStudentForAction(null);
  };

  const handleConfirmDeactivate = () => {
    if (selectedStudentForAction) {
      console.log("Confirmed Deactivate:", selectedStudentForAction.id);

      // Implementation for API call would go here
    }

    setIsDeactivateModalOpen(false);
    setSelectedStudentForAction(null);
  };

  const handleAction = (action: string, student: StudentDataType) => {
    console.log(`Action: ${action}`, student);
    
    switch (action) {
      case "view":
        console.log("View student:", student.id);
        break;
      case "mark-dropped":
        setSelectedStudentForAction(student);
        setIsDroppedModalOpen(true);
        break;
      case "deactivate":
        setSelectedStudentForAction(student);
        setIsDeactivateModalOpen(true);
        break;
      default:
        break;
    }
  };

  const columns: Column<StudentDataType>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={
            selectedRowCount === filteredData.length && filteredData.length > 0
              ? true
              : selectedRowCount > 0
                ? "indeterminate"
                : false
          }
          onCheckedChange={handleSelectAll}
          aria-label="Select all rows"
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      cell: (student) => (
        <Checkbox
          checked={!!rowSelection[student.id]}
          onCheckedChange={(checked) => handleSelectRow(student.id, !!checked)}
          aria-label={`Select ${student.name}`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Enrol. Date",
      accessorKey: "enrollDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.enrollDate}</div>,
    },
    {
      header: "Stu. ID",
      accessorKey: "studentId",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.studentId}</div>,
    },
    {
      header: "Stu. Name",
      accessorKey: "name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</div>,
    },
    {
      header: "Gender",
      accessorKey: "gender",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[80px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.gender}</div>,
    },
    {
      header: "Enrol. Type",
      accessorKey: "enrollType",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.enrollType}</div>,
    },
    {
      header: "Certificate Type",
      accessorKey: "certificateType",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.certificateType}</div>,
    },
    {
      header: "Certificate Status",
      accessorKey: "certificateStatus",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (student) => {
        const options = Object.entries(CERTIFICATE_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={student.certificateStatus}
            options={options}
            readOnly
          />
        );
      },
    },
    {
      header: "Payment Type",
      accessorKey: "paymentType",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.paymentType}</div>,
    },
    {
      header: "Payment Status",
      accessorKey: "paymentStatus",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (student) => {
        const options = Object.entries(PAYMENT_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={student.paymentStatus}
            options={options}
            readOnly
          />
        );
      },
    },
    {
      header: "Stu. Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (student) => {
        const options = Object.entries(STUDENT_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={student.status}
            options={options}
          />
        );
      },
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis text-right w-[80px]",
      cell: (student) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem onClick={() => handleAction("view", student)} className="cursor-pointer focus:bg-[#FDF2F8]">
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("mark-dropped", student)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Mark as Dropped
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("deactivate", student)} className="cursor-pointer focus:bg-[#FDF2F8]">
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
        pagination={{
          variant: "simple",
          totalCount,
          selectedRowCount,
          currentPage,
          totalPages,
          onPageChange: onPageChange,
        }}
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
      />
      
      <DeleteConfirmationModal
        isOpen={isDroppedModalOpen}
        onClose={() => setIsDroppedModalOpen(false)}
        onConfirm={handleConfirmDropped}
        title="Student Enrollment Status Change"
        description="This action will mark this student as having dropped out."
        confirmText="Confirm Action"
        cancelText="Cancel"
        confirmVariant="destructive"
      />

      <DeleteConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleConfirmDeactivate}
        title="Deactivate Student"
        description="This action will deactivate this student. They will no longer have access to the course."
        confirmText="Deactivate"
        cancelText="Cancel"
        confirmVariant="destructive"
      />
    </>
  );
}
