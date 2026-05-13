"use client";

import React, { useMemo, useState } from "react";

import { X } from "lucide-react";

import { BUTTON_STYLES } from "@/lib/constants/theme";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetReferralAgentBatches } from "@/hooks/api/referrals/useGetReferralAgentBatches";

export interface AgentBatchEnrollmentDataType {
  id: string;
  date: string;
  studentName: string;
  batchName: string;
  amount: string;
  rate: string;
  commission: string;
}

const courseFilterCategories = [
  {
    key: "course",
    label: "Course",
    items: [
      { key: "IT", label: "Information Technology" },
      { key: "BM", label: "Business Management" },
    ],
  },
];

interface AgentBatchEnrollmentsTableProps {
  memberId: string | null;
}

export function AgentBatchEnrollmentsTable({
  memberId,
}: AgentBatchEnrollmentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >();

  const [batchFilterLabel, setBatchFilterLabel] = useState<string | null>(null);

  const { data, isLoading } = useGetReferralAgentBatches(
    memberId,
    currentPage,
    5,
  );

  const tableData: AgentBatchEnrollmentDataType[] = useMemo(() => {
    if (!data?.results) return [];

    return data.results.map((item) => ({
      id: item.id,
      date: item.date
        ? new Date(item.date)
            .toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "/")
        : "—",
      studentName: item.student_name || "—",
      batchName: item.source_name || "—",
      amount: Number(item.amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      rate: `${item.rate || 0}%`,
      commission: Number(item.amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    }));
  }, [data]);

  const totalResults = data?.totalResults ?? 0;

  const totalPages = data?.totalPages ?? 1;

  const totalCommissions = data?.filtered_total_commissions ?? 0;

  const formattedTotal = Number(totalCommissions).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const hasActiveFilters =
    !!dateRange?.from || !!dateRange?.to || !!batchFilterLabel;

  const handleClearFilters = () => {
    setDateRange(undefined);
    setBatchFilterLabel(null);
  };

  const columns: Column<AgentBatchEnrollmentDataType>[] = [
    {
      header: "Date",
      accessorKey: "date",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.date}
        </div>
      ),
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.studentName}
        </div>
      ),
    },
    {
      header: "Batch Name",
      accessorKey: "batchName",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.batchName}
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.amount}
        </div>
      ),
    },
    {
      header: "Rate",
      accessorKey: "rate",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[80px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.rate}
        </div>
      ),
    },
    {
      header: "Comission",
      accessorKey: "commission",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.commission}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-[14px] font-medium leading-[20px] text-[#1D293D] font-inter">
          Batch Enrollments
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
        Batch Enrollments
      </h3>

      <div className="flex justify-end gap-2">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className={cn(
              BUTTON_STYLES.outline.md,
              "h-8 border-dashed text-[#64748B] hover:text-[#0F172B] text-[12px] px-3 gap-1.5",
            )}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
        <DateRangeFilter
          placeholder="Date"
          align="end"
          initialRange={dateRange}
          onApply={(start, end) =>
            setDateRange(
              start || end
                ? { from: start || undefined, to: end || undefined }
                : undefined,
            )
          }
          className="h-[32px] min-w-[100px] text-[12px] py-1 border-[#E4E4E7]"
        />
        <FilterDropdown
          label="Course"
          categories={courseFilterCategories}
          value={batchFilterLabel}
          onFilterSelect={(_, __, label) => setBatchFilterLabel(label)}
          className="h-[32px] min-w-[100px] text-[12px] py-1 border-[#E4E4E7]"
        />
      </div>

      <DataTable
        data={tableData}
        columns={columns}
        keyExtractor={(item) => item.id}
        showCheckboxes={false}
        tableContainerClassName="h-auto"
        footerRow={
          <tr className="h-[50px] border-b border-[#E2E8F0]">
            <td className="px-5 text-left text-[16px] font-semibold text-[#45556C] font-inter">
              Total
            </td>
            <td colSpan={4}></td>
            <td className="text-left py-2 text-[16px] font-semibold text-[#45556C] font-inter pl-2">
              +{formattedTotal}
            </td>
          </tr>
        }
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
