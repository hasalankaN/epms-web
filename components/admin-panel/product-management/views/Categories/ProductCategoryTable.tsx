"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToggleProductCategoryStatus } from "@/hooks/api/product-categories/useToggleProductCategoryStatus";

// ===== TYPES =====

export interface ProductCategoryDataType {
  id: string;
  categoryName: string;
  productCount: number;
  status: "Active" | "Inactive";
}

const PRODUCT_CATEGORY_STATUS_CONFIG: Record<"Active" | "Inactive", { bg: string; text: string }> = {
  Active: { bg: "#DFFFF0", text: "#16A34A" },
  Inactive: { bg: "#F1F5F9", text: "#64748B" },
};

interface ProductCategoryTableProps {
  data: ProductCategoryDataType[];
  isLoading?: boolean;
  isError?: boolean;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRename?: (category: ProductCategoryDataType) => void;
  onViewProducts?: (category: ProductCategoryDataType) => void;
}

// ===== COMPONENT =====

export function ProductCategoryTable({
  data,
  isLoading = false,
  isError = false,
  totalCount,
  currentPage,
  onPageChange,
  onRename,
  onViewProducts,
}: ProductCategoryTableProps) {
  const itemsPerPage = 10;

  const filteredData = useMemo(() => data || [], [data]);
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryDataType | null>(null);

  const { mutateAsync: toggleStatus, isPending: isTogglingStatus } = useToggleProductCategoryStatus();

  const handleAction = (action: string, category: ProductCategoryDataType) => {
    if (action === "rename") {
      onRename?.(category);
    } else if (action === "toggle-status") {
      setSelectedCategory(category);
      setIsStatusModalOpen(true);
    }
  };

  const handleStatusConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await toggleStatus({
        id: selectedCategory.id,
        currentIsActive: selectedCategory.status === "Active",
      });
      setIsStatusModalOpen(false);
    } catch {
      // error handled by hook
    }
  };

  const columns: Column<ProductCategoryDataType>[] = [
    {
      header: "Product Category",
      accessorKey: "categoryName",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[400px]",
      cell: (item) => (
        <div className="text-[13px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.categoryName}
        </div>
      ),
    },
    {
      header: "Assigned Product",
      accessorKey: "productCount",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[200px]",
      cell: (item) => (
        <button
          onClick={() => onViewProducts?.(item)}
          className="text-[13px] font-medium text-[#45556C] hover:text-[#E60076] hover:underline cursor-pointer"
        >
          View
        </button>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (category) => {
        const options = Object.entries(PRODUCT_CATEGORY_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={category.status}
            options={options}
            readOnly
          />
        );
      },
    },
    {
      header: "Action",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis text-right w-[100px]",
      cell: (category) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Category actions"
                title="Category actions"
              >
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem
                onClick={() => handleAction("rename", category)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("toggle-status", category)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                {category.status === "Active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={filteredData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        showCheckboxes={false}
        pagination={{
          variant: "simple",
          totalCount,
          currentPage,
          totalPages,
          onPageChange: onPageChange,
        }}
      />

      {/* Toggle Status Confirmation */}
      <DeleteConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleStatusConfirm}
        isDeleting={isTogglingStatus}
        title={selectedCategory?.status === "Active" ? "Confirm Deactivation" : "Confirm Activation"}
        description={`Are you sure you want to ${selectedCategory?.status === "Active" ? "deactivate" : "activate"} [${selectedCategory?.categoryName ?? "Category"}]?`}
        confirmText={selectedCategory?.status === "Active" ? "Confirm Deactivation" : "Confirm Activation"}
        cancelText="Go Back"
        confirmVariant={selectedCategory?.status === "Active" ? "destructive" : "primary"}
      />
    </>
  );
}
