"use client";

import React, { useState } from "react";

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

interface ProductPurchase {
  id: string;
  purchasedDate: string;
  productName: string;
  orderQty: string;
  amount: string;
  orderStatus: string;
}

const MOCK_DATA: ProductPurchase[] = [
  {
    id: "1",
    purchasedDate: "2025/01/21",
    productName: "Lorem Ipsum",
    orderQty: "XX",
    amount: "XXXX.00",
    orderStatus: "Dispatch",
  },
  {
    id: "2",
    purchasedDate: "2025/01/21",
    productName: "Lorem Ipsum",
    orderQty: "XX",
    amount: "XXXX.00",
    orderStatus: "Downloaded",
  },
];

export function StudentProductPurchases() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalCount = MOCK_DATA.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginatedData = MOCK_DATA.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const handleAction = (action: string, purchase: ProductPurchase) => {
    console.log(`Action: ${action}`, purchase);
  };

  const columns: Column<ProductPurchase>[] = [
    {
      header: "Purchased Date",
      accessorKey: "purchasedDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.purchasedDate}</div>,
    },
    {
      header: "Product Name",
      accessorKey: "productName",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.productName}</div>,
    },
    {
      header: () => <div className="text-center w-full">Order QTY</div>,
      accessorKey: "orderQty",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-center text-[#45556C]">{item.orderQty}</div>,
    },
    {
      header: () => <div className="text-center w-full">Amount</div>,
      accessorKey: "amount",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-center text-[#45556C]">{item.amount}</div>,
    },
    {
      header: () => <div className="text-center w-full">Order Status</div>,
      accessorKey: "orderStatus",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const options = [
          { value: "Dispatch", label: "Dispatch", bg: "#F1F5F9", text: "#000000" },
          { value: "Downloaded", label: "Downloaded", bg: "#DFFFF0", text: "#16A34A" },
        ];
        
        return (
          <div className="flex justify-center w-full">
            <StatusPopover
              value={item.orderStatus}
              options={options}
              readOnly
            />
          </div>
        );
      },
    },
    {
      header: "Action",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis text-right w-[80px]",
      cell: (item) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem onClick={() => handleAction("view-invoice", item)} className="cursor-pointer focus:bg-[#FDF2F8]">
                View Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("email-invoice", item)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Email Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <h2 className="font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
        Product Purchasing History
      </h2>
      
      <div className="mt-[8px] w-full max-w-full overflow-hidden">
        <DataTable
          data={paginatedData}
          columns={columns}
          keyExtractor={(item) => item.id}
          showCheckboxes={false}
          tableContainerClassName="h-auto"
          pagination={{
            variant: "simple",
            totalCount: totalCount,
            currentPage: currentPage,
            totalPages: totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
}
