"use client";

import React, { useState, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { format } from "date-fns";
import { Search, MoreHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { ExportDropdown } from "@/components/common/dropdowns/ExportDropdown";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import { DISTRICTS } from "@/lib/constants/districts";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";
import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useDebounce } from "@/hooks/useDebounce";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

interface EnrollTableToolbarProps {
  totalCount: number;
  onExportCSV: () => Promise<void>;
  isExportingCSV?: boolean;
}

export function EnrollTableToolbar({ onExportCSV, isExportingCSV = false }: EnrollTableToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Initialize active filters from URL
  const [activeFilters, setActiveFilters] = useState<FilterSelections>(() => {
    const filters: FilterSelections = {};

    const getParam = (key: string, targetKey: string) => {
      const val = searchParams.get(key);

      if (val) filters[targetKey] = val.split(",");
    };

    getParam("enrollment_type", "type");
    getParam("district", "district");
    getParam("gender", "gender");
    getParam("batch_or_course_id", "batch_or_course");
    getParam("lifecycle_status", "status");
    getParam("enrollment_target", "scope");

    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    if (dateFrom && dateTo) {
      filters["date"] = { start: new Date(dateFrom), end: new Date(dateTo) };
    }

    return filters;
  });

  // Sync search input with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }

    if (searchParams.get("search") !== (debouncedSearchTerm || null)) {
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearchTerm, router, pathname, searchParams]);

  // Sync internal state with URL filters when URL changes
  useEffect(() => {
    const filters: FilterSelections = {};

    const getParam = (key: string, targetKey: string) => {
      const val = searchParams.get(key);

      if (val) filters[targetKey] = val.split(",");
    };

    getParam("enrollment_type", "type");
    getParam("district", "district");
    getParam("gender", "gender");
    getParam("batch_or_course_id", "batch_or_course");
    getParam("lifecycle_status", "status");
    getParam("enrollment_target", "scope");

    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    if (dateFrom && dateTo) {
      filters["date"] = { start: new Date(dateFrom), end: new Date(dateTo) };
    }

    setActiveFilters(filters);
  }, [searchParams]);

  // Pagination state for filters
  const [batchPage, setBatchPage] = useState(1);
  const [allBatches, setAllBatches] = useState<any[]>([]);
  const [coursePage, setCoursePage] = useState(1);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  // Fetch batches and courses for filtering
  const { data: batchesData, isFetching: isFetchingBatches } = useGetBatches({ page: batchPage, size: 20 });
  const { data: coursesData, isFetching: isFetchingCourses } = useGetCourses({ page: coursePage, size: 20 });

  // Accumulate results
  useEffect(() => {
    if (batchesData?.results) {
      setAllBatches(prev => {
        const existingIds = new Set(prev.map(b => b.id));
        const newUnique = batchesData.results.filter(b => !existingIds.has(b.id));
        
        return [...prev, ...newUnique];
      });
    }
  }, [batchesData]);

  useEffect(() => {
    if (coursesData?.results) {
      setAllCourses(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const newUnique = coursesData.results.filter(c => !existingIds.has(c.id));
        
        return [...prev, ...newUnique];
      });
    }
  }, [coursesData]);

  const handleBatchShowMore = useCallback(() => {
    if (batchesData && !batchesData.isLastPage) {
      setBatchPage(prev => prev + 1);
    }
  }, [batchesData]);

  const handleCourseShowMore = useCallback(() => {
    if (coursesData && !coursesData.isLastPage) {
      setCoursePage(prev => prev + 1);
    }
  }, [coursesData]);

  const enrollFilterCategories: FilterCategory[] = [
    { 
      key: "date", 
      label: "By Date", 
      type: "dateRange",
    },
    { 
      key: "type", 
      label: "Enrollment Type", 
      type: "chips",
      items: [
        { key: "DIRECT", label: "Direct" },
        { key: "REFERRAL", label: "Referral" },
      ],
    },
    { 
      key: "district", 
      label: "By District", 
      type: "chips",
      items: DISTRICTS.map(d => ({ key: d.toLowerCase(), label: d })),
    },
    { 
      key: "gender", 
      label: "By Gender", 
      type: "chips",
      items: [
        { key: "MALE", label: "Male" },
        { key: "FEMALE", label: "Female" },
      ],
    },
    { 
      key: "batch_or_course", 
      label: "By Batch or Course", 
      type: "chips",
      items: [
        ...allBatches.map(b => ({ key: b.id, label: b.name })),
        ...allCourses.map(c => ({ key: c.id, label: c.name })),
      ],
      onShowMore: () => {
        handleBatchShowMore();
        handleCourseShowMore();
      },
      hasMore: (batchesData ? !batchesData.isLastPage : false) || (coursesData ? !coursesData.isLastPage : false),
      isLoading: isFetchingBatches || isFetchingCourses,
    },
    { 
      key: "status", 
      label: "Enroll Status", 
      type: "chips",
      items: [
        { key: "ONGOING", label: "On Going" },
        { key: "PENDING", label: "Pending" },
        { key: "COMPLETED", label: "Completed" },
        { key: "HOLD", label: "Hold" },
        { key: "DROPPED", label: "Dropped" },
      ],
    },
    { 
      key: "scope", 
      label: "Batch or Course Type", 
      type: "chips",
      items: [
        { key: "COURSE", label: "Course" },
        { key: "BATCH", label: "Batch" },
      ],
    },
  ];

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    setActiveFilters(selections);
    
    const params = new URLSearchParams(searchParams.toString());
    
    const setOrDelete = (selKey: string, paramKey: string) => {
      const val = selections[selKey];

      if (Array.isArray(val) && val.length > 0) {
        params.set(paramKey, val.join(","));
      } else {
        params.delete(paramKey);
      }
    };

    setOrDelete("type", "enrollment_type");
    setOrDelete("district", "district");
    setOrDelete("gender", "gender");
    setOrDelete("batch_or_course", "batch_or_course_id");
    setOrDelete("status", "lifecycle_status");
    setOrDelete("scope", "enrollment_target");

    const dateVal = selections["date"] as { start: Date | null; end: Date | null };

    if (dateVal && dateVal.start) {
      params.set("date_from", format(dateVal.start, "yyyy-MM-dd"));
      params.set("date_to", format(dateVal.end || dateVal.start, "yyyy-MM-dd"));
    } else {
      params.delete("date_from");
      params.delete("date_to");
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    
    const params = new URLSearchParams(searchParams.toString());

    params.delete("enrollment_type");
    params.delete("district");
    params.delete("gender");
    params.delete("batch_or_course_id");
    params.delete("lifecycle_status");
    params.delete("enrollment_target");
    params.delete("date_from");
    params.delete("date_to");

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Full layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {/* Left: Search Bar only (no bulk dropdown) */}
          <div className="flex w-full items-center gap-4">
            <div className="relative w-full max-w-[450px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by Name, ID, Phone Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter + CSV (separate buttons) */}
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
            <FilterModalTrigger
              onClick={() => setFilterModalOpen(true)}
              label="Filter Option"
              className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
            />
            <button
              className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}
              onClick={onExportCSV}
              disabled={isExportingCSV}
            >
              <i className="file-csv h-4 w-4" />
              {isExportingCSV ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>

        {/* ===== TABLET (md-lg): Search left, Filter + Export dropdown right ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {/* Left: Search Bar */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-[350px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter + Export Dropdown */}
          <div className="flex items-center gap-3">
             {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
            <FilterModalTrigger
              onClick={() => setFilterModalOpen(true)}
              label="Filter"
              className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
            />
            <ExportDropdown
              items={[
                { key: "csv", label: isExportingCSV ? "Exporting..." : "Export CSV", icon: (() => <i className="file-csv h-4 w-4" />) as any, onClick: onExportCSV },
              ]}
            />
          </div>
        </div>

        {/* ===== MOBILE (<md): Search full width, action buttons row ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {/* Search - Full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search by Student Name, ID, Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>

          {/* Action buttons row: Filter + More */}
          <div className="flex items-center gap-3">
            {/* Filter (icon only) */}
            {hasActiveFilters && (
              <button
                title="Clear Filters"
                type="button"
                onClick={handleClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <FilterModalTrigger
              onClick={() => setFilterModalOpen(true)}
              iconOnly
              className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
            />

            {/* More Actions Dropdown (CSV) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button title="More Options" className={cn(BUTTON_STYLES.outline.md, "px-3")}>
                  <MoreHorizontal className="h-4 w-4 text-[#0F172B]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[160px]">
                <DropdownMenuItem
                  onClick={onExportCSV}
                  disabled={isExportingCSV}
                  className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]"
                >
                  <i className="file-csv mr-2 h-4 w-4" />
                  {isExportingCSV ? "Exporting..." : "Export CSV"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={enrollFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={activeFilters}
      />
    </>
  );
}
