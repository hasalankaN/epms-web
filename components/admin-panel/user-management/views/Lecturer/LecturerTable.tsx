"use client";

import React, { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { MoreVertical } from "lucide-react";

import type { LecturerDataType } from "@/types/user-management";
import {
  SALARY_STATUS_CONFIG,
  MEMBER_STATUS_CONFIG,
} from "@/types/user-management";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LecturerPaymentHistoryModal } from "@/components/admin-panel/user-management/modals/lecturer/LecturerPaymentHistoryModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { useUpdateLecturerStatus } from "@/hooks/api/lecturers/useUpdateLecturerStatus";
import { EditLecturerModal } from "@/components/admin-panel/user-management/modals/lecturer/EditLecturerModal";


interface LecturerTableProps {
  data: LecturerDataType[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
}

export function LecturerTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
  totalResults,
}: LecturerTableProps) {
  const router = useRouter();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentModalLecturerId, setPaymentModalLecturerId] = useState<string | null>(null);
  const [paymentModalLecturerName, setPaymentModalLecturerName] = useState<string | undefined>();
  
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<LecturerDataType | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLecturerId, setEditLecturerId] = useState<string | null>(null);

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateLecturerStatus();

  const itemsPerPage = 10;

  const filteredData = useMemo(() => data || [], [data]);
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

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

  const handleAction = (action: string, lecturer: LecturerDataType) => {
    if (action === "view-lecturer") {
      router.push(`/admin-panel/user-management/lecturer/${lecturer.id}`);

      return;
    } else if (action === "edit") {
      setEditLecturerId(lecturer.id);
      setIsEditModalOpen(true);

      return;
    } else if (action === "payment-history") {
      setPaymentModalLecturerId(lecturer.id);
      setPaymentModalLecturerName(lecturer.name);
      setPaymentModalOpen(true);

      return;
    } else if (action === "deactivate" || action === "activate") {
      setSelectedLecturer(lecturer);
      setIsDeactivateModalOpen(true);

      return;
    }

    console.log(`Action: ${action}`, lecturer);
  };

  const handleDeactivateConfirm = () => {
    if (!selectedLecturer) return;

    const newStatus = selectedLecturer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    updateStatus(
      { id: selectedLecturer.id, status: newStatus },
      {
        onSuccess: () => {
          setIsDeactivateModalOpen(false);
        },
      }
    );
  };

  const columns: Column<LecturerDataType>[] = [
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
      cell: (lecturer) => (
        <Checkbox
          checked={!!rowSelection[lecturer.id]}
          onCheckedChange={(checked) => handleSelectRow(lecturer.id, !!checked)}
          aria-label={`Select ${lecturer.name}`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Reg. Date",
      accessorKey: "regDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.regDate}</div>,
    },
    {
      header: "ID No.",
      accessorKey: "idNo",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.idNo}</div>,
    },
    {
      header: "Lec. Name",
      accessorKey: "name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</div>,
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          <i className="phone-outgoing h-4 w-4 text-[#64748B]" /> Phone
        </span>
      ),
      accessorKey: "phone",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => (
        item.phone && item.phone !== "-" ? (
          <a
            href={`tel:${item.phone}`}
            className="text-[11px] font-medium text-[#45556C] transition-colors hover:text-[#E60076]"
          >
            {item.phone}
          </a>
        ) : (
          <span className="text-[11px] font-medium text-[#45556C]">{item.phone || "-"}</span>
        )
      ),
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          <i className="whatsapp-logo h-4 w-4 text-[#64748B]" /> WhatsApp
        </span>
      ),
      accessorKey: "whatsApp",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => (
        item.whatsApp && item.whatsApp !== "-" ? (
          <a
            href={`https://wa.me/${item.whatsApp.replace(/\s+/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-[#45556C] transition-colors hover:text-[#E60076]"
          >
            {item.whatsApp}
          </a>
        ) : (
          <span className="text-[11px] font-medium text-[#45556C]">{item.whatsApp || "-"}</span>
        )
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[160px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.email}</div>,
    },
    {
      header: "Salary Type",
      accessorKey: "salaryType",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.salaryType
            .toLowerCase()
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </div>
      ),
    },
    {
      header: "Salary Status",
      accessorKey: "salaryStatus",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (lecturer) => {
        const options = Object.entries(SALARY_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={lecturer.salaryStatus}
            options={options}
            readOnly
          />
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (lecturer) => {
        const options = Object.entries(MEMBER_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={lecturer.status}
            options={options}
            readOnly
          />
        );
      },
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis text-right w-[80px]",
      cell: (lecturer) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem onClick={() => handleAction("view-lecturer", lecturer)} className="cursor-pointer focus:bg-[#FDF2F8]">
                View Lecturer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-sms", lecturer)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send SMS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-whatsapp", lecturer)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send Whatsapp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-email", lecturer)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("edit", lecturer)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("payment-history", lecturer)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Payment History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("lecturer-report", lecturer)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Lecturer Report
              </DropdownMenuItem>
              {lecturer.status === "ACTIVE" ? (
                <DropdownMenuItem
                  onClick={() => handleAction("deactivate", lecturer)}
                  className="cursor-pointer focus:bg-[#FDF2F8]"
                >
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleAction("activate", lecturer)}
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

      <LecturerPaymentHistoryModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        lecturerId={paymentModalLecturerId}
        lecturerName={paymentModalLecturerName}
      />

      {/* Edit Lecturer Modal */}
      <EditLecturerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lecturerId={editLecturerId}
      />

      {/* Deactivate/Activate Lecturer Modal */}
      <DeleteConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title={selectedLecturer?.status === "ACTIVE" ? "Confirm Deactivation" : "Confirm Activation"}
        description={`Are you sure you want to ${selectedLecturer?.status === "ACTIVE" ? "deactivate" : "activate"} this lecturer [${selectedLecturer?.name}]?`}
        confirmText={selectedLecturer?.status === "ACTIVE" ? "Confirm Deactivation" : "Confirm Activation"}
        confirmVariant={selectedLecturer?.status === "ACTIVE" ? "destructive" : "primary"}
        isDeleting={isUpdatingStatus}
      />
    </>
  );
}
