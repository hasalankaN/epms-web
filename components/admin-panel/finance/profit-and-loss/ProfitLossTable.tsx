"use client";

import React, { useState } from "react";

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

import { IncomeExpenseReportModal } from "./IncomeExpenseReportModal";
import type { PnlEntity, PnlSource } from "@/hooks/api/finances/useGetPnlData";

export type { PnlEntity as ProfitLossTableDataType };

interface ProfitLossTableProps {
  data: PnlEntity[];
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const formatCurrency = (val: string | number) => {
  const n = typeof val === "string" ? Number(val) : val;

  return `LKR ${n.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export function ProfitLossTable({
  data,
  isLoading = false,
  isError = false,
  currentPage,
  totalCount,
  totalPages,
  onPageChange,
}: ProfitLossTableProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const [selectedEntity, setSelectedEntity] = useState<{
    sourceType: PnlSource;
    sourceId: string;
    sourceName: string;
  } | null>(null);

  const handleView = (row: PnlEntity) => {
    setSelectedEntity({
      sourceType: row.source_type,
      sourceId: row.source_id,
      sourceName: row.source_name,
    });
    setReportModalOpen(true);
  };

  const columns: Column<PnlEntity>[] = [
    {
      header: "Description",
      accessorKey: "source_name",
      className:
        "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[250px]",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">
            {item.source_name}
          </span>
          <span className="text-[10px] text-[#94A3B8]">{item.source_type}</span>
        </div>
      ),
    },
    {
      header: "Total Income",
      accessorKey: "total_income",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {formatCurrency(item.total_income)}
        </div>
      ),
    },
    {
      header: "Total Expenses",
      accessorKey: "total_expenses",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {formatCurrency(item.total_expenses)}
        </div>
      ),
    },
    {
      header: "Profit or Loss",
      accessorKey: "status",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => (
        <StatusPopover
          value={item.status === "PROFIT" ? "Profited" : "Loss"}
          options={[
            { value: "Profited", bg: "#DFFFF0", text: "#16A34A" },
            { value: "Loss", bg: "#FFDEDE", text: "#FB2C36" },
          ]}
          readOnly
        />
      ),
    },
    {
      header: "Action",
      className:
        "px-4 py-2 text-[13px] font-semibold text-[#1D293D] text-right w-[80px]",
      cell: (item) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem
                onClick={() => handleView(item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                View
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
        keyExtractor={(item) => item.source_id}
        isLoading={isLoading}
        isError={isError}
        tableContainerClassName="overflow-auto"
        pagination={{
          variant: "simple",
          totalCount,
          selectedRowCount: 0,
          currentPage,
          totalPages,
          onPageChange,
        }}
      />

      {selectedEntity && (
        <IncomeExpenseReportModal
          isOpen={reportModalOpen}
          onClose={() => {
            setReportModalOpen(false);
            setSelectedEntity(null);
          }}
          sourceType={selectedEntity.sourceType}
          sourceId={selectedEntity.sourceId}
          sourceName={selectedEntity.sourceName}
        />
      )}
    </>
  );
}
