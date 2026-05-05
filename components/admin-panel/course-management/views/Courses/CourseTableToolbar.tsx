"use client";

import React, { useState, useCallback, useMemo } from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";

import { Input } from "@/components/ui/input";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";

import { useGetCategories } from "@/hooks/api/course-categories/useGetCategories";
import { useGetLecturers } from "@/hooks/api/lecturers/useGetLecturers";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";

interface CourseTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
  activeUrlFilters: {
    status?: string;
    category_id?: string;
    lecturer_id?: string;
    staff_id?: string;
    language?: string;
    batch_id?: string;
  };
}

export function CourseTableToolbar({
  search,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  activeUrlFilters,
}: CourseTableToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Pagination state for filters
  const [categorySize, setCategorySize] = useState(10);
  const [batchSize, setBatchSize] = useState(10);
  const [lecturerSize, setLecturerSize] = useState(10);
  const [staffSize, setStaffSize] = useState(10);

  // Fetch data dynamically for the filter modal
  const { data: categoriesData } = useGetCategories({ size: categorySize });
  const { data: lecturersData } = useGetLecturers({ size: lecturerSize });
  const { data: staffData } = useGetStaff({ size: staffSize });
  const { data: batchesData } = useGetBatches({ size: batchSize });

  const categories = useMemo<FilterCategory[]>(() => [
    { 
      key: "category_id", 
      label: "By Course Category", 
      type: "chips",
      multiSelect: false,
      items: categoriesData?.results.map(c => ({ key: c.id, label: c.name })) || [],
      onShowMore: () => setCategorySize(prev => prev + 10),
      hasMore: categoriesData ? !categoriesData.isLastPage : false,
    },
    { 
      key: "language", 
      label: "By Language", 
      type: "chips",
      multiSelect: false,
      items: [
        { key: "ENGLISH", label: "English" },
        { key: "SINHALA", label: "Sinhala" },
        { key: "TAMIL", label: "Tamil" },
      ],
    },
    { 
      key: "batch_id", 
      label: "By Batch", 
      type: "chips",
      multiSelect: false,
      items: batchesData?.results.map(b => ({ key: b.id, label: b.name })) || [],
      onShowMore: () => setBatchSize(prev => prev + 10),
      hasMore: batchesData ? !batchesData.isLastPage : false,
    },
    { 
      key: "lecturer_id", 
      label: "By Lecturer", 
      type: "chips",
      multiSelect: false,
      items: lecturersData?.results.map(l => ({ key: l.user_id, label: `${l.first_name} ${l.last_name}` })) || [],
      onShowMore: () => setLecturerSize(prev => prev + 10),
      hasMore: lecturersData ? !lecturersData.isLastPage : false,
    },
    { 
      key: "staff_id", 
      label: "By Staff", 
      type: "chips",
      multiSelect: false,
      items: staffData?.results.map(s => ({ key: s.userId, label: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unknown Staff' })) || [],
      onShowMore: () => setStaffSize(prev => prev + 10),
      hasMore: staffData ? !staffData.isLastPage : false,
    },
    { 
      key: "status", 
      label: "By Course Status", 
      type: "chips",
      multiSelect: false,
      items: [
        { key: "ACTIVE", label: "Active" },
        { key: "DRAFT", label: "Draft" },
        { key: "INACTIVE", label: "Inactive" },
      ],
    },
  ], [categoriesData, batchesData, lecturersData, staffData]);

  const initialSelections = useMemo(() => {
    const selections: FilterSelections = {};

    if (activeUrlFilters.category_id) selections.category_id = activeUrlFilters.category_id.split(",");
    if (activeUrlFilters.status) selections.status = activeUrlFilters.status.split(",");
    if (activeUrlFilters.language) selections.language = activeUrlFilters.language.split(",");
    if (activeUrlFilters.lecturer_id) selections.lecturer_id = activeUrlFilters.lecturer_id.split(",");
    if (activeUrlFilters.staff_id) selections.staff_id = activeUrlFilters.staff_id.split(",");
    if (activeUrlFilters.batch_id) selections.batch_id = activeUrlFilters.batch_id.split(",");

    return selections;
  }, [activeUrlFilters]);

  // Check if there are any active filters
  const hasActiveFilters = Object.values(activeUrlFilters).some(v => v !== undefined && v !== "");

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    const updates: Record<string, string | null> = {
      category_id: null,
      status: null,
      language: null,
      lecturer_id: null,
      staff_id: null,
      batch_id: null,
    };

    if (selections.category_id && Array.isArray(selections.category_id) && selections.category_id.length > 0) updates.category_id = selections.category_id.join(",");
    if (selections.status && Array.isArray(selections.status) && selections.status.length > 0) updates.status = selections.status.join(",");
    if (selections.language && Array.isArray(selections.language) && selections.language.length > 0) updates.language = selections.language.join(",");
    if (selections.lecturer_id && Array.isArray(selections.lecturer_id) && selections.lecturer_id.length > 0) updates.lecturer_id = selections.lecturer_id.join(",");
    if (selections.staff_id && Array.isArray(selections.staff_id) && selections.staff_id.length > 0) updates.staff_id = selections.staff_id.join(",");
    if (selections.batch_id && Array.isArray(selections.batch_id) && selections.batch_id.length > 0) updates.batch_id = selections.batch_id.join(",");

    onApplyFilters(updates);
  }, [onApplyFilters]);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Search and Filter layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {/* Left: Search */}
          <div className="flex items-center gap-4">
            <div className="relative w-[440px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search By Course Name"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter */}
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
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
          </div>
        </div>

        {/* ===== TABLET (md-lg): Search left, Filter right ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {/* Left: Search */}
          <div className="flex items-center gap-3">
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search By Course Name..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter */}
          <div className="flex items-center gap-3">
             {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
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
          </div>
        </div>

        {/* ===== MOBILE (<md): Search full width, filter button ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {/* Search - Full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search By Course Name"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>

          {/* Action buttons row: Filter */}
          <div className="flex items-center gap-3">
            {/* Filter (icon only) */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B]")}
                aria-label="Clear filters"
                title="Clear filters"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <FilterModalTrigger
              onClick={() => setFilterModalOpen(true)}
              iconOnly
              className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
              aria-label="Filter courses"
            />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={categories}
        onApply={handleApplyFilters}
        initialSelections={initialSelections}
      />
    </>
  );
}
