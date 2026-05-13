"use client";

import React, { useMemo, useState } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { useGetReferralAgentTeam } from "@/hooks/api/referrals/useGetReferralAgentTeam";
import { Skeleton } from "@/components/ui/skeleton";

export interface AgentTeamInfoDataType {
  id: string;
  createdDate: string;
  memberName: string;
  memberId: string;
  comReceived: string;
}

interface AgentTeamInfoTableProps {
  memberId: string | null;
}

export function AgentTeamInfoTable({ memberId }: AgentTeamInfoTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetReferralAgentTeam(memberId, currentPage, 5);

  const tableData: AgentTeamInfoDataType[] = useMemo(() => {
    if (!data?.results) return [];

    return data.results.map((item) => ({
      id: item.id,
      createdDate: item.created_at
        ? new Date(item.created_at)
            .toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "/")
        : "—",
      memberName: item.name || "—",
      memberId: item.member_code || "—",
      comReceived: Number(item.total_commissions_received || 0).toLocaleString(
        "en-US",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      ),
    }));
  }, [data]);

  const columns: Column<AgentTeamInfoDataType>[] = [
    {
      header: "Created Date",
      accessorKey: "createdDate",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.createdDate}
        </div>
      ),
    },
    {
      header: "Member Name",
      accessorKey: "memberName",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.memberName}
        </div>
      ),
    },
    {
      header: "Member ID",
      accessorKey: "memberId",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.memberId}
        </div>
      ),
    },
    {
      header: "Com. Received",
      accessorKey: "comReceived",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.comReceived}
        </div>
      ),
    },
    {
      header: "Action",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[80px]",
      cell: (item) => (
        <button
          onClick={() => console.log("View team member", item.id)}
          className="text-[11px] font-semibold text-[#F6339A] hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-[14px] font-medium leading-[20px] text-[#1D293D] font-inter">
          Team Info
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[14px] font-medium leading-[20px] text-[#1D293D] font-inter">
        Team Info
      </h3>
      <DataTable
        data={tableData}
        columns={columns}
        keyExtractor={(item) => item.id}
        showCheckboxes={false}
        tableContainerClassName="h-auto"
        pagination={{
          variant: "simple",
          totalCount: data?.totalResults || 0,
          currentPage,
          totalPages: data?.totalPages || 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
