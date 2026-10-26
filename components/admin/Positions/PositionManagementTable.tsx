"use client";

import React, { useState, useMemo } from "react";
import {
  Briefcase,
  Calendar,
  FileText,
} from "lucide-react";

import { DataTable, Column } from "@/components/common/table/DataTable";
import { PositionTableToolbar } from "./PositionTableToolbar";
import { PositionModal } from "./PositionModal";
import { PositionBadge } from "./PositionBadge";
import { Badge } from "@/components/ui/badge";

import {
  usePositionsQuery,
  useCreatePositionMutation,
} from "@/hooks/api/positions/usePositions";
import type {
  PositionItem,
  CreatePositionDto,
} from "@/types/dto/position.dto";
import { MOCK_POSITIONS } from "@/data/userManagementData";

const ITEMS_PER_PAGE = 8;

// Fallback initial mock data if API is offline or returns empty during local demo
const INITIAL_FALLBACK_POSITIONS: PositionItem[] = MOCK_POSITIONS.map(
  (p, idx) => ({
    id: p.value,
    positionName: p.label,
    description: `Core role responsible for ${p.label.toLowerCase()} responsibilities, reporting to department head.`,
    effectiveDate: `2025-0${(idx % 9) + 1}-15`,
    employeeCount: Math.floor(Math.random() * 12) + 1,
  })
);

export function PositionManagementTable() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Queries & Mutations
  const { data: apiResponse, isLoading, isError } = usePositionsQuery({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    search: search.trim() || undefined,
  });

  const createMutation = useCreatePositionMutation();

  // Determine items to display
  const displayItems: PositionItem[] = useMemo(() => {
    if (apiResponse?.items) {
      return apiResponse.items;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return INITIAL_FALLBACK_POSITIONS.filter(
        (p) =>
          p.positionName.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return INITIAL_FALLBACK_POSITIONS;
  }, [apiResponse, search]);

  const totalCount = apiResponse?.total ?? displayItems.length;
  const totalPages = apiResponse?.totalPages ?? Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  // Handlers
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: CreatePositionDto) => {
    try {
      await createMutation.mutateAsync(data);
      setIsModalOpen(false);
    } catch {
      // toast is handled in mutation
    }
  };

  // Columns definition
  const columns: Column<PositionItem>[] = [
    {
      id: "position",
      header: "Job Role / Title",
      cell: (item) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 text-purple-600 dark:text-purple-300 font-semibold text-xs border border-purple-200/50 dark:border-purple-800/40">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              {item.positionName}
            </p>
            <div className="mt-0.5">
              <PositionBadge title={item.positionName} />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "description",
      header: "Description & Responsibilities",
      cell: (item) => (
        <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300 max-w-[340px]">
          <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2 leading-relaxed text-[11px]">
            {item.description || "No description provided."}
          </span>
        </div>
      ),
    },
    {
      id: "effectiveDate",
      header: "Effective Date",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="font-mono text-[11px]">
            {item.effectiveDate
              ? new Date(item.effectiveDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Immediate"}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: () => (
        <Badge variant="active" className="text-[11px] font-normal">
          Active
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <PositionTableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        totalCount={totalCount}
        filteredCount={displayItems.length}
        onCreateClick={handleOpenCreate}
      />

      {/* Table */}
      <DataTable<PositionItem>
        data={displayItems}
        columns={columns}
        keyExtractor={(item) => item.id || item.position_id || item.positionName}
        isLoading={isLoading}
        isError={isError}
        showCheckboxes={false}
        tableContainerClassName="h-auto"
        pagination={{
          variant: "simple",
          currentPage,
          totalPages,
          totalCount,
          itemsPerPage: ITEMS_PER_PAGE,
          onPageChange: setCurrentPage,
        }}
      />

      {/* Create Modal */}
      <PositionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
