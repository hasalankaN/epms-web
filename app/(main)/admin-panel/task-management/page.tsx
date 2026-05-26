"use client";

import React, { useState, useCallback } from "react";

import { TaskTableToolbar } from "@/components/admin-panel/task-management/TaskTableToolbar";
import { TaskTable } from "@/components/admin-panel/task-management/TaskTable";
import { useGetTasks } from "@/hooks/api/tasks/useGetTasks";
import { useBulkDeleteTasks } from "@/hooks/api/tasks/useBulkDeleteTasks";
import { useDebounce } from "@/hooks/useDebounce";
import type { FilterSelections } from "@/components/common/filters/FilterModal";

export default function TaskManagementPage() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterSelections>({});

  const debouncedSearch = useDebounce(search, 300);

  // Build API params from filters

  const typeFilter = Array.isArray(filters.type)
    ? (filters.type[0] as "BATCH" | "STAFF" | undefined)
    : undefined;

  const statusFilter = Array.isArray(filters.status)
    ? (filters.status[0] as "PENDING" | "COMPLETED" | undefined)
    : undefined;

  const dateRange = filters.date as { from?: string; to?: string } | undefined;

  const { data, isLoading, isError } = useGetTasks({
    page: currentPage,
    size: 10,
    search: debouncedSearch || undefined,
    type: typeFilter,
    status: statusFilter,
    date_from: dateRange?.from,
    date_to: dateRange?.to,
  });

  const bulkDeleteMutation = useBulkDeleteTasks();

  const selectedIds = Object.entries(rowSelection)
    .filter(([, selected]) => selected)
    .map(([id]) => id);

  const selectedCount = selectedIds.length;

  const handleSelectAll = useCallback(() => {
    if (!data?.results) {
      return;
    }

    const newSelection: Record<string, boolean> = {};

    data.results.forEach((item) => {
      newSelection[item.id] = true;
    });
    setRowSelection(newSelection);
  }, [data]);

  const handleClear = useCallback(() => {
    setRowSelection({});
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedIds.length === 0) {
      return;
    }

    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => setRowSelection({}),
    });
  }, [selectedIds, bulkDeleteMutation]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setRowSelection({});
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterSelections) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Toolbar */}
      <TaskTableToolbar
        selectedCount={selectedCount}
        totalCount={data?.totalResults ?? 0}
        searchValue={search}
        onSearchChange={handleSearchChange}
        activeFilters={filters}
        onFiltersChange={handleFiltersChange}
        bulkActions={{
          onSelectAll: handleSelectAll,
          onClear: handleClear,
          onDelete: handleDelete,
        }}
      />

      {/* Main Data Table */}
      <TaskTable
        data={data?.results ?? []}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalCount={data?.totalResults ?? 0}
        totalPages={data?.totalPages ?? 1}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
