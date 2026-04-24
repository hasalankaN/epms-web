"use client";

import React from "react";

import { X } from "lucide-react";
import { format } from "date-fns";

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
import { StatusPopover } from "@/components/common/StatusPopover";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { useGetPnlDetail } from "@/hooks/api/finances/useGetPnlData";
import type { PnlSource } from "@/hooks/api/finances/useGetPnlData";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

interface RowData {
  id: string;
  date: string;
  description: string;
  transactionVia: string;
  amount: string;
}

function ReportTable({
  items,
  totalAmount,
  totalBgClass,
  isLoading,
}: {
  items: RowData[];
  totalAmount: string;
  totalBgClass: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border border-[#E2E8F0]">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-16 items-center justify-center rounded-lg border border-[#E2E8F0] text-sm text-[#64748B]">
        No records
      </div>
    );
  }

  return (
    <>
      <div className="hidden sm:block overflow-hidden rounded-[8px] border border-[#E2E8F0]">
        <Table className="min-w-full">
          <TableHeader className="bg-pink-50">
            <TableRow className="border-none hover:bg-pink-50">
              <TableHead className="py-3 pl-4 pr-2 text-[13px] font-semibold text-[#1D293D] w-[100px]">
                Date
              </TableHead>
              <TableHead className="py-3 px-2 text-[13px] font-semibold text-[#1D293D] w-[140px]">
                Description
              </TableHead>
              <TableHead className="py-3 px-2 text-[13px] font-semibold text-[#1D293D]">
                Transaction Via
              </TableHead>
              <TableHead className="py-3 pl-2 pr-4 text-[13px] font-semibold text-[#1D293D] text-right w-[110px]">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-[#F1F5F9] last:border-none hover:bg-transparent"
              >
                <TableCell className="py-3 pl-4 pr-2 text-[12px] font-medium text-[#45556C] whitespace-nowrap">
                  {item.date}
                </TableCell>
                <TableCell className="py-3 px-2 text-[12px] font-medium text-[#45556C]">
                  {item.description}
                </TableCell>
                <TableCell className="py-3 px-2 text-[12px] font-medium text-[#45556C]">
                  {item.transactionVia || "—"}
                </TableCell>
                <TableCell className="py-3 pl-2 pr-4 text-[12px] font-medium text-[#45556C] text-right whitespace-nowrap">
                  LKR{" "}
                  {Number(item.amount).toLocaleString("en-LK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className={totalBgClass}>
            <TableRow className="border-t border-[#E2E8F0] hover:bg-transparent h-14">
              <TableCell
                colSpan={3}
                className="py-3 px-4 text-base font-semibold leading-6 text-[#45556C]"
              >
                Total
              </TableCell>
              <TableCell className="py-3 pl-2 pr-4 text-base font-semibold leading-6 text-[#45556C] text-right whitespace-nowrap">
                {totalAmount}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="flex flex-col gap-2 sm:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-[#64748B]">
                {item.date}
              </span>
              <span className="text-[12px] font-semibold text-[#1D293D]">
                LKR{" "}
                {Number(item.amount).toLocaleString("en-LK", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-medium text-[#45556C] line-clamp-2">
                {item.description}
              </span>
              <span className="text-[10px] font-medium text-[#94A3B8]">
                {item.transactionVia || "—"}
              </span>
            </div>
          </div>
        ))}
        <div
          className={cn(
            "flex items-center justify-between rounded-lg border border-[#E2E8F0] p-4 shadow-sm",
            totalBgClass,
          )}
        >
          <span className="text-base font-semibold text-[#45556C]">Total</span>
          <span className="text-base font-semibold text-[#45556C]">
            {totalAmount}
          </span>
        </div>
      </div>
    </>
  );
}

interface IncomeExpenseReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceType: PnlSource;
  sourceId: string;
  sourceName: string;
}

function fmtDate(val: string | Date | null) {
  if (!val) {
    return "—";
  }

  try {
    return format(new Date(val), "yyyy/MM/dd");
  } catch {
    return String(val);
  }
}

function fmtLkr(val: string | null | undefined) {
  if (!val) {
    return "LKR 0.00";
  }

  return `LKR ${Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function IncomeExpenseReportModal({
  isOpen,
  onClose,
  sourceType,
  sourceId,
  sourceName,
}: IncomeExpenseReportModalProps) {
  const { data, isLoading } = useGetPnlDetail(
    sourceType,
    sourceId,
    isOpen && !!sourceId,
  );

  const incomeRows: RowData[] = (data?.income.rows ?? []).map((r, i) => ({
    id: `inc-${i}`,
    date: fmtDate(r.date),
    description: r.description ?? "—",
    transactionVia: r.payment_via ?? "",
    amount: r.amount ?? "0",
  }));

  const expenseRows: RowData[] = (data?.expenses.rows ?? []).map((r, i) => ({
    id: `exp-${i}`,
    date: fmtDate(r.date),
    description: r.description ?? "—",
    transactionVia: r.transaction_via ?? "",
    amount: r.amount ?? "0",
  }));

  const isProfited = data?.status === "PROFIT";

  const netAbs = data
    ? Math.abs(Number(data.profit_loss)).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
      })
    : "0.00";

  const balanceDisplay = `${isProfited ? "+" : "-"}LKR ${netAbs}`;

  const statusLabel = isProfited ? "Profited" : "Loss";

  const handleExport = () => {
    const url = `${API_ENDPOINTS.finances.PNL_DETAIL(sourceType, sourceId)}/export`;

    window.open(url, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        animateChildren={true}
        className="flex max-h-[90vh] w-[95%] max-w-[704px] flex-col gap-0 overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 px-6 py-5 shrink-0"
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              {sourceName}
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

        <motion.div
          variants={itemVariants}
          className="flex-1 overflow-y-auto px-6 pb-2 custom-scrollbar"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <p className="text-[14px] font-medium leading-[20px] text-[#1D293D]">
                Income
              </p>
              <ReportTable
                items={incomeRows}
                totalAmount={fmtLkr(data?.income.total)}
                totalBgClass="bg-[#DFFFF0]"
                isLoading={isLoading}
              />
            </div>

            <div className="flex flex-col gap-3 mt-[12px]">
              <p className="text-[14px] font-medium leading-[20px] text-[#1D293D]">
                Expenses
              </p>
              <ReportTable
                items={expenseRows}
                totalAmount={fmtLkr(data?.expenses.total)}
                totalBgClass="bg-[#FFDEDE]"
                isLoading={isLoading}
              />
            </div>

            <div className="h-[1px] bg-[#E2E8F0] mt-[12px] mb-[12px]" />

            <div className="flex flex-col sm:flex-row sm:h-14 items-center justify-between rounded-[4px] border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-4 sm:py-0">
              <span className="hidden sm:block" />
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                  <span className="text-sm font-normal text-[#45556C]">
                    Status
                  </span>
                  <StatusPopover
                    value={isLoading ? "Profited" : statusLabel}
                    options={[
                      { value: "Profited", bg: "#DFFFF0", text: "#16A34A" },
                      { value: "Loss", bg: "#FFDEDE", text: "#FB2C36" },
                    ]}
                    readOnly
                  />
                </div>
                <div className="flex justify-end w-full sm:w-auto">
                  {isLoading ? (
                    <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
                  ) : (
                    <span
                      className={cn(
                        "text-[20px] font-semibold leading-[32px]",
                        isProfited ? "text-[#16A34A]" : "text-[#FB2C36]",
                      )}
                    >
                      {balanceDisplay}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] shrink-0 mt-[12px]"
        >
          <Button
            type="button"
            onClick={handleExport}
            className={cn(
              BUTTON_STYLES.primary.md,
              "w-auto px-6 text-sm font-semibold text-white",
            )}
          >
            Export CSV
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
