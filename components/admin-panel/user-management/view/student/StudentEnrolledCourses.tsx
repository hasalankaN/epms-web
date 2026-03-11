"use client";

import React, { useState } from "react";

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

interface EnrolledCourse {
  id: string;
  enrolledDate: string;
  courseCategory: string;
  courseTitle: string;
  assignmentStatus: string;
  courseStatus: string;
  certificateStatus: string;
  paymentType: string;
  paymentStatus: string;
}

const MOCK_DATA: EnrolledCourse[] = [
  {
    id: "1",
    enrolledDate: "2025/01/21",
    courseCategory: "lorem",
    courseTitle: "Lorem Ipsum",
    assignmentStatus: "Completed",
    courseStatus: "Completed",
    certificateStatus: "Issued",
    paymentType: "One Time",
    paymentStatus: "Paid",
  },
  {
    id: "2",
    enrolledDate: "2025/01/21",
    courseCategory: "lorem",
    courseTitle: "Lorem Ipsum",
    assignmentStatus: "80% Completed",
    courseStatus: "80% Completed",
    certificateStatus: "Pending",
    paymentType: "Installment",
    paymentStatus: "Pending XXXX.00",
  },
  {
    id: "3",
    enrolledDate: "2025/01/22",
    courseCategory: "lorem",
    courseTitle: "Pending Course",
    assignmentStatus: "10% Completed",
    courseStatus: "0% Completed",
    certificateStatus: "Pending",
    paymentType: "Installment",
    paymentStatus: "Pending XXXX.00",
  },
];

// Mock payment details keyed by course id
const MOCK_PAYMENT_DETAILS: Record<string, PaymentDetails> = {
  "1": {
    mode: "one-time",
    title: "Lorem Ipsum",
    transactions: [
      {
        transactionNote: "Course/Batch Fee",
        paymentType: "One-Time",
        paymentMethod: "Bank Transfer",
        bank: "Name of Bank\nBranch",
        viewSlip: true,
        status: "Paid",
        paidAmount: "XXXX.00",
      },
      {
        transactionNote: "Course/Batch Fee",
        paymentType: "One-Time",
        paymentMethod: "Card Payment",
        bank: "Name of Bank\nBranch",
        viewSlip: false,
        status: "Paid",
        paidAmount: "XXXX.00",
      },
    ],
  },
  "2": {
    mode: "installment",
    title: "Lorem Ipsum",
    summary: {
      paymentType: "Installment",
      transactionNote: "Course/Batch Fee",
      totalPayment: "XXXX.00",
      discountedAmount: "XXXX.00",
      totalPaid: "XXXX.00",
      dueAmount: "XXXX.00",
      installments: [
        {
          transactionNote: "1st Installment",
          paymentType: "Installment",
          paymentMethod: "Card Payment",
          bank: "Name of Bank\nBranch",
          status: "Paid",
          paidAmount: "XXXX.00",
        },
      ],
    },
  },
  "3": {
    mode: "installment",
    title: "Pending Course",
    summary: {
      paymentType: "Installment",
      transactionNote: "Course/Batch Fee",
      totalPayment: "XXXX.00",
      discountedAmount: "XXXX.00",
      totalPaid: "XXXX.00",
      dueAmount: "XXXX.00",
      installments: [
        {
          transactionNote: "1st Installment",
          paymentType: "Installment",
          paymentMethod: "Card Payment",
          bank: "Name of Bank\nBranch",
          status: "Paid",
          paidAmount: "XXXX.00",
        },
        {
          transactionNote: "2nd Installment",
          paymentType: "Installment",
          paymentMethod: "-",
          bank: "-",
          status: "Pending",
          paidAmount: "XXXX.00",
        },
      ],
    },
  },
};

