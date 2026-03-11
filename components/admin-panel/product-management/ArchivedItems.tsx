"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { ProductDataType } from "@/types/product";
import { DUMMY_PRODUCT_DATA } from "@/types/product";

import { ProductListToolbar } from "./views/ProductList/ProductListToolbar";
import { ProductListTable as ArchivedListTable } from "./views/ProductList/ArchivedListTable";

export function ArchivedItems() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [data] = useState<ProductDataType[]>(DUMMY_PRODUCT_DATA);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<string | null>(null);

  // ===== DERIVED VALUES =====
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  const handleFilterChange = useCallback((key: string, value: string | null) => {
    if (key === "productType") {
      setTypeFilter(value);
    } else if (key === "stockStatus") {
      setStockFilter(value);
    }
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setTypeFilter(null);
    setStockFilter(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

    setRowSelection(newSelection);
    toast.success(`Selected all ${data.length} archived products`);
  }, [data]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleArchive = useCallback(() => {
    // In archived items, this could be "Restore"
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one product");

      return;
    }

    toast.success(`Restoring ${selectedIds.length} selected product(s)`);
    setRowSelection({});
  }, [selectedIds]);

  const handleDelete = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one product");

      return;
    }

    toast.error(`Deleting ${selectedIds.length} selected product(s)`);
    setRowSelection({});
  }, [selectedIds]);

  // ===== BULK ACTIONS CONFIG =====
  const bulkActions = useMemo(
    () => ({
      onSelectAll: handleSelectAll,
      onClear: handleClearSelection,
      onArchive: handleArchive,
      onDelete: handleDelete,
    }),
    [handleSelectAll, handleClearSelection, handleArchive, handleDelete]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar — NO Add button */}
      <div>
        <ProductListToolbar
          bulkActions={bulkActions}
          selectedCount={selectedIds.length}
          totalCount={data.length}
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          stockFilter={stockFilter}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Archived Products Table */}
      <div>
        <ArchivedListTable
          data={data}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
    </div>
  );
}
