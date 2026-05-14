"use client";

import React, { useCallback, useState, useMemo } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { subDays, format } from "date-fns";

import { ReportByBatchesTopBar } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesTopBar";
import { ReportByBatchesStatsRow } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesStatsRow";
import type { ReportByBatchesStatItem } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesStatsRow";
import { ReportByBatchesFilterRow } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesFilterRow";
import { ReportByBatchesChart } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesChart";
import { ReportByBatchesSearch } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesSearch";
import { ReportByBatchesTable } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesTable";
import type { ReportByBatchesDataType } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesTable";
import { TotalDiscountTable } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalDiscountTable";
import type { TotalDiscountDataType } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalDiscountTable";
import { TotalReferralCommissionTable } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalReferralCommissionTable";
import type { TotalReferralCommissionDataType } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalReferralCommissionTable";
import { TotalExpenseTable } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalExpenseTable";
import type { TotalExpenseDataType } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalExpenseTable";
import { NetProfitTable } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/NetProfitTable";
import type { NetProfitDataType } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/NetProfitTable";

import {
  useGetBatchWiseSummary,
  useGetBatchWiseTable,
  useGetBatchWiseGraph,
} from "@/hooks/api/finances/useGetBatchWiseReport";
import type {
  BatchPaymentRow,
  BatchDiscountRow,
  BatchCommissionRow,
  BatchExpenseRow,
  BatchNetProfitRow,
  BatchReportMetric,
} from "@/hooks/api/finances/useGetBatchWiseReport";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

const METRIC_MAP: Record<string, BatchReportMetric> = {
  payment: "PAYMENTS",
  discount: "DISCOUNTS",
  commission: "REFERRAL_COMMISSIONS",
  expense: "EXPENSES",
  profit: "NET_PROFIT",
};

const PAGE_SIZE = 10;

