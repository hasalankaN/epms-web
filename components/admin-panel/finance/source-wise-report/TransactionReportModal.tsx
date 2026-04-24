"use client";

import React, { useMemo } from "react";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import api from "@/lib/axios";
import { useGetSourceWiseDetail } from "@/hooks/api/finances/useGetSourceWise";

// ===== TYPES =====

interface TransactionItem {
  id: string;
  date: string;
  description: string;
  batchCourseProduct: string;
  amount: string;
}

interface TransactionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionSource: string;
  transactionVia: string;
  dateFrom?: string;
  dateTo?: string;
}

// ===== HELPERS =====

function formatDate(raw: string | null | undefined): string {
  if (!raw) return "—";

  try {
    const d = new Date(raw);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    
return `${y}/${m}/${day}`;
  } catch {
    return raw;
  }
}

function formatAmount(raw: string | number | null | undefined): string {
  const n = Number(raw ?? 0);

  
return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ===== INNER TABLE COMPONENT =====

function ReportTable({
  items,
  totalAmount,
  totalBgClass,
}: {
  items: TransactionItem[];
  totalAmount: string;
  totalBgClass: string;
}) {
  return (
    <>
      {/* Desktop/Tablet Table */}
      <div className="hidden sm:block overflow-hidden rounded-[8px] border border-[#E2E8F0]">
        <Table className="min-w-full">
          <TableHeader className="bg-pink-50">
            <TableRow className="border-none hover:bg-pink-50">
              <TableHead className="py-3 pl-4 pr-2 text-[13px] font-semibold text-[#1D293D] w-[100px]">Date</TableHead>
              <TableHead className="py-3 px-2 text-[13px] font-semibold text-[#1D293D] w-[140px]">Description</TableHead>
              <TableHead className="py-3 px-2 text-[13px] font-semibold text-[#1D293D]">Batch/Course/Product</TableHead>
              <TableHead className="py-3 pl-2 pr-4 text-[13px] font-semibold text-[#1D293D] text-right w-[110px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-sm text-[#90A1B9]">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} className="border-b border-[#F1F5F9] last:border-none hover:bg-transparent">
                  <TableCell className="py-3 pl-4 pr-2 text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.date}</TableCell>
                  <TableCell className="py-3 px-2 text-[12px] font-medium text-[#45556C]">{item.description}</TableCell>
                  <TableCell className="py-3 px-2 text-[12px] font-medium text-[#45556C]">{item.batchCourseProduct}</TableCell>
                  <TableCell className="py-3 pl-2 pr-4 text-[12px] font-medium text-[#45556C] text-right whitespace-nowrap">{item.amount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter className={totalBgClass}>
            <TableRow className="border-t border-[#E2E8F0] hover:bg-transparent h-14">
              <TableCell colSpan={3} className="py-3 px-4 text-base font-semibold leading-6 text-[#45556C]">Total</TableCell>
              <TableCell className="py-3 pl-2 pr-4 text-base font-semibold leading-6 text-[#45556C] text-right whitespace-nowrap">{totalAmount}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Mobile Card List */}
      <div className="flex flex-col gap-2 sm:hidden">
        {items.length === 0 ? (
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 text-center text-sm text-[#90A1B9]">
            No transactions found
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-[#64748B]">{item.date}</span>
                <span className="text-[12px] font-semibold text-[#1D293D]">{item.amount}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-[#45556C] line-clamp-2">{item.description}</span>
                <span className="text-[10px] font-medium text-[#94A3B8]">{item.batchCourseProduct}</span>
              </div>
            </div>
          ))
        )}
        {/* Mobile Total Card */}
        <div className={cn("flex items-center justify-between rounded-lg border border-[#E2E8F0] p-4 shadow-sm", totalBgClass)}>
          <span className="text-base font-semibold text-[#45556C]">Total</span>
          <span className="text-base font-semibold text-[#45556C]">{totalAmount}</span>
        </div>
      </div>
    </>
  );
}


// ===== MAIN MODAL =====

export function TransactionReportModal({
  isOpen,
  onClose,
  transactionSource,
  transactionVia,
  dateFrom,
  dateTo,
}: TransactionReportModalProps) {
  const { data, isLoading } = useGetSourceWiseDetail(
    transactionVia,
    { date_from: dateFrom, date_to: dateTo, size: 500 },
    isOpen
  );

  const { incomeItems, expenseItems, incomeTotal, expenseTotal, balance } = useMemo(() => {
    const rows = data?.data ?? [];

    const income = rows.filter((r) => r.transaction_type === "INCOME");
    const expenses = rows.filter((r) => r.transaction_type === "EXPENSE");

    const incomeSum = income.reduce((acc, r) => acc + Number(r.amount ?? 0), 0);
    const expenseSum = expenses.reduce((acc, r) => acc + Number(r.amount ?? 0), 0);
    const bal = incomeSum - expenseSum;

    const toItems = (list: typeof rows): TransactionItem[] =>
      list.map((r, i) => ({
        id: `${r.transaction_date}-${i}`,
        date: formatDate(r.transaction_date),
        description: r.description || "—",
        batchCourseProduct: r.source_name || "—",
        amount: formatAmount(r.amount),
      }));

    return {
      incomeItems: toItems(income),
      expenseItems: toItems(expenses),
      incomeTotal: `+${formatAmount(incomeSum)}`,
      expenseTotal: `-${formatAmount(expenseSum)}`,
      balance: `${bal >= 0 ? "+" : ""}${formatAmount(bal)}`,
    };
  }, [data]);

  const handleExportCSV = async () => {
    try {
      const params: Record<string, string> = {};

      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const response = await api.get(
        API_ENDPOINTS.finances.SOURCE_WISE_EXPORT(transactionVia),
        { params, responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `source-wise-${transactionVia.toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // silently fail; toast could be added here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        animateChildren={true}
        className="flex max-h-[90vh] w-[95%] max-w-[704px] flex-col gap-0 overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        {/* ===== HEADER ===== */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 px-6 py-5 shrink-0"
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              Transaction Report — {transactionSource}
            </DialogTitle>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </motion.div>

        {/* ===== BODY (Scrollable) ===== */}
        <motion.div
          variants={itemVariants}
          className="flex-1 overflow-y-auto px-6 pb-2 custom-scrollbar"
        >
          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-sm text-[#90A1B9]">
              Loading transactions…
            </div>
          ) : (
            <div className="flex flex-col gap-3">

              {/* Income Section */}
              <div className="flex flex-col gap-3 mt-[12px]">
                <p className="text-[14px] font-medium leading-[20px] text-[#1D293D]">
                  Income
                </p>
                <ReportTable
                  items={incomeItems}
                  totalAmount={incomeTotal}
                  totalBgClass="bg-[#DFFFF0]"
                />
              </div>

              {/* Expenses Section */}
              <div className="flex flex-col gap-3 mt-[12px]">
                <p className="text-[14px] font-medium leading-[20px] text-[#1D293D]">
                  Expenses
                </p>
                <ReportTable
                  items={expenseItems}
                  totalAmount={expenseTotal}
                  totalBgClass="bg-[#FFDEDE]"
                />
              </div>

              {/* Separator */}
              <div className="h-[1px] bg-[#E2E8F0] mt-[12px] mb-[12px]" />

              {/* Balance Row */}
              <div className="flex h-14 items-center justify-between rounded-[4px] border-b border-[#E2E8F0] bg-[#F1F5F9] px-4">
                <span className="text-base font-semibold leading-6 text-[#0F172B]">
                  Balance
                </span>
                <span className="text-base font-semibold leading-6 text-[#0F172B]">
                  {balance}
                </span>
              </div>

            </div>
          )}
        </motion.div>

        {/* ===== FOOTER ===== */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] shrink-0 mt-[12px]"
        >
          <Button
            type="button"
            onClick={handleExportCSV}
            className={cn(
              BUTTON_STYLES.primary.md,
              "w-auto px-6 text-sm font-semibold text-white"
            )}
          >
            Export CSV
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
