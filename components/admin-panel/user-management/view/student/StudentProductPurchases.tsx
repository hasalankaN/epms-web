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

import { format } from "date-fns";

import type { ProductPurchaseItem } from "@/types/user-management";

interface StudentProductPurchasesProps {
  data?: ProductPurchaseItem[];
  total?: number;
  isLoading?: boolean;
}

export function StudentProductPurchases({ data = [], total = 0, isLoading }: StudentProductPurchasesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalCount = total;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  
  const handleAction = (action: string, purchase: ProductPurchaseItem) => {
    console.log(`Action: ${action}`, purchase);
  };

  const columns: Column<ProductPurchaseItem>[] = [
    {
      header: "Purchased Date",
      accessorKey: "purchased_at",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          {item.purchased_at ? format(new Date(item.purchased_at), "yyyy/MM/dd") : "-"}
        </div>
      ),
    },
    {
      header: "Product Name",
      accessorKey: "product_name",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.product_name}</div>,
    },
    {
      header: () => <div className="text-center w-full">Order QTY</div>,
      accessorKey: "quantity",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-center text-[#45556C]">{item.quantity}</div>,
    },
    {
      header: () => <div className="text-center w-full">Amount</div>,
      accessorKey: "total_amount",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => (
        <div className="text-[12px] font-medium text-center text-[#45556C]">
          {item.currency} {new Intl.NumberFormat().format(parseFloat(item.total_amount))}
        </div>
      ),
    },
    {
      header: () => <div className="text-center w-full">Order Status</div>,
      accessorKey: "fulfillment_status",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const options = [
          { value: "DISPATCHED", label: "Dispatched", bg: "#F1F5F9", text: "#000000" },
          { value: "DOWNLOADED", label: "Downloaded", bg: "#DFFFF0", text: "#16A34A" },
          { value: "DELIVERED", label: "Delivered", bg: "#DFFFF0", text: "#16A34A" },
          { value: "PENDING", label: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
          { value: "CANCELLED", label: "Cancelled", bg: "#FEE2E2", text: "#EF4444" },
        ];
        
        return (
          <div className="flex justify-center w-full">
            <StatusPopover
              value={item.fulfillment_status}
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
          data={data}
          columns={columns}
          keyExtractor={(item) => item.id}
          showCheckboxes={false}
          tableContainerClassName="h-auto"
          isLoading={isLoading}
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

