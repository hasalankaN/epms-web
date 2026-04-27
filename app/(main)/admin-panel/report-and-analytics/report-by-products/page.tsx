"use client";

import React, { useCallback, useState, useMemo } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { subDays, format } from "date-fns";

import { ReportByProductsTopBar } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsTopBar";
import { ReportByProductsFilterRow } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsFilterRow";
import { ReportByProductsStatsRow } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsStatsRow";
import { ReportByProductsChart } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsChart";
import { ReportByProductsSearch } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsSearch";
import { ReportByProductsTable } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsTable";
import type { ReportByProductsDataType } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsTable";

import {
  useGetProductWiseSummary,
  useGetProductWiseTable,
  useGetProductWiseChart,
} from "@/hooks/api/finances/useGetProductWiseReport";
import { useGetProducts } from "@/hooks/api/products/useGetProducts";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

const PAGE_SIZE = 10;

function fmtLkr(val: string | null | undefined) {
  const n = parseFloat(val ?? "0");
  
  return `LKR ${n.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(val: string | null) {
  if (!val) {
    return "—";
  }

  try {
    return format(new Date(val), "yyyy/MM/dd");
  } catch {
    return val;
  }
}

export default function ReportByProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState(90);

  const dateFrom = format(subDays(new Date(), selectedDays), "yyyy-MM-dd");
  const dateTo = format(new Date(), "yyyy-MM-dd");

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleSelectDays = useCallback((days: number) => {
    setSelectedDays(days);
    handlePageChange(1);
  }, [handlePageChange]);

  const { data: productsData } = useGetProducts({ size: 100 });
  const products = (productsData?.results ?? []).map((p) => ({ id: p.id, name: p.name }));

  const commonParams = {
    product_id: selectedProductId ?? undefined,
    date_from: dateFrom,
    date_to: dateTo,
  };

  const { data: summary } = useGetProductWiseSummary(commonParams);

  const { data: chartData, isLoading: chartLoading } = useGetProductWiseChart({
    ...commonParams,
    metric: "PAYMENTS",
    time_grouping: selectedDays <= 30 ? "DAYS" : "MONTHS",
  });

  const { data: tableData, isLoading: tableLoading } = useGetProductWiseTable({
    ...commonParams,
    search: search || undefined,
    page: currentPage,
    size: PAGE_SIZE,
  });

  const tableRows = useMemo(() =>
    (tableData?.data ?? []).map((r, i) => ({
      id: `${r.date}-${i}`,
      date: fmtDate(r.date),
      totalPayment: parseFloat(r.total_payments ?? "0"),
      totalDiscounts: parseFloat(r.total_discounts ?? "0"),
      totalReferralCommision: parseFloat(r.total_commissions ?? "0"),
      totalRefunds: parseFloat(r.total_expenses ?? "0"),
      netSales: parseFloat(r.net_income ?? "0"),
    } satisfies ReportByProductsDataType)),
    [tableData]
  );

  const stats = [
    { key: "payment", title: "Total Payment", value: fmtLkr(summary?.total_payments) },
    { key: "discount", title: "Total Discounts", value: fmtLkr(summary?.total_discounts) },
    { key: "commission", title: "Total Referral Commision", value: fmtLkr(summary?.total_referral_commissions) },
    { key: "refunds", title: "Total Refunds", value: fmtLkr(summary?.total_expenses) },
    { key: "net-sales", title: "Net Sales", value: fmtLkr(summary?.net_profit) },
  ];

  const handleExport = () => {
    const params = new URLSearchParams({
      date_from: dateFrom,
      date_to: dateTo,
      ...(selectedProductId ? { product_id: selectedProductId } : {}),
      ...(search ? { search } : {}),
    });

    window.open(`${API_ENDPOINTS.finances.PRODUCT_WISE_EXPORT}?${params.toString()}`, "_blank");
  };

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col pb-10">

        <ReportByProductsTopBar
          products={products}
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
          onExport={handleExport}
        />

        <div className="mt-4">
          <ReportByProductsStatsRow stats={stats} />
        </div>

        <ReportByProductsFilterRow selectedDays={selectedDays} onSelectDays={handleSelectDays} />

        <ReportByProductsChart graphData={chartData} isLoading={chartLoading} />

        <div className="mt-2 flex w-full flex-col space-y-4">
          <ReportByProductsSearch search={search} onSearchChange={setSearch} />

          <ReportByProductsTable
            data={tableRows}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            serverTotalCount={tableData?.pagination.total ?? 0}
            serverTotalPages={tableData?.pagination.total_pages ?? 1}
            isLoading={tableLoading}
          />
        </div>

      </div>
    </div>
  );
}
