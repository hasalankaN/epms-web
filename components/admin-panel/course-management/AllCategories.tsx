"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import type { CategoryDataType } from "@/types/category";

import { useGetCategories } from "@/hooks/api/course-categories/useGetCategories";

import { CategoryTableToolbar } from "./views/Categories/CategoryTableToolbar";
import { CategoryTable } from "./views/Categories/CategoryTable";

interface AllCategoriesProps {
  onRename?: (category: CategoryDataType) => void;
}

export function AllCategories({ onRename }: AllCategoriesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("categoryPage");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";

  // ===== SEARCH STATE =====
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search when URL changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch.trim() !== search.trim()) {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearch.trim()) {
          params.set("search", localSearch.trim());
        } else {
          params.delete("search");
        }

        params.set("categoryPage", "1");
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, search, searchParams, pathname, router]);

  // ===== API HOOK =====
  const { data: apiData, isLoading, isError } = useGetCategories({
    page: currentPage,
    size: 10,
    search: search || undefined,
  });

  const categories = useMemo(() => {
    if (!apiData?.results) return [];

    return apiData.results.map(item => ({
      id: item.id,
      categoryName: item.name,
      ongoingCourses: item.ongoingCourses || 0, // Use backend value if provided, else 0
      status: item.is_active ? "Active" : "Inactive",
    })) as CategoryDataType[];
  }, [apiData]);

  // ===== HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("categoryPage", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <CategoryTableToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
      />

      {/* Category Table */}
      <div className="mt-4">
        <CategoryTable
          data={categories}
          isLoading={isLoading}
          isError={isError}
          totalCount={apiData?.totalResults || 0}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onRename={onRename}
        />
      </div>
    </div>
  );
}
