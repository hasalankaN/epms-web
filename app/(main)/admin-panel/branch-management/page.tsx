"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { BranchToolbar } from "@/components/admin-panel/branch-management/BranchToolbar";
import { BranchTable } from "@/components/admin-panel/branch-management/BranchTable";
import { AddEditBranchModal } from "@/components/admin-panel/branch-management/modals/AddEditBranchModal";
import type { BranchRow, BranchType } from "@/types/branch";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";

export default function BranchManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get values from URL or defaults
  const currentPage = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const branchType = searchParams.get("branch_type") || null;
  
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchRow | null>(null);

  const { data, isLoading, isError } = useGetBranches({
    page: currentPage,
    size: 10,
    search: search || undefined,
    branch_type: (branchType as BranchType) || undefined,
  });

  // Helper to update query params
  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset page to 1 if filter/search changes, unless page itself is being updated
    if (!updates.page && (updates.search !== undefined || updates.branch_type !== undefined)) {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleOpenAddModal = () => {
    setSelectedBranch(null);
    setIsBranchModalOpen(true);
  };

  const handleOpenEditModal = (branch: BranchRow) => {
    setSelectedBranch(branch);
    setIsBranchModalOpen(true);
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Toolbar */}
      <BranchToolbar 
        onAddBranch={handleOpenAddModal} 
        search={search}
        onSearchChange={(val) => updateQueryParams({ search: val })}
        branchType={branchType}
        onBranchTypeChange={(val) => updateQueryParams({ branch_type: val })}
      />

      {/* Main Data Table */}
      <BranchTable
        data={data?.results || []}
        totalResults={data?.totalResults || 0}
        isLoading={isLoading}
        isError={isError}
        currentPage={currentPage}
        onPageChange={(page) => updateQueryParams({ page: page.toString() })}
        onEditBranch={handleOpenEditModal}
      />

      {/* Add / Edit Branch modal */}
      <AddEditBranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        branch={selectedBranch}
      />
    </div>
  );
}
