"use client";

import React, { useState, useCallback } from "react";

import { Search, CheckSquare2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";

import { Input } from "@/components/ui/input";
import type { BulkActionItem } from "@/components/common/dropdowns/BulkActionDropdown";
import { BulkActionDropdown } from "@/components/common/dropdowns/BulkActionDropdown";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";

const submissionStatusFilter = [
  {
    key: "submissionStatus",
    label: "Submission Status",
    items: [
      { key: "pending", label: "Pending" },
      { key: "completed", label: "Completed" },
    ],
  },
];

// ===== TYPES =====

interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onDelete: () => void;
  onAddFeedback: () => void;
  onSendNotification: () => void;
  onSendEmail: () => void;
}

interface TaskSubmissionToolbarProps {
  bulkActions: BulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string | null;
  onStatusFilterChange: (value: string | null) => void;
}

// ===== COMPONENT =====

export function TaskSubmissionToolbar({
  bulkActions,
  selectedCount,
  totalCount,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: TaskSubmissionToolbarProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  const bulkActionItems: BulkActionItem[] = [
    {
      key: isAllSelected ? "clear" : "selectAll",
      label: isAllSelected ? "Clear Selection" : "Select All",
      onClick: isAllSelected ? bulkActions.onClear : bulkActions.onSelectAll,
    },
    {
      key: "delete",
      label: "Delete",
      variant: "danger",
      onClick: () => setDeleteModalOpen(true),
      disabled: !hasSelection,
    },
    {
      key: "addFeedback",
      label: "Add Feedback",
      onClick: bulkActions.onAddFeedback,
      disabled: !hasSelection,
    },
    {
      key: "sendNotification",
      label: "Send Notification",
      onClick: bulkActions.onSendNotification,
      disabled: !hasSelection,
    },
    {
      key: "sendEmail",
      label: "Send Email",
      onClick: bulkActions.onSendEmail,
      disabled: !hasSelection,
    },
  ];

  const handleFilterSelect = useCallback((_categoryKey: string, _itemKey: string, itemLabel: string) => {
    onStatusFilterChange(statusFilter === itemLabel ? null : itemLabel);
  }, [statusFilter, onStatusFilterChange]);

  const handleClearFilter = useCallback(() => {
    onStatusFilterChange(null);
  }, [onStatusFilterChange]);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Full layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {/* Left: Bulk Action + Search */}
          <div className="flex items-center gap-4">
            <BulkActionDropdown items={bulkActionItems} />

            <div className="relative w-[360px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by student name"
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Status Filter */}
          <div className="flex items-center gap-3">
            {statusFilter && (
              <button
                type="button"
                onClick={handleClearFilter}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
            <FilterDropdown
              categories={submissionStatusFilter}
              onFilterSelect={handleFilterSelect}
              label="Submission Status"
              value={statusFilter}
            />
          </div>
        </div>

        {/* ===== TABLET (md-lg): Bulk Action + Search left, Filter right ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {/* Left */}
          <div className="flex items-center gap-3">
            <BulkActionDropdown items={bulkActionItems} className="min-w-[110px]" />

            <div className="relative w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {statusFilter && (
              <button
                type="button"
                onClick={handleClearFilter}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
            <FilterDropdown
              categories={submissionStatusFilter}
              onFilterSelect={handleFilterSelect}
              label="Status"
              value={statusFilter}
            />
          </div>
        </div>

        {/* ===== MOBILE (<md): Search full width, actions row ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {/* Search - Full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by student name"
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>

          {/* Action buttons row - Horizontal scroll like ProductListToolbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {statusFilter && (
              <div className="shrink-0">
                <button
                  title="Clear Filter"
                  type="button"
                  onClick={handleClearFilter}
                  className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B]")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="shrink-0">
              <FilterDropdown
                categories={submissionStatusFilter}
                onFilterSelect={handleFilterSelect}
                label="Submission Status"
                value={statusFilter}
              />
            </div>

            {/* Bulk Action (icon only) - kept at the end or as needed */}
            <div className="shrink-0">
              <BulkActionDropdown items={bulkActionItems} iconOnly triggerIcon={CheckSquare2} />
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          bulkActions.onDelete();
          setDeleteModalOpen(false);
        }}
        title="Confirm Bulk Deletion"
        description={`Are you sure you want to delete ${selectedCount} selected submission(s)? This action cannot be undone.`}
      />
    </>
  );
}
