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
import { PaymentHistoryModal, type PaymentHistoryGroup } from "../modals/PaymentHistoryModal";
import { EditReferralMemberModal } from "../modals/EditReferralMemberModal";
import { useUpdateReferralAgentStatus } from "@/hooks/api/referrals/useUpdateReferralAgentStatus";

import type { ReferralAgentDataType } from "@/types/referral";
import { MEMBER_STATUS_CONFIG } from "@/types/user-management";

interface ReferralStaffTableProps {
  data: ReferralAgentDataType[];
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
}

export function ReferralStaffTable({
  data,
  isLoading,
  isError,
  currentPage,
  onPageChange,
  totalResults,
}: ReferralStaffTableProps) {
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReferralAgentDataType | null>(null);
  const [isAgentProfileOpen, setIsAgentProfileOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  const [paymentHistoryData, setPaymentHistoryData] = useState<PaymentHistoryGroup[] | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMemberToEdit, setSelectedMemberToEdit] = useState<ReferralAgentDataType | null>(null);

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateReferralAgentStatus(
    selectedItem?.id || ""
  );

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const handleAction = (action: string, item: ReferralAgentDataType) => {
    if (action === "view") {
      setSelectedAgentId(item.isTeamLeader ? `${item.id}-leader` : item.id);
      setIsAgentProfileOpen(true);

      return;
    }

    if (action === "edit") {
      setSelectedMemberToEdit(item);
      setIsEditModalOpen(true);

      return;
    }

    if (action === "deactivate") {
      setSelectedItem(item);
      setIsDeactivateModalOpen(true);

      return;
    }

    if (action === "payment-history") {
      // Mocked payment history data based on Figma design
      const mockHistory: PaymentHistoryGroup[] = [
        {
          monthYear: "December, 2025",
          transactions: [
            {
              id: "tx-1",
              description: "Referral commission for something",
              courseBatch: "Course A",
              amount: "XXXX.00",
              status: "Pending",
            },
            {
              id: "tx-2",
              description: "Referral commission for something",
              courseBatch: "Course B",
              amount: "XXXX.00",
              status: "Paid",
              paidDate: "2025.12.23",
            },
          ],
        },
      ];

      setPaymentHistoryData(mockHistory);
      setIsPaymentHistoryOpen(true);

      return;
    }

    if (action === "whatsapp") {
      window.open(`https://wa.me/94711234567`, "_blank");

      return;
    }

    console.log(`Action: ${action}`, item);
  };

  const columns: Column<ReferralAgentDataType>[] = [
    {
      header: "Added Date",
      accessorKey: "regDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.regDate}</div>
      ),
    },
    {
      header: "Member ID",
      accessorKey: "idNo",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.idNo}</div>
      ),
    },
    {
      header: "Member Name",
      accessorKey: "name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="relative inline-flex items-center">
          <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap">
            {item.name}
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
      accessorKey: "commissions",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[110px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.commissions}</div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <StatusPopover
          value={item.status}
          options={Object.entries(MEMBER_STATUS_CONFIG).map(([value, config]) => ({
            value,
            bg: config.bg,
            text: config.text,
          }))}
          readOnly
        />
      ),
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
        isError={isError}
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
            updateStatus(
              { status: selectedItem.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
              {
                onSuccess: () => setIsDeactivateModalOpen(false),
              }
            );
          }
        }}
        title={selectedItem?.status === "ACTIVE" ? "Confirm Deactivation" : "Confirm Activation"}
        description={
          selectedItem?.status === "ACTIVE"
            ? `Are you sure you want to deactivate [${selectedItem?.name}]?`
            : `Are you sure you want to activate [${selectedItem?.name}]?`
        }
        confirmText={selectedItem?.status === "ACTIVE" ? "Confirm Deactivation" : "Confirm Activation"}
        confirmVariant={selectedItem?.status === "ACTIVE" ? "destructive" : "primary"}
        isDeleting={isUpdatingStatus}
      />

      <AgentProfileModal
        isOpen={isAgentProfileOpen}
        onClose={() => setIsAgentProfileOpen(false)}
        memberId={selectedAgentId}
      />

      <PaymentHistoryModal
        isOpen={isPaymentHistoryOpen}
        onClose={() => setIsPaymentHistoryOpen(false)}
        historyGroups={paymentHistoryData}
      />

      <EditReferralMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        member={selectedMemberToEdit}
      />
    </>
  );
}
