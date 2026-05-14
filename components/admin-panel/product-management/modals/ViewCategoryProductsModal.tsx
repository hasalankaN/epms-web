"use client";

import React, { useState } from "react";

import { X, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import { useGetCategoryProducts } from "@/hooks/api/product-categories/useGetCategoryProducts";
import type { CategoryProductItem } from "@/hooks/api/product-categories/useGetCategoryProducts";
import { cn } from "@/lib/utils";
import { AUTH_INPUT } from "@/lib/constants/theme";

interface ViewCategoryProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: { id: string; categoryName: string } | null;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: "#DFFFF0", text: "#16A34A" },
  INACTIVE: { bg: "#F1F5F9", text: "#64748B" },
};

export function ViewCategoryProductsModal({
  isOpen,
  onClose,
  category,
}: ViewCategoryProductsModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetCategoryProducts({
    id: category?.id || "",
    page: currentPage,
    size: 10,
    search: search || undefined,
  });

  const columns: Column<CategoryProductItem>[] = [
    {
      header: "Product ID / SKU",
      accessorKey: "sku",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          {item.sku || "-"}
        </div>
      ),
    },
    {
      header: "Product Name",
      accessorKey: "name",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#0F172B]">
          {item.name}
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          {item.type === "DIGITAL" ? "Digital" : "Delivery"}
        </div>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          {parseFloat(item.price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => {
        const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.ACTIVE;

        return (
          <StatusPopover
            value={item.status}
            options={[
              { value: item.status, bg: config.bg, text: config.text },
            ]}
            readOnly
          />
        );
      },
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[95%] max-w-[800px] max-h-[90vh] flex flex-col gap-0 overflow-hidden rounded-xl bg-white p-0 shadow-lg [&>button]:hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <DialogTitle className="text-lg font-semibold text-[#0F172B]">
            Products in {category?.categoryName}
          </DialogTitle>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
          >
            <X className="h-4 w-4 text-[#64748B]" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-[#F1F5F9] bg-[#F8FAFC]/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={cn(
                AUTH_INPUT.base,
                "pl-10 h-9 text-sm",
                "bg-white border-[#E2E8F0] focus:ring-[#E60076]/10 focus:border-[#E60076]"
              )}
              placeholder="Search products in this category..."
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
          <DataTable
            data={data?.results || []}
            columns={columns}
            isLoading={isLoading}
            isError={isError}
            keyExtractor={(item) => item.id}
            showCheckboxes={false}
            tableContainerClassName="h-auto"
            pagination={{
              variant: "simple",
              totalCount: data?.totalResults || 0,
              currentPage: currentPage,
              totalPages: data?.totalPages || 1,
              onPageChange: setCurrentPage,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