function fmtLkr(val: string | null | undefined) {
  const n = parseFloat(val ?? "0");

  return `LKR ${n.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(val: string | Date | null) {
  if (!val) {
    return "—";
  }

  try {
    return format(new Date(val as string), "yyyy/MM/dd");
  } catch {
    return String(val);
  }
}

export default function ReportByBatchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const activeTab = searchParams.get("tab") || "payment";

  const [search, setSearch] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState(90);

  const dateFrom = format(subDays(new Date(), selectedDays), "yyyy-MM-dd");
  const dateTo = format(new Date(), "yyyy-MM-dd");

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("tab", tab);
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const handleSelectDays = useCallback(
    (days: number) => {
      setSelectedDays(days);
      handlePageChange(1);
    },
    [handlePageChange],
  );

  // Batch list for TopBar dropdown

  const { data: batchesData } = useGetBatches({ size: 100 });

  const batches = (batchesData?.results ?? []).map((b) => ({
    id: b.id,
    name: b.name,
  }));

  const metric = METRIC_MAP[activeTab] ?? "PAYMENTS";

  const commonParams = {
    batch_id: selectedBatchId ?? undefined,
    date_from: dateFrom,
    date_to: dateTo,
  };

  // Summary cards
  const { data: summary } = useGetBatchWiseSummary(commonParams);

  // Graph
  const { data: graphData, isLoading: graphLoading } = useGetBatchWiseGraph({
    metric,
    time_grouping: selectedDays <= 30 ? "DAYS" : "MONTHS",
    ...commonParams,
  });

  // Table
  const { data: tableData, isLoading: tableLoading } = useGetBatchWiseTable({
    metric,
    ...commonParams,
    search: search || undefined,
    page: currentPage,
    size: PAGE_SIZE,
  });

  const stats: ReportByBatchesStatItem[] = [
    {
      key: "payment",
      title: "Total Payment",
      value: fmtLkr(summary?.total_payments),
      isActive: activeTab === "payment",
    },
    {
      key: "discount",
      title: "Total Discount",
      value: fmtLkr(summary?.total_discounts),
      isActive: activeTab === "discount",
    },
    {
      key: "commission",
      title: "Total Referral Commision",
      value: fmtLkr(summary?.total_referral_commissions),
      isActive: activeTab === "commission",
    },
    {
      key: "expense",
      title: "Total Expense",
      value: fmtLkr(summary?.total_expenses),
      isActive: activeTab === "expense",
    },
    {
      key: "profit",
      title: "Net Profit",
      value: fmtLkr(summary?.net_profit),
      isActive: activeTab === "profit",
    },
  ];

  const memoRows = useMemo(() => tableData?.results ?? [], [tableData]);
  const totalResults = tableData?.totalResults ?? 0;
  const totalPages = tableData?.totalPages ?? 1;

  // Map API rows to table data types
  const paymentRows = useMemo(
    () =>
      (memoRows as BatchPaymentRow[]).map(
        (r) =>
          ({
            id: r.batch_id,
            batchName: r.batch_name ?? "—",
            branch: r.branch ?? "—",
            totalAmountToCollect: parseFloat(r.total_amount_to_collect ?? "0"),
            totalPendingPayment: parseFloat(r.total_pending_payment ?? "0"),
            status: (r.payment_status === "Completed"
              ? "Completed"
              : "Pending") as "Pending" | "Completed",
          }) satisfies ReportByBatchesDataType,
      ),
    [memoRows],
  );

  const discountRows = useMemo(
    () =>
      (memoRows as BatchDiscountRow[]).map(
        (r, i) =>
          ({
            id: r.batch_id ?? String(i),
            batchName: r.batch_name ?? "—",
            branch: "—",
            studentName: r.student_name ?? "—",
            referralName: r.referral_name ?? "—",
            actualValue: parseFloat(String(r.actual_value ?? "0")),
            offerValue: parseFloat(String(r.offer_value ?? "0")),
            discountReceived: parseFloat(r.discount_percentage ?? "0"),
            offeredOn: fmtDate(r.offered_on),
          }) satisfies TotalDiscountDataType,
      ),
    [memoRows],
  );

  const commissionRows = useMemo(
    () =>
      (memoRows as BatchCommissionRow[]).map(
        (r, i) =>
          ({
            id: r.batch_id ?? String(i),
            batchName: r.batch_name ?? "—",
            studentName: r.student_name ?? "—",
            paymentAmount: parseFloat(String(r.payment_amount ?? "0")),
            referralCom: parseFloat(String(r.referral_commission ?? "0")),
            referralPerson: r.referral_name ?? "—",
            date: fmtDate(r.date),
            offeredBy: r.offered_by ?? "—",
          }) satisfies TotalReferralCommissionDataType,
      ),
    [memoRows],
  );

  const expenseRows = useMemo(
    () =>
      (memoRows as BatchExpenseRow[]).map(
        (r, i) =>
          ({
            id: String(i),
            date: fmtDate(r.date),
            batchName: r.batch_name ?? "—",
            branch: r.branch ?? "—",
            description: r.expense_description ?? "—",
            transactionVia: r.transaction_via ?? "—",
            amount: parseFloat(String(r.amount ?? "0")),
          }) satisfies TotalExpenseDataType,
      ),
    [memoRows],
  );

  const profitRows = useMemo(
    () =>
      (memoRows as BatchNetProfitRow[]).map(
        (r) =>
          ({
            id: r.batch_id,
            batchName: r.batch_name ?? "—",
            branch: r.branch ?? "—",
            totalIncome: parseFloat(r.total_income ?? "0"),
            totalExpense: parseFloat(r.total_expenses ?? "0"),
            profitOrLossValue: parseFloat(r.profit_loss_value ?? "0"),
            status: (r.profit_loss_status === "PROFIT"
              ? "Profit"
              : r.profit_loss_status === "LOSS"
                ? "Loss"
                : "Profit") as "Profit" | "Loss",
          }) satisfies NetProfitDataType,
      ),
    [memoRows],
  );

  const handleExport = () => {
    const params = new URLSearchParams({
      metric,
      date_from: dateFrom,
      date_to: dateTo,
      ...(selectedBatchId ? { batch_id: selectedBatchId } : {}),
    });

    window.open(
      `${API_ENDPOINTS.finances.BATCH_WISE_TABLE}?${params.toString()}`,
      "_blank",
    );
  };

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col pb-10">
        <ReportByBatchesTopBar
          batches={batches}
          selectedBatchId={selectedBatchId}
          onSelectBatch={setSelectedBatchId}
          onExport={handleExport}
        />

        <div className="mt-4">
          <ReportByBatchesStatsRow
            stats={stats}
            onCardClick={handleTabChange}
          />
        </div>

        <ReportByBatchesFilterRow
          selectedDays={selectedDays}
          onSelectDays={handleSelectDays}
        />

        <ReportByBatchesChart graphData={graphData} isLoading={graphLoading} />

        <div className="mt-2 flex w-full flex-col space-y-4">
          <ReportByBatchesSearch search={search} onSearchChange={setSearch} />

          {activeTab === "payment" && (
            <ReportByBatchesTable
              data={paymentRows}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              serverTotalCount={totalResults}
              serverTotalPages={totalPages}
              isLoading={tableLoading}
            />
          )}
          {activeTab === "discount" && (
            <TotalDiscountTable
              data={discountRows}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              serverTotalCount={totalResults}
              serverTotalPages={totalPages}
              isLoading={tableLoading}
            />
          )}
          {activeTab === "commission" && (
            <TotalReferralCommissionTable
              data={commissionRows}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              serverTotalCount={totalResults}
              serverTotalPages={totalPages}
              isLoading={tableLoading}
            />
          )}
          {activeTab === "expense" && (
            <TotalExpenseTable
              data={expenseRows}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              serverTotalCount={totalResults}
              serverTotalPages={totalPages}
              isLoading={tableLoading}
            />
          )}
          {activeTab === "profit" && (
            <NetProfitTable
              data={profitRows}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              serverTotalCount={totalResults}
              serverTotalPages={totalPages}
              isLoading={tableLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
