"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import type { CertificateTemplateRow } from "@/types/certificate";

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

const TEMPLATE_STATUS_OPTIONS = [
  { value: "Active", bg: "#DFFFF0", text: "#16A34A" },
  { value: "Inactive", bg: "#F1F5F9", text: "#000000" },
];

interface AllTemplateTableProps {
  data: CertificateTemplateRow[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function AllTemplateTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
}: AllTemplateTableProps) {
  const itemsPerPage = 10;

  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage]);

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
  const [selectedItem, setSelectedItem] = useState<CertificateTemplateRow | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<CertificateTemplateRow | null>(null);

  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueItem, setIssueItem] = useState<CertificateTemplateRow | null>(null);

  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivateItem, setDeactivateItem] = useState<CertificateTemplateRow | null>(null);

  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [activateItem, setActivateItem] = useState<CertificateTemplateRow | null>(null);

  const handleAction = (action: string, item: CertificateTemplateRow) => {
    console.log(`Action: ${action}`, item);

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

  const columns: Column<CertificateTemplateRow>[] = [
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
          aria-label={`Select ${item.certificateName}`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Added Date",
      accessorKey: "addedDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.addedDate}</div>,
    },
    {
      header: "Certificate Name",
      accessorKey: "certificateName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[160px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.certificateName}</div>,
    },
    {
      header: "Template",
      accessorKey: "template",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: () => (
        <button className="text-[11px] font-medium text-[#E60076] hover:underline whitespace-nowrap">View</button>
      ),
    },
    {
      header: "Assigned Courses/Batches",
      accessorKey: "assignedCoursesBatches",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[180px]",
      cell: () => (
        <button className="text-[11px] font-medium text-[#E60076] hover:underline whitespace-nowrap">View</button>
      ),
    },
    {
      header: "Issued Number",
      accessorKey: "issuedNumber",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.issuedNumber}</div>,
    },
    {
      header: "Price",
      accessorKey: "price",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.price}</div>,
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
              {item.status === "Active" ? (
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
        data={paginatedData}
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
          console.log("Deleting:", selectedItem?.id);
          setDeleteModalOpen(false);
        }}
        title="Confirm Deletion"
        description="Are you sure you want to delete this certificate template? This action cannot be undone."
      />

      <DeleteConfirmationModal
        isOpen={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={() => {
          console.log("Deactivating:", deactivateItem?.id);
          setDeactivateModalOpen(false);
        }}
        title="Confirm Deactivation"
        description={`Are you sure you want to deactivate ${deactivateItem?.certificateName}?`}
        confirmText="Confirm Deactivation"
        cancelText="Go Back"
        confirmVariant="destructive"
      />

      <DeleteConfirmationModal
        isOpen={activateModalOpen}
        onClose={() => setActivateModalOpen(false)}
        onConfirm={() => {
          console.log("Activating:", activateItem?.id);
          setActivateModalOpen(false);
        }}
        title="Confirm Activation"
        description={`Are you sure you want to activate ${activateItem?.certificateName}?`}
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
        templateName={issueItem?.certificateName}
        onIssue={(data) => {
          console.log("Issuing certificate:", data);
        }}
      />
    </>
  );
}
