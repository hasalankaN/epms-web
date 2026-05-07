import React from "react";

import { useRouter } from "next/navigation";

import { MoreVertical } from "lucide-react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CourseCommissionData {
  id: string;
  regDate: string;
  stuName: string;
  phone: string;
  courseName: string;
  amount: string;
  comPercentage: string;
  comEarned: string;
}

const mockData: CourseCommissionData[] = Array(5).fill({
  id: "1",
  regDate: "2026/01/21",
  stuName: "Amali Perera",
  phone: "+9470 492 2345",
  courseName: "Course",
  amount: "XXXX.00",
  comPercentage: "XX%",
  comEarned: "XXXX.00",
}).map((item, index) => ({ ...item, id: (index + 1).toString() }));

interface CoursesTableProps {
  currentPage: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export function CoursesTable({
  currentPage,
  totalResults,
  onPageChange,
  isLoading = false,
  isError = false,
}: CoursesTableProps) {
  const router = useRouter();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = mockData.slice(startIndex, endIndex);

  const handleAction = (action: string, item: CourseCommissionData) => {
    if (action === "view-student") {
      router.push(`/referral-panel/my-commissions/student/${item.id}`);
    }
  };

  const columns: Column<CourseCommissionData>[] = [
    {
      header: "Reg. Date",
      accessorKey: "regDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.regDate}</div>,
    },
    {
      header: "Stu. Name",
      accessorKey: "stuName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B]">{item.stuName}</div>,
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          <i className="phone-outgoing h-4 w-4 text-[#64748B]" /> Phone
        </span>
      ),
      accessorKey: "phone",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => (
        item.phone && item.phone !== "-" ? (
          <a
            href={`tel:${item.phone}`}
            className="text-[11px] font-medium text-[#45556C] transition-colors hover:text-[#E60076]"
          >
            {item.phone}
          </a>
        ) : (
          <span className="text-[11px] font-medium text-[#45556C]">{item.phone || "-"}</span>
        )
      ),
    },
    {
      header: "Course Name",
      accessorKey: "courseName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.courseName}</div>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.amount}</div>,
    },
    {
      header: "Com. Percentage",
      accessorKey: "comPercentage",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.comPercentage}</div>,
    },
    {
      header: "Com. Earned",
      accessorKey: "comEarned",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.comEarned}</div>,
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] text-right w-[80px]",
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
                onClick={() => handleAction("view-student", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                View Student
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-[#FDF2F8]">
                Call
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={paginatedData}
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
