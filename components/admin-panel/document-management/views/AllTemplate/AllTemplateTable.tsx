"use client";

/* eslint-disable padding-line-between-statements */

import React, { useState } from "react";

import { MoreVertical } from "lucide-react";

import {
  DOCUMENT_TYPE_LABELS,
  type DocumentTemplateListItem,
} from "@/types/document";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { IssueDocumentModal } from "@/components/admin-panel/document-management/modals/IssueDocumentModal";
import { EditDocumentModal } from "@/components/admin-panel/document-management/modals/EditDocumentModal";
import { ViewDocumentTemplateModal } from "@/components/admin-panel/document-management/modals/ViewDocumentTemplateModal";
import { ViewAssignmentsModal } from "@/components/admin-panel/document-management/modals/ViewAssignmentsModal";
import { useToggleDocumentTemplateStatus } from "@/hooks/api/documents/useToggleDocumentTemplateStatus";
import { useDeleteDocumentTemplate } from "@/hooks/api/documents/useDeleteDocumentTemplate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DOC_TEMPLATE_STATUS_OPTIONS = [
  { value: "Active", bg: "#DFFFF0", text: "#16A34A" },
  { value: "Inactive", bg: "#F1F5F9", text: "#000000" },
];

// ── Helper: format API item as display object ───────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

