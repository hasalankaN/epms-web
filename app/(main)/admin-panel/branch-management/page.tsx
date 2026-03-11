"use client";

import React, { useState } from "react";

import { BranchToolbar } from "@/components/admin-panel/branch-management/BranchToolbar";
import { BranchTable } from "@/components/admin-panel/branch-management/BranchTable";
import { AddEditBranchModal } from "@/components/admin-panel/branch-management/modals/AddEditBranchModal";
import type { BranchRow, BranchType } from "@/types/branch";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";

export default function BranchManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [branchType, setBranchType] = useState<string | null>(null);
  
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchRow | null>(null);

  const { data, isLoading, isError } = useGetBranches({
    page: currentPage,
    size: 10,
    search: search || undefined,
    branch_type: (branchType as BranchType) || undefined,
  });

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
        onSearchChange={setSearch}
        branchType={branchType}
        onBranchTypeChange={setBranchType}
      />

      {/* Main Data Table */}
      <BranchTable
        data={data?.results || []}
        totalResults={data?.totalResults || 0}
        isLoading={isLoading}
        isError={isError}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
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
