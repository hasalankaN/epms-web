"use client";

import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";

import { MoreVertical } from "lucide-react";

import type { ProductDataType } from "@/types/product";
import { STOCK_STATUS_CONFIG } from "@/types/product";

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
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { EditProductPanel } from "@/components/admin-panel/product-management/modals/EditProductPanel";
import { ViewProductModal } from "@/components/admin-panel/product-management/modals/ViewProductModal";
import { useArchiveProduct } from "@/hooks/api/products/useArchiveProduct";
import { useDeleteProduct } from "@/hooks/api/products/useDeleteProduct";


interface ProductListTableProps {
  data: ProductDataType[];
  isLoading?: boolean;
  isError?: boolean;
  rowSelection: { [key: string]: boolean };
  setRowSelection: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  currentPage: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}

export function ProductListTable({
  data,
  isLoading = false,
  isError = false,
  rowSelection,
  setRowSelection,
  currentPage,
  totalResults,
  onPageChange,
}: ProductListTableProps) {
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

  const [actionProduct, setActionProduct] = useState<ProductDataType | null>(null);
  const [isArcModalOpen, setIsArcModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductDataType | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<ProductDataType | null>(null);

  const { mutateAsync: archiveProduct, isPending: isArchiving } = useArchiveProduct();
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleAction = (action: string, product: ProductDataType) => {
    setActionProduct(product);

    switch(action) {
      case "view":
        setViewProduct(product);
        setIsViewModalOpen(true);
        break;
      case "edit":
        setEditProduct(product);
        setIsEditPanelOpen(true);
        break;
      case "archive":
        setIsArcModalOpen(true);
        break;
      case "delete":
        setIsDelModalOpen(true);
        break;
    }
  };

  const columns: Column<ProductDataType>[] = [
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
      cell: (product) => (
        <Checkbox
          checked={!!rowSelection[product.id]}
          onCheckedChange={(checked) => handleSelectRow(product.id, !!checked)}
          aria-label={`Select ${product.productName}`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Thumbnail",
      accessorKey: "thumbnail",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[80px]",
      cell: (item) => (
        <div
          className="h-[30px] w-[30px] flex-shrink-0 rounded-[var(--radius,6px)]"
          style={{
            background: `url(${item.thumbnail}) lightgray 50% / cover no-repeat`,
          }}
        />
      ),
    },
    {
      header: "Product ID",
      accessorKey: "productId",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.productId}</div>,
    },
    {
      header: "Product Name",
      accessorKey: "productName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[180px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.productName || "-"}
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.category?.name || "-"}
        </div>
      ),
    },
    {
      header: "Product Type",
      accessorKey: "productType",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.productType}</div>,
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.productType === "Digital" ? "N/A" : item.quantity}
        </div>
      ),
    },
    {
      header: "Barcode/SKU",
      accessorKey: "barcodeSku",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[180px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.barcodeSku || "-"}</div>,
    },
    {
      header: "Price",
      accessorKey: "price",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.price ? item.price.toFixed(2) : "-"}</div>,
    },
    {
      header: "Stock Status",
      accessorKey: "stockStatus",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (product) => {
        const options = Object.entries(STOCK_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={product.stockStatus}
            options={options}
            readOnly
          />
        );
      },
    },

    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap text-right w-[80px]",
      cell: (product) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem onClick={() => handleAction("view", product)} className="cursor-pointer focus:bg-[#FDF2F8]">
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("edit", product)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("archive", product)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Add to Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("delete", product)} className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600">
                Delete
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
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : item.status === "DRAFT" ? "bg-slate-100 opacity-80 grayscale-[20%]" : "")}
      />

      {/* Archive Modal — uses primary (pink) confirm button */}
      <DeleteConfirmationModal
        isOpen={isArcModalOpen}
        onClose={() => setIsArcModalOpen(false)}
        onConfirm={async () => {
          if (actionProduct) {
            await archiveProduct(actionProduct.id);
          }

          setIsArcModalOpen(false);
        }}
        isDeleting={isArchiving}
        title="Add to Archive List"
        description="Are you sure you want to archive this product?"
        confirmText="Confirm"
        cancelText="Cancel"
        confirmVariant="primary"
      />

      <DeleteConfirmationModal
        isOpen={isDelModalOpen}
        onClose={() => setIsDelModalOpen(false)}
        onConfirm={async () => {
          if (actionProduct) {
            await deleteProduct(actionProduct.id);
          }

          setIsDelModalOpen(false);
        }}
        isDeleting={isDeleting}
        title="Confirm Deletion"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Confirm Delete"
      />

      {/* Edit Product Panel */}
      <EditProductPanel
        isOpen={isEditPanelOpen}
        onClose={() => setIsEditPanelOpen(false)}
        product={editProduct}
      />

      {/* View Product Modal */}
      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        product={viewProduct}
      />
    </>
  );
}
