"use client";

import React, { useState } from "react";

import { MoreVertical } from "lucide-react";

import type { OrderDataType } from "@/types/product";
import { ORDER_STATUS_CONFIG } from "@/types/product";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewOrderModal } from "@/components/admin-panel/product-management/modals/ViewOrderModal";
import { useGetOrderInvoice } from "@/hooks/api/orders/useGetOrderInvoice";
import { useGetOrderWaybill } from "@/hooks/api/orders/useGetOrderWaybill";
import { useUpdateOrderStatus, type OrderTargetStatus } from "@/hooks/api/orders/useUpdateOrderStatus";

interface OrderTableProps {
  data: OrderDataType[];
  isLoading?: boolean;
  isError?: boolean;
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  currentPage: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}

export function OrderTable({
  data,
  isLoading = false,
  isError = false,
  rowSelection,
  setRowSelection,
  currentPage,
  totalResults,
  onPageChange,
}: OrderTableProps) {
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  };

  const [viewOrder, setViewOrder] = useState<OrderDataType | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { mutate: getInvoice } = useGetOrderInvoice();
  const { mutate: getWaybill } = useGetOrderWaybill();
  const { mutate: updateStatus, isPending: isUpdating, variables } = useUpdateOrderStatus();

  const handleAction = (action: string, order: OrderDataType) => {
    if (action === "view") {
      setViewOrder(order);
      setIsViewModalOpen(true);
    } else if (action === "print-invoice") {
      getInvoice({ orderId: order.id });
    } else if (action === "print-waybill") {
      getWaybill({ orderId: order.id });
    } else {
      console.log(`Action: ${action}`, order);
    }
  };

  const columns: Column<OrderDataType>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={
            selectedRowCount === data.length && data.length > 0
              ? true
              : selectedRowCount > 0
                ? "indeterminate"
                : false
          }
          onCheckedChange={handleSelectAll}
          aria-label="Select all rows"
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      cell: (order) => (
        <Checkbox
          checked={!!rowSelection[order.id]}
          onCheckedChange={(checked) => handleSelectRow(order.id, !!checked)}
          aria-label={`Select order ${order.orderId}`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "ID",
      accessorKey: "orderId",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.orderId}</div>,
    },
    {
      header: "Date",
      accessorKey: "date",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[80px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.date}</div>,
    },
    {
      header: "Product Name",
      accessorKey: "productName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.productName}</div>,
    },
    {
      header: "Product Type",
      accessorKey: "productType",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.productType}</div>,
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[80px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.quantity}</div>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.amount.toFixed(2)}</div>,
    },
    {
      header: "Customer Name",
      accessorKey: "customerName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.customerName}</div>,
    },
    {
      header: "Payment Method",
      accessorKey: "paymentMethod",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.paymentMethod
            .replace(/[_-]+/g, " ")
            .toLowerCase()
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")}
        </div>
      ),
    },
    {
      header: "Commissions",
      accessorKey: "commissions",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.commissions.toFixed(2)}</div>,
    },
    {
      header: "Order Status",
      accessorKey: "orderStatus",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (order) => {
        const options = Object.entries(ORDER_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        const validTargets = ["Processing", "Dispatched", "Completed", "Refunded"];
        const dropdownOptions = options.filter(opt => validTargets.includes(opt.value));

        return (
          <StatusPopover
            value={order.orderStatus}
            onValueChange={(newStatus) => {
              updateStatus({ 
                id: order.id, 
                target_status: newStatus.toUpperCase() as OrderTargetStatus 
              });
            }}
            options={options}
            dropdownOptions={dropdownOptions}
            isLoading={isUpdating && variables?.id === order.id}
          />
        );
      },
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap text-right w-[80px]",
      cell: (order) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem onClick={() => handleAction("view", order)} className="cursor-pointer focus:bg-[#FDF2F8]">
                View Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("print-invoice", order)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Print Invoice
              </DropdownMenuItem>
              {order.productType === "Delivery" && (
                <DropdownMenuItem onClick={() => handleAction("print-waybill", order)} className="cursor-pointer focus:bg-[#FDF2F8]">
                  Print Delivery Way Bill
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(item) => item.id}
        pagination={{
          variant: "simple",
          totalCount: totalResults,
          selectedRowCount,
          currentPage,
          totalPages,
          onPageChange: onPageChange,
        }}
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
      />

      {/* View Order Modal */}
      <ViewOrderModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        order={viewOrder}
      />
    </>
  );
}
