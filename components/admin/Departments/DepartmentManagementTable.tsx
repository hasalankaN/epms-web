"use client";

import React, { useState, useMemo } from "react";
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Building2,
  MapPin,
  Phone,
  Layers,
} from "lucide-react";

import { DataTable, Column } from "@/components/common/table/DataTable";
import { DepartmentTableToolbar } from "./DepartmentTableToolbar";
import { DepartmentModal } from "./DepartmentModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  useDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from "@/hooks/api/departments/useDepartments";
import type {
  DepartmentItem,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "@/types/dto/department.dto";
import { MOCK_DEPARTMENTS } from "@/data/userManagementData";

const ITEMS_PER_PAGE = 8;

// Fallback initial data in case backend is offline or empty during dev
const INITIAL_FALLBACK_DEPARTMENTS: DepartmentItem[] = MOCK_DEPARTMENTS.map(
  (d, idx) => ({
    id: d.value,
    departmentName: d.label,
    location:
      idx % 2 === 0
        ? "Colombo HQ - Floor 3"
        : idx % 3 === 0
        ? "Kandy Regional Branch"
        : "Main Tech Tower - Level 4",
    deptPhone: `+94 11 200 440${idx + 1}`,
    employeeCount: Math.floor(Math.random() * 20) + 5,
  })
);

export function DepartmentManagementTable() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentItem | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<DepartmentItem | null>(null);

  // Queries & Mutations
  const { data: apiResponse, isLoading, isError } = useDepartmentsQuery({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    search: search.trim() || undefined,
  });

  const createMutation = useCreateDepartmentMutation();
  const updateMutation = useUpdateDepartmentMutation();
  const deleteMutation = useDeleteDepartmentMutation();

  // Determine items to display (fallback to mock if API returns empty array or error)
  const displayItems: DepartmentItem[] = useMemo(() => {
    if (apiResponse?.items) {
      return apiResponse.items;
    }
    // If backend returns nothing or error, filter our fallback items by search
    if (search.trim()) {
      const q = search.toLowerCase();
      return INITIAL_FALLBACK_DEPARTMENTS.filter(
        (d) =>
          d.departmentName.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.deptPhone.toLowerCase().includes(q)
      );
    }
    return INITIAL_FALLBACK_DEPARTMENTS;
  }, [apiResponse, search]);

  const totalCount = apiResponse?.total ?? displayItems.length;
  const totalPages = apiResponse?.totalPages ?? Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  // Handlers
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: DepartmentItem) => {
    setEditingDepartment(dept);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateDepartmentDto | UpdateDepartmentDto) => {
    try {
      if ("id" in data && data.id) {
        await updateMutation.mutateAsync({
          id: data.id,
          payload: data,
        });
      } else {
        await createMutation.mutateAsync(data as CreateDepartmentDto);
      }
      setIsModalOpen(false);
      setEditingDepartment(null);
    } catch {
      // toast is handled in mutation
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDepartment) return;
    try {
      await deleteMutation.mutateAsync(deletingDepartment.id);
      setDeletingDepartment(null);
    } catch {
      // toast is handled in mutation
    }
  };

  // Columns definition
  const columns: Column<DepartmentItem>[] = [
    {
      id: "department",
      header: "Department Name",
      cell: (item) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 text-indigo-600 dark:text-indigo-300 font-semibold text-xs border border-indigo-200/50 dark:border-indigo-800/40">
            {(item.departmentName || "DP").substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              {item.departmentName || "Unnamed Department"}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              ID: {item.id ? (item.id.length > 12 ? `${item.id.substring(0, 8)}...` : item.id) : "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "location",
      header: "Office Location",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{item.location}</span>
        </div>
      ),
    },
    {
      id: "deptPhone",
      header: "Contact / Phone",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="font-mono text-[11px]">{item.deptPhone}</span>
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
    {
      id: "actions",
      header: "",
      headerClassName: "w-12 text-right",
      className: "w-12 text-right",
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              aria-label={`Actions for ${item.departmentName}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => handleOpenEdit(item)}
              className="flex items-center gap-2 text-xs cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5 text-slate-500" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeletingDepartment(item)}
              className="flex items-center gap-2 text-xs text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Department
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <DepartmentTableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        totalCount={totalCount}
        filteredCount={displayItems.length}
        onCreateClick={handleOpenCreate}
      />

      {/* Table */}
      <DataTable<DepartmentItem>
        data={displayItems}
        columns={columns}
        keyExtractor={(item) => item.id || item.department_id || item.departmentName}
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

      {/* Create / Edit Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDepartment(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingDepartment}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingDepartment}
        onClose={() => setDeletingDepartment(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        description={`Are you sure you want to permanently delete the "${deletingDepartment?.departmentName}" department? Employees assigned to this department may need reassignment.`}
        isDeleting={deleteMutation.isPending}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
      />
    </div>
  );
}
