"use client";

import React from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";

export interface PendingFollowUpRow {
  id: string;
  date: string;
  idNo: string;
  studentName: string;
  phone: string;
  whatsApp: string;
  source: string;
  assignee: string;
  district: string;
  interest: string;
  branch: string;
  status: string;
  followUp: string;
}

const statusOptions = [
  { value: "PENDING", label: "Pending", bg: "#FEF3C7", text: "#D97706" },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    bg: "#DBEAFE",
    text: "#2563EB",
  },
  { value: "COMPLETED", label: "Completed", bg: "#DCFCE7", text: "#16A34A" },
];

const columns: Column<PendingFollowUpRow>[] = [
  {
    header: "Date",
    accessorKey: "date",
    className: "px-2 py-2 w-[80px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.date}
      </div>
    ),
  },
  {
    header: "ID No.",
    accessorKey: "idNo",
    className: "px-2 py-2 w-[100px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.idNo}
      </div>
    ),
  },
  {
    header: "Stu. Name",
    accessorKey: "studentName",
    className: "px-2 py-2 w-[150px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.studentName}
      </div>
    ),
  },
  {
    header: () => (
      <span className="flex items-center gap-1 whitespace-nowrap">
        <i className="phone-outgoing h-4 w-4 text-[#64748B]" /> Phone
      </span>
    ),
    accessorKey: "phone",
    className: "px-2 py-2 w-[150px] whitespace-nowrap",
    cell: (item) =>
      item.phone && item.phone !== "-" ? (
        <a
          href={`tel:${item.phone}`}
          className="text-[11px] font-medium text-[#45556C] transition-colors hover:text-[#E60076] whitespace-nowrap"
        >
          {item.phone}
        </a>
      ) : (
        <span className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.phone || "-"}
        </span>
      ),
  },
  {
    header: () => (
      <span className="flex items-center gap-1 whitespace-nowrap">
        <i className="whatsapp-logo h-4 w-4 text-[#64748B]" /> WhatsApp
      </span>
    ),
    accessorKey: "whatsApp",
    className: "px-2 py-2 w-[150px] whitespace-nowrap",
    cell: (item) =>
      item.whatsApp && item.whatsApp !== "-" ? (
        <a
          href={`https://wa.me/${item.whatsApp.replace(/\s+/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-[#45556C] transition-colors hover:text-[#E60076] whitespace-nowrap"
        >
          {item.whatsApp}
        </a>
      ) : (
        <span className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.whatsApp || "-"}
        </span>
      ),
  },
  {
    header: "Source",
    accessorKey: "source",
    className: "px-2 py-2 w-[120px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.source}
      </div>
    ),
  },
  {
    header: "Assignee",
    accessorKey: "assignee",
    className: "px-2 py-2 w-[120px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.assignee}
      </div>
    ),
  },
  {
    header: "District",
    accessorKey: "district",
    className: "px-2 py-2 w-[120px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.district}
      </div>
    ),
  },
  {
    header: "Interest",
    accessorKey: "interest",
    className: "px-2 py-2 w-[120px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.interest}
      </div>
    ),
  },
  {
    header: "Branch",
    accessorKey: "branch",
    className: "px-2 py-2 w-[100px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.branch}
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    className: "px-2 py-2 w-[120px] whitespace-nowrap",
    cell: (item) => (
      <StatusPopover value={item.status} options={statusOptions} readOnly />
    ),
  },
  {
    header: "Follow Up",
    accessorKey: "followUp",
    className: "px-2 py-2 w-[100px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.followUp}
      </div>
    ),
  },
];

interface Props {
  data?: PendingFollowUpRow[];
}

export function PendingFollowUpsTable({ data }: Props) {
  return (
    <div className="mt-[10px] w-full rounded-lg border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <DataTable
        data={data ?? []}
        columns={columns}
        keyExtractor={(item) => item.id}
        showCheckboxes={false}
        hideBorder={true}
        tableContainerClassName="h-auto"
      />
      <div className="flex w-full items-center justify-center border-t border-[#E2E8F0] bg-white py-4 px-2">
        <span className="text-[14px] font-normal leading-[20px] text-[#6B7280] font-sans">
          View of first 5 Row
        </span>
      </div>
    </div>
  );
}
