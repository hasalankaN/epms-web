"use client";

import React, { useState, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { CourseStatsRow } from "./views/Courses/CourseStatsRow";
import { CourseTableToolbar } from "./views/Courses/CourseTableToolbar";
import { CourseTable } from "./views/Courses/CourseTable";
import { useGetCourses, mapApiCourseToCourseDataType } from "@/hooks/api/courses/useGetCourses";

const ITEMS_PER_PAGE = 10;

export function AllCourses() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const searchParam = searchParams.get("search") || "";

  const activeUrlFilters = {
    status: searchParams.get("status") || undefined,
    category_id: searchParams.get("category_id") || undefined,
    lecturer_id: searchParams.get("lecturer_id") || undefined,
    staff_id: searchParams.get("staff_id") || undefined,
    language: searchParams.get("language") || undefined,
  };

  // ===== SEARCH DEBOUNCE STATE =====
  const [searchInput, setSearchInput] = useState(searchParam);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // ===== SHARED STATE =====
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // ===== FETCH COURSES =====
  const { data, isLoading, isError } = useGetCourses({
    page: currentPage,
    size: ITEMS_PER_PAGE,
    search: searchParam || undefined,
    ...activeUrlFilters,
  });

  const courses = (data?.results ?? []).map(mapApiCourseToCourseDataType);
  const totalResults = data?.totalResults ?? 0;

  // ===== HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.set("page", "1"); // Reset page on search
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleApplyFilters = useCallback((filters: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set("page", "1"); // Reset page on filter
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Keep only search and tab params, reset everything else
    const searchVal = params.get("search");
    const tabVal = params.get("tab");
    
    // Clear all existing params
    Array.from(params.keys()).forEach(key => params.delete(key));
    
    // Re-apply preserved params
    if (searchVal) params.set("search", searchVal);
    if (tabVal) params.set("tab", tabVal);
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);


  return (
    <div className="flex flex-col gap-4">
      {/* Stats Row */}
      <CourseStatsRow />

      {/* Separator Line */}
      <div className="mt-4 h-[1px] w-full bg-[#E2E8F0]" />

      {/* Table Toolbar */}
      <div className="mt-4">
        <CourseTableToolbar 
           search={searchInput}
           onSearchChange={handleSearchChange}
           onApplyFilters={handleApplyFilters}
           onClearFilters={handleClearFilters}
           activeUrlFilters={activeUrlFilters}
        />
      </div>

      {/* Course Table */}
      <div className="mt-4">
        <CourseTable
          data={courses}
          currentPage={currentPage}
          totalResults={totalResults}
          onPageChange={handlePageChange}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}
