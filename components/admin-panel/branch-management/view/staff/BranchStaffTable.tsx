"use client";

import React from "react";

import { Checkbox } from "@/components/ui/checkbox";

import type { StaffDataType } from "@/types/user-management";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";

// Override member status to match user's pixel perfect requirement
const CUSTOM_MEMBER_STATUS_OPTIONS = [
  { value: "Active", bg: "#DFFFF0", text: "#16A34A" },
  { value: "Inactive", bg: "#F1F5F9", text: "#000000" },
];

const SALARY_STATUS_OPTIONS = [
  { value: "Paid", bg: "#DFFFF0", text: "#16A34A" },
  { value: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
  { value: "Over Due", bg: "#FFDEDE", text: "#FB2C36" },
];

interface BranchStaffTableProps {
  data: StaffDataType[];
  rowSelection: { [key: string]: boolean };
  onRowSelectionChange: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  onPageChange: (page: number) => void;
}

export function BranchStaffTable({
  data,
  rowSelection,
  onRowSelectionChange,
  onSelectAll,
  isLoading = false,
  isError = false,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}: BranchStaffTableProps) {
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const columns: Column<StaffDataType>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={
            data.length > 0 && selectedRowCount === data.length
              ? true
              : selectedRowCount > 0
                ? "indeterminate"
                : false
          }
          onCheckedChange={(checked) => onSelectAll(!!checked)}
          aria-label="Select all rows"
          className="data-[state=checked]:border-[#E60076] data-[state=checked]:bg-[#E60076]"
        />
      ),
      cell: (staff) => (
        <Checkbox
          checked={!!rowSelection[staff.id]}
          onCheckedChange={(checked) => onRowSelectionChange(staff.id, !!checked)}
          aria-label={`Select ${staff.name}`}
          className="data-[state=checked]:border-[#E60076] data-[state=checked]:bg-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Reg. Date",
      accessorKey: "regDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.regDate}</div>,
    },
    {
      header: "ID No.",
      accessorKey: "idNo",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.idNo}</div>,
    },
    {
      header: "Name",
      accessorKey: "name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="relative inline-flex items-center">
          <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">
            {item.name}
          </div>
          {item.role && (
            <div className="absolute -top-[14px] -right-[12px] flex items-center justify-center gap-1 rounded-[32px] bg-black px-2 py-[1px] shadow-sm text-center font-inter text-[8px] font-medium leading-[11px] text-white">
              {item.role}
            </div>
          )}
        </div>
      ),
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          <i className="phone-outgoing h-4 w-4 text-[#64748B]" /> Phone
        </span>
      ),
      accessorKey: "phone",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.phone}</div>,
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          <i className="whatsapp-logo h-4 w-4 text-[#64748B]" /> WhatsApp
        </span>
      ),
      accessorKey: "whatsApp",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.whatsApp}</div>,
    },
    {
      header: "Email",
      accessorKey: "email",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.email}</div>,
    },
    {
      header: "Privileges",
      accessorKey: "privileges",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.privileges}</div>,
    },
    {
      header: "Commissions",
      accessorKey: "commissions",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.commissions}</div>,
    },
    {
      header: "Branch",
      accessorKey: "branch",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.branch}</div>,
    },
    {
      header: "Salary Status",
      accessorKey: "salaryStatus",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (staff) => (
        <StatusPopover
          value={staff.salaryStatus}
          options={SALARY_STATUS_OPTIONS}
          readOnly
        />
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (staff) => (
        <StatusPopover
          value={staff.status}
          options={CUSTOM_MEMBER_STATUS_OPTIONS}
          readOnly
        />
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
      tableContainerClassName="h-auto"
      pagination={{
        variant: "simple",
        totalCount: totalCount ?? data.length,
        selectedRowCount,
        currentPage,
        totalPages,
        onPageChange: onPageChange,
      }}
      rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
    />
  );
}
