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
import { AgentProfileModal } from "../modals/AgentProfileModal";

import type { ReferralStaffDataType } from "../ReferralStaffTab";

const STATUS_CONFIG = {
  Active: { bg: "#D9E9FF", text: "#2563EB" },
  Inactive: { bg: "#F1F5F9", text: "#000000" },
};

interface ReferralStaffTableProps {
  data: ReferralStaffDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
}

export function ReferralStaffTable({
  data,
  currentPage,
  onPageChange,
  totalResults,
}: ReferralStaffTableProps) {
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReferralStaffDataType | null>(null);
  const [isAgentProfileOpen, setIsAgentProfileOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const handleAction = (action: string, item: ReferralStaffDataType) => {
    if (action === "view") {
      setSelectedAgentId(item.id);

      // Determine if mocked as team leader in mock data to pass "leader" ID if needed, 
      // but in real app ID handles it. Let's pass the real ID but add 'leader' if isTeamLeader is true
      setSelectedAgentId(item.isTeamLeader ? `${item.id}-leader` : item.id);
      setIsAgentProfileOpen(true);

      return;
    }

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

  const columns: Column<ReferralStaffDataType>[] = [
    {
      header: "Added Date",
      accessorKey: "addedDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.addedDate}</div>
      ),
    },
    {
      header: "Member ID",
      accessorKey: "memberId",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.memberId}</div>
      ),
    },
    {
      header: "Member Name",
      accessorKey: "memberName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="relative inline-flex items-center">
          <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap">
            {item.memberName}
          </div>
          {item.isTeamLeader && (
            <div className="absolute -top-[15px] -right-[14px] flex items-center justify-center gap-1 rounded-[32px] bg-black px-2 py-[2px] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.10)] text-center font-inter text-[8px] font-medium leading-[11px] text-white">
              Team Leader
            </div>
          )}
        </div>
      ),
    },
    {
      header: "District",
      accessorKey: "district",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.district}</div>
      ),
    },
    {
      header: "No.of Students",
      accessorKey: "noOfStudents",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.noOfStudents}</div>
      ),
    },
    {
      header: "No.of Products",
      accessorKey: "noOfProducts",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.noOfProducts}</div>
      ),
    },
    {
      header: "Com. Total",
      accessorKey: "comTotal",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[110px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.comTotal}</div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => {
        const options = Object.entries(STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={item.status}
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
            <DropdownMenuContent align="end" className="min-w-[150px]">
              <DropdownMenuItem
                onClick={() => handleAction("view", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("edit", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("whatsapp", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Whatsapp
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("payment-history", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Payment History
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("deactivate", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                {item.status === "Active" ? "Deactivate" : "Activate"}
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
          setIsDeactivateModalOpen(false);
        }}
        title={selectedItem?.status === "Active" ? "Confirm Deactivation" : "Confirm Activation"}
        description={
          selectedItem?.status === "Active"
            ? `Are you sure you want to deactivate [${selectedItem?.memberName}]?`
            : `Are you sure you want to activate [${selectedItem?.memberName}]?`
        }
        confirmText={selectedItem?.status === "Active" ? "Confirm Deactivation" : "Confirm Activation"}
        confirmVariant={selectedItem?.status === "Active" ? "destructive" : "primary"}
        isDeleting={false}
      />

      <AgentProfileModal
        isOpen={isAgentProfileOpen}
        onClose={() => setIsAgentProfileOpen(false)}
        memberId={selectedAgentId}
      />
    </>
  );
}