// Mock discount details keyed by course id
const MOCK_DISCOUNT_DETAILS: Record<string, DiscountDetails> = {
  "1": {
    mode: "one-time",
    title: "Lorem Ipsum",
    actualAmount: "XXXX.00",
    discountRecords: [
      { actualAmount: "XXXX.00", offerAmount: "XXXX.00", offerBy: "Admin Name" },
      { actualAmount: "XXXX.00", offerAmount: "XXXX.00", offerBy: "Admin Name" },
    ],
  },
  "2": {
    mode: "installment",
    title: "Lorem Ipsum",
    summary: {
      transactionNote: "Course/Batch Fee",
      paymentType: "Installment",
      totalPayment: "XXXX.00",
      discountedAmount: "XXXX.00",
      totalPaid: "XXXX.00",
      dueAmount: "XXXX.00",
      installments: [
        {
          transactionNote: "1st Installment",
          paymentType: "Installment",
          paymentMethod: "Card Payment",
          bank: "Name of Bank\nBranch",
          status: "Paid",
          amount: "XXXX.00",
          offerAmount: "XXXX.00",
          offerBy: "Admin Name",
          viewSlip: false,
        },
        {
          transactionNote: "2nd Installment",
          paymentType: "Installment",
          paymentMethod: "Bank Transfer",
          bank: "Name of Bank\nBranch",
          status: "Paid",
          amount: "XXXX.00",
          offerAmount: "XXXX.00",
          offerBy: "Admin Name",
          viewSlip: true,
        },
        {
          transactionNote: "3rd Installment",
          status: "Pending",
          amount: "XXXX.00",
          offerAmount: "XXXX.00",
          offerBy: "Admin Name",
        },
      ],
    },
  },
  "3": {
    mode: "installment",
    title: "Pending Course",
    summary: {
      transactionNote: "Course/Batch Fee",
      paymentType: "Installment",
      totalPayment: "XXXX.00",
      discountedAmount: "XXXX.00",
      totalPaid: "XXXX.00",
      dueAmount: "XXXX.00",
      installments: [
        {
          transactionNote: "1st Installment",
          paymentType: "Installment",
          paymentMethod: "Bank Transfer",
          bank: "Name of Bank\nBranch",
          status: "Paid",
          amount: "XXXX.00",
          offerAmount: "XXXX.00",
          offerBy: "Admin Name",
          viewSlip: true,
        },
        {
          transactionNote: "2nd Installment",
          status: "Pending",
          amount: "XXXX.00",
          offerAmount: "XXXX.00",
          offerBy: "Admin Name",
        },
      ],
    },
  },
};

export function StudentEnrolledCourses() {
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
  const totalCount = MOCK_DATA.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginatedData = MOCK_DATA.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = (action: string, course: EnrolledCourse) => {
    if (action === "view-payment") {
      const details = MOCK_PAYMENT_DETAILS[course.id] ?? null;

      setPaymentModal({ isOpen: true, details });
    }

    if (action === "add-discount") {
      const details = MOCK_DISCOUNT_DETAILS[course.id] ?? null;

      setDiscountModal({ isOpen: true, details });
    }
  };

  const columns: Column<EnrolledCourse>[] = [
    {
      header: "Enrolled Date",
      accessorKey: "enrolledDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.enrolledDate}</div>,
    },
    {
      header: "Course Category",
      accessorKey: "courseCategory",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.courseCategory}</div>,
    },
    {
      header: "Course Title",
      accessorKey: "courseTitle",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.courseTitle}</div>,
    },
    {
      header: () => <div className="text-center w-full">Assignment Status</div>,
      accessorKey: "assignmentStatus",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const isCompleted = item.assignmentStatus === "Completed";
        const isPartial = item.assignmentStatus.includes("% Completed");

        return (
          <div className={`text-[12px] font-inter text-center font-medium leading-[16px] whitespace-nowrap overflow-hidden text-ellipsis ${isCompleted ? 'text-[#16A34A]' : isPartial ? 'text-[#2563EB]' : 'text-[#45556C]'}`}>
            {item.assignmentStatus}
          </div>
        );
      },
    },
    {
      header: () => <div className="text-center w-full">Course Status</div>,
      accessorKey: "courseStatus",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const isCompleted = item.courseStatus === "Completed";
        const isPartial = item.courseStatus.includes("% Completed");

        return (
          <div className={`text-[12px] font-inter text-center font-medium leading-[16px] whitespace-nowrap overflow-hidden text-ellipsis ${isCompleted ? 'text-[#16A34A]' : isPartial ? 'text-[#2563EB]' : 'text-[#45556C]'}`}>
            {item.courseStatus}
          </div>
        );
      },
    },
    {
      header: () => <div className="text-center w-full">Certificate Status</div>,
      accessorKey: "certificateStatus",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const options = [
          { value: "Issued", label: "Issued", bg: "#DFFFF0", text: "#16A34A" },
          { value: "Pending", label: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
        ];

        return (
          <div className="flex justify-center w-full">
            <StatusPopover
              value={item.certificateStatus}
              options={options}
              readOnly
            />
          </div>
        );
      },
    },
    {
      header: () => <div className="text-center w-full">Payment Type</div>,
      accessorKey: "paymentType",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-center text-[#45556C]">{item.paymentType}</div>,
    },
    {
      header: () => <div className="text-center w-full">Payment Status</div>,
      accessorKey: "paymentStatus",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const isCompleted = item.paymentStatus === "Paid" || item.paymentStatus === "Completed";

        return (
          <div className={`text-[12px] font-inter font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis leading-[16px] ${isCompleted ? 'text-[#16A34A]' : 'text-[#FB2C36]'}`}>
            {item.paymentStatus}
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
          Enrolled Course
        </h2>

        <div className="mt-[8px] w-full max-w-full overflow-hidden">
          <DataTable
            data={paginatedData}
            columns={columns}
            keyExtractor={(item) => item.id}
            showCheckboxes={false}
            tableContainerClassName="h-auto"
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
