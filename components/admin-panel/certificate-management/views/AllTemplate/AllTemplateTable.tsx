"use client";

import React, { useState } from "react";

import { MoreVertical } from "lucide-react";

import type { CertificateTemplateItem } from "@/types/certificate";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { EditCertificateModal } from "@/components/admin-panel/certificate-management/modals/EditCertificateModal";
import { IssueTemplateModal } from "@/components/admin-panel/certificate-management/modals/IssueCertificateTemplateModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewCertificateTemplateModal } from "@/components/admin-panel/certificate-management/modals/ViewCertificateTemplateModal";
import { useActivateTemplate } from "@/hooks/api/certificates/useActivateTemplate";
import { useDeactivateTemplate } from "@/hooks/api/certificates/useDeactivateTemplate";
import { useDeleteCertificateTemplate } from "@/hooks/api/certificates/useDeleteCertificateTemplate";

const TEMPLATE_STATUS_OPTIONS = [
  { value: "ACTIVE", bg: "#DFFFF0", text: "#16A34A" },
  { value: "INACTIVE", bg: "#F1F5F9", text: "#000000" },
];

interface AllTemplateTableProps {
  data: CertificateTemplateItem[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  totalCount: number;
  totalPages: number;
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
  totalPages,
  onPageChange,
}: AllTemplateTableProps) {
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CertificateTemplateItem | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<CertificateTemplateItem | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState<CertificateTemplateItem | null>(null);

  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueItem, setIssueItem] = useState<CertificateTemplateItem | null>(null);

  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivateItem, setDeactivateItem] = useState<CertificateTemplateItem | null>(null);

  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [activateItem, setActivateItem] = useState<CertificateTemplateItem | null>(null);

  const { mutate: activateTemplate, isPending: isActivating } = useActivateTemplate();
  const { mutate: deactivateTemplate, isPending: isDeactivating } = useDeactivateTemplate();
  const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteCertificateTemplate();

  const handleAction = (action: string, item: CertificateTemplateItem) => {
    if (action === "delete") {
      setSelectedItem(item);
      setDeleteModalOpen(true);
    } else if (action === "edit") {
      setEditItem(item);
      setEditModalOpen(true);
    } else if (action === "issue") {
      setIssueItem(item);
      setIssueModalOpen(true);
    } else if (action === "deactivate") {
      setDeactivateItem(item);
      setDeactivateModalOpen(true);
    } else if (action === "activate") {
      setActivateItem(item);
      setActivateModalOpen(true);
    }
  };

  const columns: Column<CertificateTemplateItem>[] = [
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
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {new Date(item.created_at).toLocaleDateString("en-GB").replace(/\//g, "/")}
        </div>
      ),
    },
    {
      header: "Certificate Name",
      accessorKey: "name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[160px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.name}
        </div>
      ),
    },
    {
      header: "Template",
      accessorKey: "template_file_url",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => (
        <button
          onClick={() => { setViewItem(item); setViewModalOpen(true); }}
          className="text-[11px] font-medium text-[#E60076] hover:underline whitespace-nowrap"
        >
          View
        </button>
      ),
    },
    {
      header: "Assigned Courses/Batches",
      accessorKey: "id",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[180px]",
      cell: () => (
        <button className="text-[11px] font-medium text-[#90A1B9] cursor-not-allowed whitespace-nowrap" disabled>
          — N/A
        </button>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.pricing_type === "FREE" ? (
            <span className="font-semibold uppercase">Free</span>
          ) : (
            `LKR ${parseFloat(item.price ?? "0").toLocaleString("en-LK", { minimumFractionDigits: 2 })}`
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => (
        <StatusPopover
          value={item.status}
          options={TEMPLATE_STATUS_OPTIONS}
          readOnly
        />
      ),
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap text-right w-[80px]",
      cell: (item) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem onClick={() => handleAction("edit", item)} className="cursor-pointer focus:bg-[#FDF2F8]">Edit</DropdownMenuItem>
              {item.status === "ACTIVE" ? (
                <>
                  <DropdownMenuItem onClick={() => handleAction("issue", item)} className="cursor-pointer focus:bg-[#FDF2F8]">Issue</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("deactivate", item)} className="cursor-pointer focus:bg-[#FDF2F8]">Deactivate</DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => handleAction("activate", item)} className="cursor-pointer focus:bg-[#FDF2F8]">Activate</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleAction("delete", item)} className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600">Delete</DropdownMenuItem>
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
        onConfirm={() => {
          if (selectedItem) {
            deleteTemplate(selectedItem.id, {
              onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedItem(null);
              },
            });
          }
        }}
        isDeleting={isDeleting}
        title="Confirm Deletion"
        description="Are you sure you want to delete this certificate template? This action cannot be undone."
      />

      <ViewCertificateTemplateModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        certificate={viewItem}
      />

      <DeleteConfirmationModal
        isOpen={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={() => {
          if (deactivateItem) {
            deactivateTemplate(deactivateItem.id, {
              onSuccess: () => setDeactivateModalOpen(false),
            });
          }
        }}
        title="Confirm Deactivation"
        description={`Are you sure you want to deactivate ${deactivateItem?.name}?`}
        isDeleting={isDeactivating}
        confirmText="Confirm Deactivation"
        cancelText="Go Back"
        confirmVariant="destructive"
      />

      <DeleteConfirmationModal
        isOpen={activateModalOpen}
        onClose={() => setActivateModalOpen(false)}
        onConfirm={() => {
          if (activateItem) {
            activateTemplate(activateItem.id, {
              onSuccess: () => setActivateModalOpen(false),
            });
          }
        }}
        title="Confirm Activation"
        description={`Are you sure you want to activate ${activateItem?.name}?`}
        isDeleting={isActivating}
        confirmText="Confirm Re - Activation"
        cancelText="Go Back"
        confirmVariant="primary"
      />

      <EditCertificateModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        certificate={editItem}
      />

      <IssueTemplateModal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        templateName={issueItem?.name}
        onIssue={(issueData) => {
          console.log("Issuing certificate:", issueData);
        }}
      />
    </>
  );
}
