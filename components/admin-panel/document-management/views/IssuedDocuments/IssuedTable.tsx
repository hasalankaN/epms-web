"use client";

/* eslint-disable padding-line-between-statements */

import React, { useCallback, useState } from "react";

import { MoreVertical } from "lucide-react";

import type { IssuedDocumentApiItem } from "@/types/document";
import { DOCUMENT_TYPE_LABELS } from "@/types/document";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteIssuedDocument } from "@/hooks/api/documents/useDeleteIssuedDocument";
import { useResendDocument } from "@/hooks/api/documents/useResendDocument";

function formatDate(iso: string | null): string {
  if (!iso) return "-";

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

const ISSUED_DOC_STATUS_OPTIONS = [
  { value: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
  { value: "In Progress", bg: "#D9E9FF", text: "#2563EB" },
  { value: "Downloaded", bg: "#DFFFF0", text: "#16A34A" },
  { value: "Delivered", bg: "#DFFFF0", text: "#16A34A" },
];

interface IssuedTableProps {
  data: IssuedDocumentApiItem[];
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

export function IssuedTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  totalCount,
  onPageChange,
}: IssuedTableProps) {
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
  const [deleteReason, setDeleteReason] = useState("");
  const [selectedItem, setSelectedItem] =
    useState<IssuedDocumentApiItem | null>(null);

  const { mutateAsync: deleteDocument, isPending: isDeleting } =
    useDeleteIssuedDocument();
  const { mutateAsync: resendDocument, isPending: isResending } =
    useResendDocument();

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedItem || deleteReason.trim().length < 5) return;

    try {
      await deleteDocument({
        id: selectedItem.id,
        reason: deleteReason.trim(),
      });
      setDeleteModalOpen(false);
      setSelectedItem(null);
      setDeleteReason("");
    } catch {
      // toast handled in hook
    }
  }, [selectedItem, deleteReason, deleteDocument]);

  const handleAction = useCallback(
    async (action: string, item: IssuedDocumentApiItem) => {
      if (action === "delete") {
        setSelectedItem(item);
        setDeleteReason("");
        setDeleteModalOpen(true);
      } else if (action === "email") {
        try {
          await resendDocument(item.id);
        } catch {
          // toast handled in hook
        }
      } else if (
        (action === "view" || action === "print") &&
        item.file_snapshot_url
      ) {
        window.open(item.file_snapshot_url, "_blank");
      }
    },
    [resendDocument],
  );

  const columns: Column<IssuedDocumentApiItem>[] = [
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
          aria-label="Select row"
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Student Name",
      accessorKey: "student_name",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.student_name ?? "—"}
        </div>
      ),
    },
    {
      header: "Document Name",
      accessorKey: "template_name",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.template_name ?? "—"}
        </div>
      ),
    },
    {
      header: "Courses/Batches Name",
      accessorKey: "source_name",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[170px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.source_name ?? "—"}
        </div>
      ),
    },
    {
      header: "Document Type",
      accessorKey: "document_type_snapshot",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {DOCUMENT_TYPE_LABELS[
            item.document_type_snapshot as keyof typeof DOCUMENT_TYPE_LABELS
          ] ?? item.document_type_snapshot}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => (
        <StatusPopover
          value={item.status}
          options={ISSUED_DOC_STATUS_OPTIONS}
          readOnly={true}
        />
      ),
    },
    {
      header: "Issued Date",
      accessorKey: "issued_at",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {formatDate(item.issued_at)}
        </div>
      ),
    },
    {
      header: "Verification No",
      accessorKey: "document_code",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.document_code}
        </div>
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
              {item.file_snapshot_url && (
                <DropdownMenuItem
                  onClick={() => handleAction("view", item)}
                  className="cursor-pointer focus:bg-[#FDF2F8]"
                >
                  View
                </DropdownMenuItem>
              )}
              {item.file_snapshot_url && (
                <DropdownMenuItem
                  onClick={() => handleAction("print", item)}
                  className="cursor-pointer focus:bg-[#FDF2F8]"
                >
                  Print
                </DropdownMenuItem>
              )}
              {(item.issued_method === "EMAIL" ||
                item.issued_method === "BOTH") && (
                <DropdownMenuItem
                  onClick={() => handleAction("email", item)}
                  disabled={isResending}
                  className="cursor-pointer focus:bg-[#FDF2F8]"
                >
                  {isResending ? "Sending..." : "Resend Email"}
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
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteReason("");
          setSelectedItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Issued Document"
        description="This will soft-delete the issued document. A reason is required for audit purposes."
        isDeleting={isDeleting}
        requiresReason
        reason={deleteReason}
        onReasonChange={setDeleteReason}
        reasonPlaceholder="Enter deletion reason (min. 5 characters)..."
      />
    </>
  );
}
