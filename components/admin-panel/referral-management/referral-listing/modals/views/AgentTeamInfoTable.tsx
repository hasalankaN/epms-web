"use client";

import React, { useMemo, useState } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

export interface AgentTeamInfoDataType {
  id: string;
  createdDate: string;
  memberName: string;
  memberId: string;
  comReceived: string;
}

const mockTeamInfo: AgentTeamInfoDataType[] = Array.from({ length: 4 }, (_, i) => ({
  id: `TI-${i + 1}`,
  createdDate: "2026/01/21",
  memberName: "Name",
  memberId: "#12345",
  comReceived: "XXXX.00",
}));

export function AgentTeamInfoTable() {
  const [data] = useState<AgentTeamInfoDataType[]>(mockTeamInfo);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalResults = data.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const columns: Column<AgentTeamInfoDataType>[] = [
    {
      header: "Created Date",
      accessorKey: "createdDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.createdDate}</div>
      ),
    },
    {
      header: "Member Name",
      accessorKey: "memberName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.memberName}</div>
      ),
    },
    {
      header: "Member ID",
      accessorKey: "memberId",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.memberId}</div>
      ),
    },
    {
      header: "Com. Received",
      accessorKey: "comReceived",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.comReceived}</div>
      ),
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[80px]",
      cell: (item) => (
        <button
          onClick={() => console.log('View team member', item.id)}
          className="text-[11px] font-semibold text-[#F6339A] hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage]);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[14px] font-medium leading-[20px] text-[#1D293D] font-inter">Team Info</h3>
      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        showCheckboxes={false}
        tableContainerClassName="h-auto"
        pagination={{
          variant: "simple",
          totalCount: totalResults,
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
