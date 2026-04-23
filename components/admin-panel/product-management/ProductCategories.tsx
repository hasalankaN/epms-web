"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { useGetProductCategories } from "@/hooks/api/product-categories/useGetProductCategories";

import { ProductCategoryTableToolbar } from "./views/Categories/ProductCategoryTableToolbar";
import { ProductCategoryTable } from "./views/Categories/ProductCategoryTable";
import type { ProductCategoryDataType } from "./views/Categories/ProductCategoryTable";

interface ProductCategoriesProps {
  onRename?: (category: ProductCategoryDataType) => void;
  onViewProducts?: (category: ProductCategoryDataType) => void;
}

export function ProductCategories({ onRename, onViewProducts }: ProductCategoriesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("categoryPage");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("categorySearch") || "";

  // ===== LOCAL SEARCH STATE (debounced to URL) =====
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search when URL changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce — push to URL after 500 ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch.trim() !== search.trim()) {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearch.trim()) {
          params.set("categorySearch", localSearch.trim());
        } else {
          params.delete("categorySearch");
        }

        params.set("categoryPage", "1");
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, search, searchParams, pathname, router]);

  // ===== API =====
  const { data: apiData, isLoading, isError } = useGetProductCategories({
    page: currentPage,
    size: 10,
    search: search || undefined,
  });

  // ===== MAP API → UI type =====
  const categories = useMemo<ProductCategoryDataType[]>(() => {
    if (!apiData?.results) return [];

    return apiData.results.map((item) => ({
      id: item.id,
      categoryName: item.name,
      productCount: parseInt(item.product_count, 10) || 0,
      status: item.is_active ? "Active" : "Inactive",
    }));
  }, [apiData]);

  // ===== HANDLERS =====
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("categoryPage", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <ProductCategoryTableToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
      />

      {/* Table */}
      <div>
        <ProductCategoryTable
          data={categories}
          isLoading={isLoading}
          isError={isError}
          totalCount={apiData?.totalResults || 0}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onRename={onRename}
          onViewProducts={onViewProducts}
        />
      </div>
    </div>
  );
}
