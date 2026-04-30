"use client";

import React from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";

export interface PendingOrderRow {
  id: string;
  orderId: string;
  date: string;
  productName: string;
  productType: string;
  quantity: number;
  amount: number;
  customerName: string;
  paymentMethod: string;
  commissions: number;
  orderStatus: string;
}

const dummyData: PendingOrderRow[] = [
  {
    id: "1",
    orderId: "#12345",
    date: "01/21",
    productName: "T - shirt",
    productType: "Digital",
    quantity: 2,
    amount: 5000.00,
    customerName: "User Name",
    paymentMethod: "Card",
    commissions: 100.00,
    orderStatus: "DOWNLOADED",
  },
  {
    id: "2",
    orderId: "#12345",
    date: "01/21",
    productName: "T - shirt",
    productType: "Digital",
    quantity: 2,
    amount: 5000.00,
    customerName: "User Name",
    paymentMethod: "Card",
    commissions: 100.00,
    orderStatus: "PENDING",
  },
  {
    id: "3",
    orderId: "#12345",
    date: "01/21",
    productName: "T - shirt",
    productType: "Digital",
    quantity: 2,
    amount: 5000.00,
    customerName: "User Name",
    paymentMethod: "Card",
    commissions: 100.00,
    orderStatus: "PROCESSING",
  },
  {
    id: "4",
    orderId: "#12345",
    date: "01/21",
    productName: "T - shirt",
    productType: "Digital",
    quantity: 2,
    amount: 5000.00,
    customerName: "User Name",
    paymentMethod: "Card",
    commissions: 100.00,
    orderStatus: "DISPATCH",
  },
  {
    id: "5",
    orderId: "#12345",
    date: "01/21",
    productName: "T - shirt",
    productType: "Digital",
    quantity: 2,
    amount: 5000.00,
    customerName: "User Name",
    paymentMethod: "Card",
    commissions: 100.00,
    orderStatus: "REFUNDED",
  },
];

const statusOptions = [
  { value: "DOWNLOADED", label: "Downloaded", bg: "#DCFCE7", text: "#16A34A" },
  { value: "PENDING", label: "Pending", bg: "#FEF3C7", text: "#D97706" },
  { value: "PROCESSING", label: "Processing", bg: "#DBEAFE", text: "#2563EB" },
  { value: "DISPATCH", label: "Dispatch", bg: "#F1F5F9", text: "#475569" },
  { value: "REFUNDED", label: "Refunded", bg: "#FEE2E2", text: "#EF4444" },
];

const columns: Column<PendingOrderRow>[] = [
  {
    header: "ID",
    accessorKey: "orderId",
    className: "px-2 py-2 w-[100px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.orderId}
      </div>
    ),
  },
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
    header: "Product Name",
    accessorKey: "productName",
    className: "px-2 py-2 w-[150px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.productName}
      </div>
    ),
  },
  {
    header: "Product Type",
    accessorKey: "productType",
    className: "px-2 py-2 w-[120px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.productType}
      </div>
    ),
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    className: "px-2 py-2 w-[80px] text-center whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap text-center">
        {item.quantity}
      </div>
    ),
  },
  {
    header: "Amount",
    accessorKey: "amount",
    className: "px-2 py-2 w-[100px] text-right whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap text-right">
        {item.amount.toFixed(2)}
      </div>
    ),
  },
  {
    header: "Customer Name",
    accessorKey: "customerName",
    className: "px-2 py-2 w-[150px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.customerName}
      </div>
    ),
  },
  {
    header: "Payment Method",
    accessorKey: "paymentMethod",
    className: "px-2 py-2 w-[120px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.paymentMethod}
      </div>
    ),
  },
  {
    header: "Commissions",
    accessorKey: "commissions",
    className: "px-2 py-2 w-[100px] text-right whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap text-right">
        {item.commissions.toFixed(2)}
      </div>
    ),
  },
  {
    header: "Order Status",
    accessorKey: "orderStatus",
    className: "px-2 py-2 w-[120px] whitespace-nowrap",
    cell: (item) => (
      <StatusPopover
        value={item.orderStatus}
        options={statusOptions}
        readOnly
      />
    ),
  },
];

export function PendingOrdersTable() {
  return (
    <div className="mt-[10px] w-full rounded-lg border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <DataTable
        data={dummyData}
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
