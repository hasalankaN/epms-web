"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { MoreVertical } from "lucide-react";

import type { StudentDataType } from "@/types/user-management";
import { STUDENT_STATUS_CONFIG } from "@/types/user-management";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IssueCertificateModal } from "@/components/common/IssueCertificateModal";
import { IssueDocumentModal } from "@/components/common/IssueDocumentModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface StudentTableProps {
  data: StudentDataType[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
}

export function StudentTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
  totalResults,
}: StudentTableProps) {
  const router = useRouter();
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  };

  // ===== MODAL STATE =====
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDataType | null>(null);

  const handleAction = (action: string, student: StudentDataType) => {
    console.log(`Action: ${action}`, student);

    if (action === "view-profile") {
      router.push(`/admin-panel/user-management/student/${student.id}`);
    } else if (action === "issue-certificate") {
      setSelectedStudent(student);
      setIsCertificateModalOpen(true);
    } else if (action === "issue-documents") {
      setSelectedStudent(student);
      setIsDocumentModalOpen(true);
    } else if (action === "deactivate") {
      setSelectedStudent(student);
      setIsDeactivateModalOpen(true);
    }
  };

  const handleDeactivateConfirm = () => {
    console.log("Deactivating student:", selectedStudent?.id);
    setIsDeactivateModalOpen(false);
  };

  const columns: Column<StudentDataType>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={
            selectedRowCount === data.length && data.length > 0
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
      header: "Date",
      accessorKey: "date",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.date}</div>,
    },
    {
      header: "ID No.",
      accessorKey: "idNo",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.idNo}</div>,
    },
    {
      header: "Stu. Name",
      accessorKey: "name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</div>,
    },
    {
      header: "District",
      accessorKey: "district",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.district}</div>,
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          <i className="phone-outgoing h-4 w-4 text-[#64748B]" /> Phone
        </span>
      ),
      accessorKey: "phone",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.phone}</div>,
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          <i className="whatsapp-logo h-4 w-4 text-[#64748B]" /> WhatsApp
        </span>
      ),
      accessorKey: "whatsApp",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.whatsApp}</div>,
    },
    {
      header: () => <div className="text-center w-full">Payment Status</div>,
      accessorKey: "paymentStatus",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (student) => {
        const isCompleted = student.paymentStatus === "Completed";

        return (
          <div className={`text-[12px] font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis ${isCompleted ? "text-[#16A34A]" : "text-[#FB2C36]"}`}>
             {isCompleted ? "Completed" : `Pending - ${student.paymentPendingAmount}`}
          </div>
        );
      },
    },
    {
      header: () => <div className="text-center w-full">Certificate Status</div>,
      accessorKey: "certificateStatus",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (student) => {
        const isCompleted = student.certificateStatus === "Completed";

        return (
          <div className={`text-[12px] font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis ${isCompleted ? "text-[#16A34A]" : "text-[#FB2C36]"}`}>
             {isCompleted ? "Completed" : `Pending - ${student.pendingCertificates}`}
          </div>
        );
      },
    },
    {
      header: "Commissions",
      accessorKey: "commissions",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.commissions}</div>,
    },
    {
      header: "Student Status",
      accessorKey: "studentStatus",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (student) => {
        const options = Object.entries(STUDENT_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          label: status.charAt(0) + status.slice(1).toLowerCase(), // E.g. ACTIVE -> Active
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={student.studentStatus}
            options={options}
            readOnly
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
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem onClick={() => handleAction("view-profile", student)} className="cursor-pointer focus:bg-[#FDF2F8]">
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-sms", student)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send SMS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-whatsapp", student)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send Whatsapp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-email", student)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("issue-certificate", student)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Issue Certificate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("issue-documents", student)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Issue Documents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("student-report", student)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Student Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("deactivate", student)} className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600">
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
        data={data}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        pagination={{
          variant: "simple",
          totalCount: totalResults,
          selectedRowCount,
          currentPage,
          totalPages,
          onPageChange: onPageChange,
        }}
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
      />
      <IssueCertificateModal
        open={isCertificateModalOpen}
        onOpenChange={setIsCertificateModalOpen}
      />
      <IssueDocumentModal
        open={isDocumentModalOpen}
        onOpenChange={setIsDocumentModalOpen}
      />

      {/* Deactivate Student Modal */}
      <DeleteConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Confirm Deactivation"
        description={`Are you sure you want to deactivate this student [${selectedStudent?.name}]?`}
        confirmText="Confirm Deactivation"
        confirmVariant="destructive"
      />
    </>
  );
}
