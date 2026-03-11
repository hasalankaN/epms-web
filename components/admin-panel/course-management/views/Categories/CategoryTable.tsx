"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import type { CategoryDataType } from "@/types/category";
import { CATEGORY_STATUS_CONFIG } from "@/types/category";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryTableProps {
  data: CategoryDataType[];
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRename?: (category: CategoryDataType) => void;
}

export function CategoryTable({
  data,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
  onRename,
}: CategoryTableProps) {
  const itemsPerPage = 10;

  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDataType | null>(null);

  const handleAction = (action: string, category: CategoryDataType) => {
    console.log(`Action: ${action}`, category);
    
    if (action === "rename") {
      onRename?.(category);
    } else if (action === "deactivate") {
      setSelectedCategory(category);
      setIsDeactivateModalOpen(true);
    }
  };

  const handleViewCourses = (category: CategoryDataType) => {
    // TODO: Navigate to view ongoing courses
    console.log("View courses for category:", category.id);
  };

  const handleDeactivateConfirm = () => {
    // Implement actual deactivate logic (e.g., API call)
    console.log("Deactivating category:", selectedCategory?.id);
    setIsDeactivateModalOpen(false);
  };

  const columns: Column<CategoryDataType>[] = [
    {
      header: "Category Name",
      accessorKey: "categoryName",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[400px]",
      cell: (item) => <div className="text-[13px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.categoryName}</div>,
    },
    {
      header: "Ongoing Courses",
      accessorKey: "ongoingCourses",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[200px]",
      cell: (item) => (
        <button 
          onClick={() => handleViewCourses(item)}
          className="text-[13px] font-medium text-[#45556C] hover:text-[#E60076] hover:underline cursor-pointer"
        >
          View
        </button>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (category) => {
        const options = Object.entries(CATEGORY_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={category.status}
            options={options}
            readOnly
          />
        );
      },
    },
    {
      header: "Action",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis text-right w-[100px]",
      cell: (category) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                aria-label="Category actions"
                title="Category actions"
              >
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem onClick={() => handleAction("rename", category)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("deactivate", category)} className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600">
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        showCheckboxes={false}
        pagination={{
          variant: "simple",
          totalCount,
          currentPage,
          totalPages,
          onPageChange: onPageChange,
        }}
      />
      <DeleteConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Confirm Deactivation"
        description={`Are you sure you want to deactivate [${selectedCategory?.categoryName || 'Category Name'}]?`}
        confirmText="Confirm Deactivation"
        cancelText="Go Back"
        confirmVariant="destructive"
      />
    </>
  );
}
