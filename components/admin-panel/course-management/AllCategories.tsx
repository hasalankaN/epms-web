"use client";

import React, { useState, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import type { CategoryDataType, CategoryStatus } from "@/types/category";

import { CategoryTableToolbar } from "./views/Categories/CategoryTableToolbar";
import { CategoryTable } from "./views/Categories/CategoryTable";

// ===== MOCK DATA =====
const mockCategories: CategoryDataType[] = Array.from({ length: 100 }, (_, i) => ({
  id: `category-${i + 1}`,
  categoryName: i % 2 === 0 ? "Category 1" : "Category 2",
  ongoingCourses: Math.floor(Math.random() * 20) + 1,
  status: (["Active", "Inactive"] as CategoryStatus[])[i % 2],
}));

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

  // ===== SHARED STATE =====
  const [data] = useState<CategoryDataType[]>(mockCategories);

  // ===== HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("categoryPage", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <CategoryTableToolbar />

      {/* Category Table */}
      <div className="mt-4">
        <CategoryTable
          data={data}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onRename={onRename}
        />
      </div>
    </div>
  );
}
