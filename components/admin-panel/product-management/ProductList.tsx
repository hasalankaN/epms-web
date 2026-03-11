"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { ProductDataType } from "@/types/product";

import { useGetProducts } from "@/hooks/api/products/useGetProducts";
import type { ProductType, ProductStockStatus } from "@/hooks/api/products/useGetProducts";

import { ProductListToolbar } from "./views/ProductList/ProductListToolbar";
import { ProductListTable } from "./views/ProductList/ProductListTable";

export function ProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") as ProductType | null;
  const stockStatus = searchParams.get("stockStatus") as ProductStockStatus | null;

  // ===== API HOOK =====
  const { data: apiData, isLoading, isError } = useGetProducts({
    page: currentPage,
    size: 10,
    search: search || undefined,
    type: type || undefined,
    stockStatus: stockStatus || undefined,
  });

  const products = useMemo(() => {
    if (!apiData?.results) return [];
    
    // Transform API data to match UI type ProductDataType
    return apiData.results.map(item => ({
      id: item.id,
      thumbnail: "/images/placeholder.jpg",
      productId: item.sku || "",
      productName: item.name || "",
      productType: item.type === "DIGITAL" ? "Digital" : "Delivery",
      barcodeSku: item.sku || "",
      price: Number(item.price) || 0,
      quantity: item.current_stock ?? 0,
      stockStatus: item.stock_status === "IN_STOCK" ? "In Stock" : "Out of Stock",
    })) as ProductDataType[];
  }, [apiData]);

  // ===== SHARED STATE =====
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // ===== DERIVED VALUES =====
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  // ===== HANDLERS =====
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search when URL search changes (e.g. back button)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if localSearch differs from URL search
      if (localSearch.trim() !== search.trim()) {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearch.trim()) {
          params.set("search", localSearch.trim());
        } else {
          params.delete("search");
        }

        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, search, searchParams, pathname, router]);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("type");
    params.delete("stockStatus");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(products.map((item) => [item.id, true]));

    setRowSelection(newSelection);
    toast.success(`Selected all ${products.length} products`);
  }, [products]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleArchive = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one product");

      return;
    }

    toast.success(`Archiving ${selectedIds.length} selected product(s)`);
    setRowSelection({});
  }, [selectedIds]);

  const handleFilterChange = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

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
      {/* Table Toolbar */}
      <div>
        <ProductListToolbar
          bulkActions={bulkActions}
          selectedCount={selectedIds.length}
          totalCount={products.length}
          search={localSearch}
          onSearchChange={setLocalSearch}
          typeFilter={type}
          stockFilter={stockStatus}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Product Table */}
      <div>
        <ProductListTable
          data={products}
          isLoading={isLoading}
          isError={isError}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          totalResults={apiData?.totalResults || 0}
        />
      </div>
    </div>
  );
}
