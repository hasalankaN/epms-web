"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { MoreVertical } from "lucide-react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ReferralCourseDataType} from "@/types/referral-products";
import { PRODUCT_STATUS_CONFIG } from "@/types/referral-products";

interface CoursesTableProps {
  data: ReferralCourseDataType[];
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
}

export function CoursesTable({
  data,
  isLoading,
  isError,
  currentPage,
  onPageChange,
  totalResults,
}: CoursesTableProps) {
  const router = useRouter();
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const handleAction = (action: string, item: ReferralCourseDataType) => {
    if (action === "view") {
      router.push(`/referral-panel/courses-and-batches/course/${item.id}`);
    }
  };

  const columns: Column<ReferralCourseDataType>[] = [
    {
      header: "Course ID",
      accessorKey: "courseId",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.courseId}</div>,
    },
    {
      header: "Course Name",
      accessorKey: "courseName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B]">{item.courseName}</div>,
    },
    {
      header: "Category",
      accessorKey: "category",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.category}</div>,
    },
    {
      header: "Level",
      accessorKey: "level",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.level}</div>,
    },
    {
      header: "Type",
      accessorKey: "type",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[90px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.type}</div>,
    },
    {
      header: "Subject",
      accessorKey: "subject",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.subject}</div>,
    },
    {
      header: "Price",
      accessorKey: "price",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.price}</div>,
    },
    {
      header: "Direct Commission Rate",
      accessorKey: "directCommissionRate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[160px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.directCommissionRate}</div>,
    },
    {
      header: "Team Commission Rate",
      accessorKey: "teamCommissionRate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[160px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.teamCommissionRate}</div>,
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[110px]",
      cell: (item) => (
        <StatusPopover
          value={item.status}
          options={Object.entries(PRODUCT_STATUS_CONFIG).map(([value, config]) => ({
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
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] text-right w-[60px]",
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
                onClick={() => handleAction("view", item)}
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
    <DataTable
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
      isError={isError}
      showCheckboxes={false}
      pagination={{
        variant: "simple",
        totalCount: totalResults,
        currentPage,
        totalPages,
        onPageChange,
      }}
    />
  );
}
