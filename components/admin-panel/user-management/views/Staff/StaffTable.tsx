"use client";

import React, { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { MoreVertical } from "lucide-react";

import type { StaffDataType } from "@/types/user-management";
import {
  SALARY_STATUS_CONFIG,
  MEMBER_STATUS_CONFIG,
} from "@/types/user-management";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  StaffPaymentHistoryModal,
  type StaffPaymentHistoryData,
} from "@/components/admin-panel/user-management/modals/staff/StaffPaymentHistoryModal";
import { EditStaffModal } from "@/components/admin-panel/user-management/modals/staff/EditStaffModal";
import { StaffPrivilegesModal } from "@/components/admin-panel/user-management/modals/staff/StaffPrivilegesModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";


interface StaffTableProps {
  data: StaffDataType[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
}

export function StaffTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
  totalResults,
}: StaffTableProps) {
  const router = useRouter();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<StaffPaymentHistoryData | null>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffDataType | null>(null);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffDataType | null>(null);

  const [privilegesModalOpen, setPrivilegesModalOpen] = useState(false);
  const [selectedStaffForPrivileges, setSelectedStaffForPrivileges] = useState<StaffDataType | null>(null);

  const itemsPerPage = 10;

  const filteredData = useMemo(() => data || [], [data]);
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const newSelection = Object.fromEntries(filteredData.map((item) => [item.id, true]));

      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  };

  const handleAction = (action: string, staff: StaffDataType) => {
    if (action === "view-profile") {
      router.push(`/admin-panel/user-management/staff/${staff.id}`);

      return;
    } else if (action === "payment-history") {
      setPaymentModalData({
        staffName: staff.name,
        groups: [
          {
            monthLabel: "December, 2025",
            payments: [
              {
                status: "Pending",
                expensesDescription: "December Salary",
              },
              {
                status: "Pending",
                expensesDescription: "Travel Cost",
              },
            ],
          },
          {
            monthLabel: "November, 2025",
            payments: [
              {
                status: "Paid",
                expensesNote: "November Salary",
                paymentMethod: "Bank Transfer",
                note: "Lorem Ipsum",
                paidAmount: "XXXX.00",
                paidDate: "2025/12/01",
              },
            ],
          },
        ],
      });
      setPaymentModalOpen(true);

      return;
    } else if (action === "edit") {
      setStaffToEdit(staff);
      setIsEditModalOpen(true);

      return;
    } else if (action === "deactivate") {
      setSelectedStaff(staff);
      setIsDeactivateModalOpen(true);

      return;
    }

    console.log(`Action: ${action}`, staff);
  };

  const handleDeactivateConfirm = () => {
    console.log("Deactivating staff:", selectedStaff?.id);
    setIsDeactivateModalOpen(false);
  };

  const columns: Column<StaffDataType>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={
            selectedRowCount === filteredData.length && filteredData.length > 0
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
      cell: (staff) => (
        <Checkbox
          checked={!!rowSelection[staff.id]}
          onCheckedChange={(checked) => handleSelectRow(staff.id, !!checked)}
          aria-label={`Select ${staff.name}`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Reg. Date",
      accessorKey: "regDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.regDate}</div>,
    },
    {
      header: "ID No.",
      accessorKey: "idNo",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.idNo}</div>,
    },
    {
      header: "Name",
      accessorKey: "name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="relative inline-flex items-center">
          <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">
            {item.name}
          </div>
          {item.role && (
            <div className="absolute -top-[15px] -right-[14px] flex items-center justify-center gap-1 rounded-[32px] bg-black px-2 py-[2px] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.10),0_1px_3px_0_rgba(16,24,40,0.10)] text-center font-inter text-[8px] font-medium leading-[11px] text-white">
              {item.role}
            </div>
          )}
        </div>
      ),
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          <i className="phone-outgoing h-4 w-4 text-[#64748B]" /> Phone
        </span>
      ),
      accessorKey: "phone",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => (
        item.phone && item.phone !== "-" ? (
          <a
            href={`tel:${item.phone}`}
            className="text-[11px] font-medium text-[#45556C] transition-colors hover:text-[#E60076]"
          >
            {item.phone}
          </a>
        ) : (
          <span className="text-[11px] font-medium text-[#45556C]">{item.phone || "-"}</span>
        )
      ),
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          <i className="whatsapp-logo h-4 w-4 text-[#64748B]" /> WhatsApp
        </span>
      ),
      accessorKey: "whatsApp",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => (
        item.whatsApp && item.whatsApp !== "-" ? (
          <a
            href={`https://wa.me/${item.whatsApp.replace(/\s+/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-[#45556C] transition-colors hover:text-[#E60076]"
          >
            {item.whatsApp}
          </a>
        ) : (
          <span className="text-[11px] font-medium text-[#45556C]">{item.whatsApp || "-"}</span>
        )
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.email}</div>,
    },
    {
      header: "Privileges",
      accessorKey: "privileges",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => (
        <button
          onClick={() => {
            setSelectedStaffForPrivileges(item);
            setPrivilegesModalOpen(true);
          }}
          className="text-[12px] font-semibold text-[#E60076] hover:underline whitespace-nowrap bg-transparent border-none p-0 cursor-pointer"
        >
          View
        </button>
      ),
    },
    {
      header: "Commissions",
      accessorKey: "commissions",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.commissions}</div>,
    },
    {
      header: "Branch",
      accessorKey: "branch",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.branch}</div>,
    },
    {
      header: "Salary Status",
      accessorKey: "salaryStatus",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (staff) => {
        const options = Object.entries(SALARY_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={staff.salaryStatus}
            options={options}
            readOnly
          />
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (staff) => {
        const options = Object.entries(MEMBER_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={staff.status}
            options={options}
            readOnly
          />
        );
      },
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis text-right w-[80px]",
      cell: (staff) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem onClick={() => handleAction("view-profile", staff)} className="cursor-pointer focus:bg-[#FDF2F8]">
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-sms", staff)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send SMS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-email", staff)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("edit", staff)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("staff-report", staff)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Staff Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("deactivate", staff)} className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600">
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
        data={filteredData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        pagination={{
          variant: "simple",
          totalCount: totalResults,
          selectedRowCount,
          currentPage,
          totalPages,
          onPageChange: onPageChange,
        }}
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
      />

      <StaffPaymentHistoryModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        data={paymentModalData}
      />

      {/* Edit Staff Modal */}
      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        staff={staffToEdit}
      />

      {/* Deactivate Staff Modal */}
      <DeleteConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Confirm Deactivation"
        description={`Are you sure you want to deactivate this staff [${selectedStaff?.name}]?`}
        confirmText="Confirm Deactivation"
        confirmVariant="destructive"
      />
      <StaffPrivilegesModal
        isOpen={privilegesModalOpen}
        onClose={() => setPrivilegesModalOpen(false)}
        staffId={selectedStaffForPrivileges?.id || ""}
        staffName={selectedStaffForPrivileges?.name || ""}
        currentPrivileges={selectedStaffForPrivileges?.rawPrivileges || []}
      />
    </>
  );
}
