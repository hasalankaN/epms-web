"use client";

import React, { useState } from "react";

import { format } from "date-fns";
import { MoreVertical } from "lucide-react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PaymentDetailsModal } from "@/components/admin-panel/user-management/view/student/PaymentDetailsModal";
import type { PaymentDetails } from "@/components/admin-panel/user-management/view/student/PaymentDetailsModal";
import { AddDiscountModal } from "@/components/admin-panel/user-management/view/student/AddDiscountModal";
import type { DiscountDetails } from "@/components/admin-panel/user-management/view/student/AddDiscountModal";

import type { EnrolledBatchItem, PaymentHistoryItem, InstallmentItem } from "@/types/user-management";

interface StudentEnrolledBatchesProps {
  data?: EnrolledBatchItem[];
  total?: number;
  paymentHistory?: PaymentHistoryItem[];
  installments?: InstallmentItem[];
  isLoading?: boolean;
}

export function StudentEnrolledBatches({ 
  data = [], 
  total = 0, 
  paymentHistory = [],
  installments = [],
  isLoading 
}: StudentEnrolledBatchesProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    details: PaymentDetails | null;
  }>({ isOpen: false, details: null });

  const [discountModal, setDiscountModal] = useState<{
    isOpen: boolean;
    details: DiscountDetails | null;
  }>({ isOpen: false, details: null });

  const itemsPerPage = 10;
  const totalCount = total;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const handleAction = (action: string, batch: EnrolledBatchItem) => {
    if (action === "view-payment") {
      let details: PaymentDetails | null = null;
      
      if (batch.payment_type === "FULL") {
        const history = paymentHistory.filter(h => h.enrollment_id === batch.enrollment_id);

        details = {
          mode: "one-time",
          title: batch.batch_name,
          transactions: history.map(h => ({
            transactionNote: "Batch Fee",
            paymentType: "One-Time",
            paymentMethod: h.method || "-",
            bank: "-",
            viewSlip: !!h.receipt_url,
            status: h.status === "PAID" ? "Paid" : h.status === "PENDING" ? "Pending" : "Unpaid",
            paidAmount: h.amount,
          }))
        };
      } else {
        const batchInstallments = installments.filter(i => i.enrollment_id === batch.enrollment_id);

        details = {
          mode: "installment",
          title: batch.batch_name,
          summary: {
            paymentType: "Installment",
            transactionNote: "Batch Fee",
            totalPayment: batch.total_amount,
            discountedAmount: batchInstallments.reduce((acc, curr) => acc + parseFloat(curr.total_discounts || "0"), 0).toFixed(2),
            totalPaid: batchInstallments.reduce((acc, curr) => acc + parseFloat(curr.paid_amount || "0"), 0).toFixed(2),
            dueAmount: batchInstallments.reduce((acc, curr) => acc + parseFloat(curr.due_amount || "0"), 0).toFixed(2),
            installments: batchInstallments.map(i => ({
              transactionNote: i.title || `Installment ${i.installment_number}`,
              paymentType: "Installment",
              paymentMethod: "-",
              bank: "-",
              status: i.status === "PAID" ? "Paid" : i.status === "PAYMENT_PENDING" ? "Pending" : "Unpaid",
              paidAmount: i.paid_amount,
            }))
          }
        };
      }

      setPaymentModal({ isOpen: true, details });
    }

    if (action === "add-discount") {
      const batchInstallments = installments.filter(i => i.enrollment_id === batch.enrollment_id);
      let details: DiscountDetails;

      if (batch.payment_type === "FULL") {
        details = {
          mode: "one-time",
          title: batch.batch_name,
          actualAmount: batch.total_amount,
          discountRecords: [], // Simplified for one-time
        };
      } else {
        details = {
          mode: "installment",
          title: batch.batch_name,
          summary: {
            transactionNote: "Batch Fee",
            paymentType: "Installment",
            totalPayment: batch.total_amount,
            discountedAmount: batchInstallments.reduce((acc, curr) => acc + parseFloat(curr.total_discounts || "0"), 0).toFixed(2),
            totalPaid: batchInstallments.reduce((acc, curr) => acc + parseFloat(curr.paid_amount || "0"), 0).toFixed(2),
            dueAmount: batchInstallments.reduce((acc, curr) => acc + parseFloat(curr.due_amount || "0"), 0).toFixed(2),
            installments: batchInstallments.map(i => ({
              transactionNote: i.title || `Installment ${i.installment_number}`,
              paymentType: "Installment",
              paymentMethod: "-",
              bank: "-",
              status: i.status === "PAID" ? "Paid" : i.status === "PAYMENT_PENDING" ? "Pending" : "Unpaid",
              amount: i.due_amount,
              offerAmount: i.total_discounts,
              offerBy: "N/A",
              viewSlip: false,
            }))
          }
        };
      }

      setDiscountModal({ isOpen: true, details });
    }
  };

  const columns: Column<EnrolledBatchItem>[] = [
    {
      header: "Enrolled Date",
      accessorKey: "enrolled_at",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          {item.enrolled_at ? format(new Date(item.enrolled_at), "yyyy/MM/dd") : "-"}
        </div>
      ),
    },
    {
      header: "Batch Title",
      accessorKey: "batch_name",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.batch_name}</div>,
    },
    {
      header: () => <div className="text-center w-full">Progress</div>,
      accessorKey: "progress_percentage",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const isCompleted = item.progress_percentage === 100;
        const isPartial = item.progress_percentage > 0 && item.progress_percentage < 100;

        return (
          <div className={`text-[12px] font-inter text-center font-medium leading-[16px] whitespace-nowrap overflow-hidden text-ellipsis ${isCompleted ? 'text-[#16A34A]' : isPartial ? 'text-[#2563EB]' : 'text-[#45556C]'}`}>
            {item.progress_percentage}% Completed
          </div>
        );
      },
    },
    {
      header: () => <div className="text-center w-full">Course Status</div>,
      accessorKey: "lifecycle_status",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const status = item.lifecycle_status;
        const isCompleted = status === "COMPLETED";
        const isActive = status === "ACTIVE";

        return (
          <div className={`text-[12px] font-inter text-center font-medium leading-[16px] whitespace-nowrap overflow-hidden text-ellipsis ${isCompleted ? 'text-[#16A34A]' : isActive ? 'text-[#2563EB]' : 'text-[#EF4444]'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </div>
        );
      },
    },
    {
      header: () => <div className="text-center w-full">Certificate Status</div>,
      accessorKey: "certificate_status",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const options = [
          { value: "Issued", label: "Issued", bg: "#DFFFF0", text: "#16A34A" },
          { value: "Pending", label: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
        ];
        
        return (
          <div className="flex justify-center w-full">
            <StatusPopover
              value={item.certificate_status}
              options={options}
              readOnly
            />
          </div>
        );
      },
    },
    {
      header: () => <div className="text-center w-full">Payment Type</div>,
      accessorKey: "payment_type",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => (
        <div className="text-[12px] font-medium text-center text-[#45556C]">
          {item.payment_type === "FULL" ? "One Time" : "Installment"}
        </div>
      ),
    },
    {
      header: () => <div className="text-center w-full">Payment Status</div>,
      accessorKey: "financial_status",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const status = item.financial_status;
        const isPaid = status === "PAID";
        const isPartial = status === "PARTIALLY_PAID";

        let statusText = status.replace(/_/g, " ").toLowerCase();

        statusText = statusText.charAt(0).toUpperCase() + statusText.slice(1);

        return (
          <div className={`text-[12px] font-inter font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis leading-[16px] ${isPaid ? 'text-[#16A34A]' : isPartial ? 'text-[#2563EB]' : 'text-[#FB2C36]'}`}>
            {statusText}
          </div>
        );
      },
    },
    {
      header: "Action",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis text-right w-[80px]",
      cell: (item) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem onClick={() => handleAction("view-payment", item)} className="cursor-pointer focus:bg-[#FDF2F8]">
                View Payment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("add-discount", item)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Add Discount
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("email-invoice", item)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Email Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col">
        <h2 className="font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
          Enrolled Batches
        </h2>

        <div className="mt-[8px] w-full max-w-full overflow-hidden">
          <DataTable
            data={data}
            columns={columns}
            keyExtractor={(item) => item.enrollment_id}
            showCheckboxes={false}
            tableContainerClassName="h-auto"
            isLoading={isLoading}
            pagination={{
              variant: "simple",
              totalCount: totalCount,
              currentPage: currentPage,
              totalPages: totalPages,
              onPageChange: setCurrentPage,
            }}
          />
        </div>
      </div>

      <PaymentDetailsModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, details: null })}
        details={paymentModal.details}
      />

      <AddDiscountModal
        isOpen={discountModal.isOpen}
        onClose={() => setDiscountModal({ isOpen: false, details: null })}
        details={discountModal.details}
      />
    </>
  );
}