interface AllTemplateTableProps {
  data: DocumentTemplateListItem[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function AllTemplateTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  totalCount,
  onPageChange,
}: AllTemplateTableProps) {
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const newSelection = Object.fromEntries(
        data.map((item) => [item.id, true]),
      );

      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<DocumentTemplateListItem | null>(null);

  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueItem, setIssueItem] = useState<DocumentTemplateListItem | null>(
    null,
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<DocumentTemplateListItem | null>(
    null,
  );

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState<DocumentTemplateListItem | null>(
    null,
  );

  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivateItem, setDeactivateItem] =
    useState<DocumentTemplateListItem | null>(null);

  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [activateItem, setActivateItem] =
    useState<DocumentTemplateListItem | null>(null);

  const [assignmentsModalOpen, setAssignmentsModalOpen] = useState(false);
  const [assignmentsItem, setAssignmentsItem] =
    useState<DocumentTemplateListItem | null>(null);

  const handleAction = (action: string, item: DocumentTemplateListItem) => {
    if (action === "delete") {
      setSelectedItem(item);
      setDeleteModalOpen(true);
    } else if (action === "issue") {
      setIssueItem(item);
      setIssueModalOpen(true);
    } else if (action === "edit") {
      setEditItem(item);
      setEditModalOpen(true);
    } else if (action === "view") {
      setViewItem(item);
      setViewModalOpen(true);
    } else if (action === "view-assignments") {
      setAssignmentsItem(item);
      setAssignmentsModalOpen(true);
    } else if (action === "deactivate") {
      setDeactivateItem(item);
      setDeactivateModalOpen(true);
    } else if (action === "activate") {
      setActivateItem(item);
      setActivateModalOpen(true);
    }
  };

  // -- Toggling status hooks --
  const { mutateAsync: toggleDeactivate, isPending: isDeactivating } =
    useToggleDocumentTemplateStatus(deactivateItem?.id || "");
  const { mutateAsync: toggleActivate, isPending: isActivating } =
    useToggleDocumentTemplateStatus(activateItem?.id || "");
  const { mutateAsync: deleteTemplate, isPending: isDeleting } =
    useDeleteDocumentTemplate();

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    try {
      await deleteTemplate(selectedItem.id);

      setDeleteModalOpen(false);
      setSelectedItem(null);
    } catch {
      // toast handled in hook
    }
  };

  const handleDeactivateConfirm = async () => {
    try {
      await toggleDeactivate();
      setDeactivateModalOpen(false);
    } catch {
      // toast handled in hook
    }
  };

  const handleActivateConfirm = async () => {
    try {
      await toggleActivate();
      setActivateModalOpen(false);
    } catch {
      // toast handled in hook
    }
  };

  const columns: Column<DocumentTemplateListItem>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={
            selectedRowCount === data.length && data.length > 0
              ? true
              : selectedRowCount > 0
                ? "indeterminate"
                : false
          }
          onCheckedChange={handleSelectAll}
          aria-label="Select all rows"
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      cell: (item) => (
        <Checkbox
          checked={!!rowSelection[item.id]}
          onCheckedChange={(checked) => handleSelectRow(item.id, !!checked)}
          aria-label={`Select ${item.name}`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Added Date",
      accessorKey: "created_at",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[110px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {formatDate(item.created_at)}
        </div>
      ),
    },
    {
      header: "Document Name",
      accessorKey: "name",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[180px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
          {item.name}
        </div>
      ),
    },
    {
      header: "Document Type",
      accessorKey: "document_type",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {DOCUMENT_TYPE_LABELS[item.document_type] ?? item.document_type}
        </div>
      ),
    },
    {
      header: "Template",
      accessorKey: "id",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <button
          className="text-[11px] font-medium text-[#E60076] hover:underline whitespace-nowrap"
          onClick={() => handleAction("view", item)}
        >
          View
        </button>
      ),
    },
    {
      header: "Assigned Courses/Batches",
      accessorKey: "id",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[180px]",
      cell: (item) => (
        <button
          className="text-[11px] font-medium text-[#E60076] hover:underline whitespace-nowrap"
          onClick={() => handleAction("view-assignments", item)}
        >
          View
        </button>
      ),
    },
    {
      header: "Issued Count",
      accessorKey: "issued_count",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.issued_count}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "is_active",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <StatusPopover
          value={item.is_active ? "Active" : "Inactive"}
          options={DOC_TEMPLATE_STATUS_OPTIONS}
          readOnly
        />
      ),
    },
    {
      header: "Action",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap text-right w-[80px]",
      cell: (item) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem
                onClick={() => handleAction("edit", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Edit
              </DropdownMenuItem>
              {item.is_active ? (
                <>
                  <DropdownMenuItem
                    onClick={() => handleAction("issue", item)}
                    className="cursor-pointer focus:bg-[#FDF2F8]"
                  >
                    Issue
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAction("deactivate", item)}
                    className="cursor-pointer focus:bg-[#FDF2F8]"
                  >
                    Deactivate
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleAction("activate", item)}
                  className="cursor-pointer focus:bg-[#FDF2F8]"
                >
                  Activate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleAction("delete", item)}
                className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600"
              >
                Delete
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
        data={data}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        pagination={{
          variant: "simple",
          totalCount,
          selectedRowCount,
          currentPage,
          totalPages,
          onPageChange,
        }}
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        description="Are you sure you want to delete this document template? This action cannot be undone."
        isDeleting={isDeleting}
      />

      <DeleteConfirmationModal
        isOpen={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Confirm Deactivation"
        description={`Are you sure you want to deactivate ${deactivateItem?.name}?`}
        confirmText="Confirm Deactivation"
        cancelText="Go Back"
        confirmVariant="destructive"
        isDeleting={isDeactivating}
      />

      <DeleteConfirmationModal
        isOpen={activateModalOpen}
        onClose={() => setActivateModalOpen(false)}
        onConfirm={handleActivateConfirm}
        title="Confirm Activation"
        description={`Are you sure you want to activate ${activateItem?.name}?`}
        confirmText="Confirm Re-Activation"
        cancelText="Go Back"
        confirmVariant="primary"
        isDeleting={isActivating}
      />

      <IssueDocumentModal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        templateId={issueItem?.id}
        documentName={issueItem?.name}
        documentType={issueItem?.document_type}
      />

      <EditDocumentModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        templateId={editItem?.id ?? null}
      />

      <ViewDocumentTemplateModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        templateId={viewItem?.id ?? null}
        templateName={viewItem?.name ?? ""}
      />

      <ViewAssignmentsModal
        isOpen={assignmentsModalOpen}
        onClose={() => setAssignmentsModalOpen(false)}
        templateId={assignmentsItem?.id ?? null}
        templateName={assignmentsItem?.name ?? ""}
      />
    </>
  );
}
