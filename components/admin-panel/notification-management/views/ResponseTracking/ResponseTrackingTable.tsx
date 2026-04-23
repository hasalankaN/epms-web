"use client";

import { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ===== TYPES =====

export type ResponseStatus = "Responded" | "Pending" | "Over Due";

export interface ResponseTrackingDataType {
  id: string;
  student: string;
  receiver: string;
  sentTime: string;
  responseTime: string;
  duration: string;
  status: ResponseStatus;
}

// ===== STATUS CONFIG =====

const STATUS_CONFIG: Record<ResponseStatus, { bg: string; text: string }> = {
  Responded: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  Pending: { bg: "bg-[#FEF9C3]", text: "text-[#CA8A04]" },
  "Over Due": { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
};

// ===== MOCK DATA =====

const mockData: ResponseTrackingDataType[] = [
  {
    id: "1",
    student: "Alice Johnson",
    receiver: "Dr. Smith",
    sentTime: "10:00 AM",
    responseTime: "10:45 AM",
    duration: "45 mins",
    status: "Responded",
  },
  {
    id: "2",
    student: "Bob Williams",
    receiver: "Prof. Lee",
    sentTime: "11:00 AM",
    responseTime: "—",
    duration: "2 hrs 30 mins",
    status: "Pending",
  },
  {
    id: "3",
    student: "Carol Davis",
    receiver: "Dr. Patel",
    sentTime: "09:00 AM",
    responseTime: "—",
    duration: "5 hrs 10 mins",
    status: "Over Due",
  },
];

// ===== PROPS =====

interface ResponseTrackingTableProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

// ===== COMPONENT =====

export function ResponseTrackingTable({ currentPage, onPageChange }: ResponseTrackingTableProps) {
  const filteredData = useMemo(() => mockData, []);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / 10));

  const columns: Column<ResponseTrackingDataType>[] = [
    {
      header: "Student",
      accessorKey: "student",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[160px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B]">{item.student}</div>
      ),
    },
    {
      header: "Receiver",
      accessorKey: "receiver",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[160px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">{item.receiver}</div>
      ),
    },
    {
      header: "Sent Time",
      accessorKey: "sentTime",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[110px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">{item.sentTime}</div>
      ),
    },
    {
      header: "Response Time",
      accessorKey: "responseTime",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[130px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">{item.responseTime}</div>
      ),
    },
    {
      header: "Duration",
      accessorKey: "duration",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[180px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.duration}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[130px]",
      cell: (item) => {
        const config = STATUS_CONFIG[item.status];

        return (
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold",
              config.bg,
              config.text
            )}
          >
            {item.status}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      keyExtractor={(item) => item.id}
      isLoading={false}
      isError={false}
      pagination={{
        variant: "simple",
        totalCount: filteredData.length,
        currentPage,
        totalPages,
        onPageChange,
      }}
    />
  );
}
