"use client";

import React, { useMemo, useState } from "react";

import { X } from "lucide-react";

import { BUTTON_STYLES } from "@/lib/constants/theme";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import { cn } from "@/lib/utils";

export interface AgentCourseEnrollmentDataType {
  id: string;
  date: string;
  studentName: string;
  courseName: string;
  amount: string;
  rate: string;
  commission: string;
}

const mockCourses: AgentCourseEnrollmentDataType[] = Array.from({ length: 15 }, (_, i) => ({
  id: `CE-${i + 1}`,
  date: "2026/01/21",
  studentName: "Lorem ipsum",
  courseName: "Course Name",
  amount: "XXXX.00",
  rate: "XX%",
  commission: "XXXX.00",
}));

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

export function AgentCourseEnrollmentsTable() {
  const [data] = useState<AgentCourseEnrollmentDataType[]>(mockCourses);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>();
  const [courseFilterLabel, setCourseFilterLabel] = useState<string | null>(null);
  
  const itemsPerPage = 5;

  const totalResults = data.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const hasActiveFilters = !!dateRange?.from || !!dateRange?.to || !!courseFilterLabel;

  const handleClearFilters = () => {
    setDateRange(undefined);
    setCourseFilterLabel(null);
  };

  const columns: Column<AgentCourseEnrollmentDataType>[] = [
    {
      header: "Date",
      accessorKey: "date",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.date}</div>
      ),
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.studentName}</div>
      ),
    },
    {
      header: "Course Name",
      accessorKey: "courseName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.courseName}</div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.amount}</div>
      ),
    },
    {
      header: "Rate",
      accessorKey: "rate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[80px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.rate}</div>
      ),
    },
    {
      header: "Comission",
      accessorKey: "commission",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.commission}</div>
      ),
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage]);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[14px] font-medium leading-[20px] text-[#1D293D] font-inter">Course Enrollments</h3>
      
      <div className="flex justify-end gap-2">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className={cn(
              BUTTON_STYLES.outline.md,
              "h-8 border-dashed text-[#64748B] hover:text-[#0F172B] text-[12px] px-3 gap-1.5"
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
          onApply={(start, end) => setDateRange(start || end ? { from: start || undefined, to: end || undefined } : undefined)}
          className="h-[32px] min-w-[100px] text-[12px] py-1 border-[#E4E4E7]"
        />
        <FilterDropdown
          label="Course"
          categories={courseFilterCategories}
          value={courseFilterLabel}
          onFilterSelect={(_, __, label) => setCourseFilterLabel(label)}
          className="h-[32px] min-w-[100px] text-[12px] py-1 border-[#E4E4E7]"
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        showCheckboxes={false}
        tableContainerClassName="h-auto"
        footerRow={
          <tr className="h-[50px] border-b border-[#E2E8F0]">
            <td className="px-5 text-left text-[16px] font-semibold text-[#45556C] font-inter">Total</td>
            <td colSpan={4}></td>
            <td className="text-left py-2 text-[16px] font-semibold text-[#45556C] font-inter pl-2">+XXXX.00</td>
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
