"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { ProductDataType } from "@/types/product";

import { useGetProducts } from "@/hooks/api/products/useGetProducts";
import { useBulkDeleteProducts } from "@/hooks/api/products/useBulkDeleteProducts";
import { useBulkArchiveProducts } from "@/hooks/api/products/useBulkArchiveProducts";
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
  const categoryId = searchParams.get("categoryId") as string | null;

  // ===== API HOOK =====
  const { data: apiData, isLoading, isError } = useGetProducts({
    page: currentPage,
    size: 10,
    search: search || undefined,
    type: type || undefined,
    stockStatus: stockStatus || undefined,
    category_id: categoryId || undefined,
  });

  const products = useMemo(() => {
    if (!apiData?.results) return [];
    
    // Transform API data to match UI type ProductDataType
    return apiData.results.map(item => ({
      id: item.id,
      thumbnail: item.product_image_url || "/images/placeholder.jpg",
      productId: item.sku || "-",
      productName: item.name || "",
      productType: item.type === "DIGITAL" ? "Digital" : "Delivery",
      barcodeSku: item.sku || "-",
      price: Number(item.price) || 0,
      quantity: item.current_stock ?? 0,
      stockStatus: item.stock_status === "IN_STOCK" ? "In Stock" : "Out of Stock",
      status: item.status,
      category: item.category_id ? { id: item.category_id, name: item.category_name || "-" } : undefined,
    })) as ProductDataType[];
  }, [apiData]);

  // ===== SHARED STATE =====
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // ===== DERIVED VALUES =====
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  const { mutateAsync: bulkDeleteProducts, isPending: isBulkDeleting } = useBulkDeleteProducts();
  const { mutateAsync: bulkArchiveProducts, isPending: isBulkArchiving } = useBulkArchiveProducts();

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
    params.delete("categoryId");
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

  const handleArchive = useCallback(async () => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one product");

      return;
    }

    const toastId = toast.loading(`Archiving ${selectedIds.length} selected product(s)...`);

    try {
      await bulkArchiveProducts({ ids: selectedIds });
      setRowSelection({});
      toast.dismiss(toastId);
    } catch {
      toast.dismiss(toastId);
    }
  }, [selectedIds, bulkArchiveProducts]);

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

  const handleDelete = useCallback(async () => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one product");

      return;
    }

    try {
      await bulkDeleteProducts({ ids: selectedIds });
      setRowSelection({});
    } catch {
      // errors handled by hook
    }
  }, [selectedIds, bulkDeleteProducts]);

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
          categoryFilter={categoryId}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          isDeleting={isBulkDeleting}
          isArchiving={isBulkArchiving}
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
