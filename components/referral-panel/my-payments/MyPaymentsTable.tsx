"use client";

import React, { useMemo, useState } from "react";

import type { Column } from "@/components/common/table/DataTable";
import { DataTable  } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import { ViewSlipModal } from "@/components/admin-panel/approvals/bank-transfers/modals/ViewSlipModal";
import { Checkbox } from "@/components/ui/checkbox";

import type { PaymentDataType} from "@/types/payment";
import { PAYMENT_STATUS_CONFIG } from "@/types/payment";

interface MyPaymentsTableProps {
  data: PaymentDataType[];
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
}

export function MyPaymentsTable({
  data,
  isLoading,
  isError,
  currentPage,
  onPageChange,
  totalResults,
}: MyPaymentsTableProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string | undefined>(undefined);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelection = Object.fromEntries(paginatedData.map((item) => [item.id, true]));

      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  };

  const handleViewSlip = (url?: string | null) => {
    setSelectedSlipUrl(url ?? undefined);
    setIsViewModalOpen(true);
  };

  const columns: Column<PaymentDataType>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={selectedRowCount === paginatedData.length && paginatedData.length > 0}
          onCheckedChange={(checked) => handleSelectAll(!!checked)}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
          aria-label="Select all"
        />
      ),
      cell: (item) => (
        <Checkbox
          checked={!!rowSelection[item.id]}
          onCheckedChange={(checked) => handleSelectRow(item.id, !!checked)}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
          aria-label="Select row"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Requested Date",
      accessorKey: "requestedDate",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.requestedDate}</div>
      ),
    },
    {
      header: "Requested Amount",
      accessorKey: "requestedAmount",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.requestedAmount}</div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[120px]",
      cell: (item) => (
        <StatusPopover
          value={item.status}
          options={Object.entries(PAYMENT_STATUS_CONFIG).map(([value, config]) => ({
            value,
            bg: config.bg,
            text: config.text,
          }))}
          readOnly
        />
      ),
    },
    {
      header: "Paid Date",
      accessorKey: "paidDate",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.paidDate || "—"}</div>
      ),
    },
    {
      header: "Paid Amount",
      accessorKey: "paidAmount",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.paidAmount || "—"}</div>
      ),
    },
    {
      header: "Evidence",
      accessorKey: "evidenceUrl",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap text-center w-[100px]",
      cell: (item) => (
        <button
          onClick={() => handleViewSlip(item.evidenceUrl)}
          disabled={!item.evidenceUrl}
          className="text-[12px] font-semibold text-[#E60076] hover:underline whitespace-nowrap bg-transparent border-none p-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={paginatedData}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        showCheckboxes={true}
        keyExtractor={(item) => item.id}
        pagination={{
          variant: "simple",
          totalCount: totalResults,
          currentPage,
          totalPages,
          onPageChange,
          selectedRowCount,
          itemsPerPage,
        }}
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
      />

      <ViewSlipModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        imageUrl={selectedSlipUrl}
      />
    </>
  );
}
