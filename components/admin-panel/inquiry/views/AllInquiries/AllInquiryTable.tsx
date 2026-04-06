"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import type { InquiryDataType } from "@/types/inquiry";
import { INQUIRY_STATUS_CONFIG } from "@/types/inquiry";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { InquiryDetailsModal } from "../../modals/InquiryDetailsModal";
import { FollowUpModal } from "../../modals/FollowUpModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface AllInquiryTableProps {
  data: InquiryDataType[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
}

export function AllInquiryTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
  totalCount: externalTotalCount,
}: AllInquiryTableProps) {
  const itemsPerPage = 10;

  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = externalTotalCount ?? filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;


  const paginatedData = useMemo(() => {
    return filteredData;
  }, [filteredData]);

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryDataType | null>(null);

  const handleAction = (action: string, inquiry: InquiryDataType) => {
    console.log(`Action: ${action}`, inquiry);
    
    if (action === "view") {
      setSelectedInquiry(inquiry);
      setIsModalOpen(true);
    } else if (action === "follow-up") {
      setSelectedInquiry(inquiry);
      setIsFollowUpModalOpen(true);
    } else if (action === "delete") {
      setSelectedInquiry(inquiry);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    // Implement actual delete logic (e.g., API call)
    console.log("Deleting inquiry:", selectedInquiry?.id);
    setIsDeleteModalOpen(false);

    // Optionally: clear selection or refresh data
  };


  const columns: Column<InquiryDataType>[] = [
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
      cell: (inquiry) => (
        <Checkbox
          checked={!!rowSelection[inquiry.id]}
          onCheckedChange={(checked) => handleSelectRow(inquiry.id, !!checked)}
          aria-label={`Select ${inquiry.name}`}
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
      header: "Name",
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
      header: "Source",
      accessorKey: "source",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.source}</div>,
    },
    {
      header: "Assignee",
      accessorKey: "assignee",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.assignee}</div>,
    },
    {
      header: "District",
      accessorKey: "district",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.district}</div>,
    },
    {
      header: "Interest",
      accessorKey: "interest",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.interest}</div>,
    },
    {
      header: "Branch",
      accessorKey: "branch",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.branch}</div>,
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (inquiry) => {
        const options = Object.entries(INQUIRY_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
          
        }));

        return (
          <StatusPopover
            value={inquiry.status}
            options={options}

            // readOnly - removed to enable dropdown
          />
        );
      },
    },
    {
      header: "Follow Up",
      accessorKey: "followUp",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.followUp}</div>,
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis text-right w-[80px]",
      cell: (inquiry) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem onClick={() => handleAction("view", inquiry)} className="cursor-pointer focus:bg-[#FDF2F8]">
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("follow-up", inquiry)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Follow-Up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-sms", inquiry)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send SMS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-whatsapp", inquiry)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send Whatsapp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-email", inquiry)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("delete", inquiry)} className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600">
                Delete
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
      <InquiryDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        inquiry={selectedInquiry} 
      />
      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        inquiry={selectedInquiry}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        description="Are you sure you want to delete this enquiry? This action cannot be undone."
      />
    </>
  );
}
