"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { useToggleReferralStudentStatus } from "@/hooks/api/referrals/useToggleReferralStudentStatus";

import type { StudentReferralDataType } from "../StudentReferralsTab";

const STATUS_CONFIG = {
  ACTIVE: { bg: "#D9E9FF", text: "#2563EB" },
  INACTIVE: { bg: "#F1F5F9", text: "#000000" },
};

interface StudentReferralsTableProps {
  data: StudentReferralDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  isLoading?: boolean;
}

export function StudentReferralsTable({
  data,
  currentPage,
  onPageChange,
  totalResults,
  isLoading,
}: StudentReferralsTableProps) {
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StudentReferralDataType | null>(null);

  const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleReferralStudentStatus();

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const handleAction = (action: string, item: StudentReferralDataType) => {
    if (action === "deactivate") {
      setSelectedItem(item);
      setIsDeactivateModalOpen(true);

      return;
    }

    if (action === "whatsapp") {
      window.open(`https://wa.me/94711234567`, "_blank");

      return;
    }

    console.log(`Action: ${action}`, item);
  };

  const columns: Column<StudentReferralDataType>[] = [
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[180px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap">{item.studentName}</div>
      ),
    },
    {
      header: "No.of Students",
      accessorKey: "noOfStudents",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[130px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.noOfStudents}</div>
      ),
    },
    {
      header: "No.of Products",
      accessorKey: "noOfProducts",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[130px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.noOfProducts}</div>
      ),
    },
    {
      header: "Com. Total",
      accessorKey: "comTotal",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.comTotal}</div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => {
        const statusKey = item.status === "ACTIVE" || item.status === "INACTIVE"
          ? item.status
          : item.status === "Active" ? "ACTIVE" : "INACTIVE";
        const options = Object.entries(STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={statusKey}
            options={options}
            readOnly
          />
        );
      },
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap text-right w-[80px]",
      cell: (item) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[130px]">
              <DropdownMenuItem
                onClick={() => handleAction("view", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("whatsapp", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Whatsapp
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("deactivate", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >           
                {item.status === "ACTIVE" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => data || [], [data]);

  return (
    <>
      <DataTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        pagination={{
          variant: "simple",
          totalCount: totalResults,
          currentPage,
          totalPages,
          onPageChange,
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={() => {
          if (selectedItem) {
            toggleStatus(selectedItem.id, {
              onSuccess: () => setIsDeactivateModalOpen(false),
            });
          }
        }}
        title={selectedItem?.status === "ACTIVE" ? "Confirm Deactivation" : "Confirm Activation"}
        description={
          selectedItem?.status === "ACTIVE"
            ? `Are you sure you want to deactivate [${selectedItem?.studentName}]?`
            : `Are you sure you want to activate [${selectedItem?.studentName}]?`
        }
        confirmText={selectedItem?.status === "ACTIVE" ? "Confirm Deactivation" : "Confirm Activation"}
        confirmVariant={selectedItem?.status === "ACTIVE" ? "destructive" : "primary"}
        isDeleting={isTogglingStatus}
      />
    </>
  );
}
