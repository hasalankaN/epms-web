"use client";

import React, { useCallback, useState, useMemo } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { subDays, format } from "date-fns";

import { ReportByCoursesTopBar } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesTopBar";
import { ReportByCoursesStatsRow } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesStatsRow";
import type { ReportByCoursesStatItem } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesStatsRow";
import { ReportByCoursesFilterRow } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesFilterRow";
import { ReportByCoursesChart } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesChart";
import { ReportByCoursesSearch } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesSearch";
import { ReportByCoursesTable } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesTable";
import type { ReportByCoursesDataType } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesTable";
import { TotalDiscountTable } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalDiscountTable";
import type { TotalDiscountDataType } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalDiscountTable";
import { TotalReferralCommissionTable } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalReferralCommissionTable";
import type { TotalReferralCommissionDataType } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalReferralCommissionTable";
import { TotalExpenseTable } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalExpenseTable";
import type { TotalExpenseDataType } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalExpenseTable";
import { NetProfitTable } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/NetProfitTable";
import type { NetProfitDataType } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/NetProfitTable";

import {
  useGetCourseWiseSummary,
  useGetCourseWisePayments,
  useGetCourseWiseDiscounts,
  useGetCourseWiseCommissions,
  useGetCourseWiseExpenses,
  useGetCourseWiseNetProfit,
  useGetCourseWiseChart,
} from "@/hooks/api/finances/useGetCourseWiseReport";
import type { CourseReportMetric } from "@/hooks/api/finances/useGetCourseWiseReport";
import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useGetCategories } from "@/hooks/api/course-categories/useGetCategories";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

const METRIC_MAP: Record<string, CourseReportMetric> = {
  payment: "PAYMENTS",
  discount: "DISCOUNTS",
  commission: "COMMISSIONS",
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

export default function ReportByCoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const activeTab = searchParams.get("tab") || "payment";

  const [search, setSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState(90);

  const dateFrom = format(subDays(new Date(), selectedDays), "yyyy-MM-dd");
  const dateTo = format(new Date(), "yyyy-MM-dd");

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleTabChange = useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tab);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleSelectDays = useCallback((days: number) => {
    setSelectedDays(days);
    handlePageChange(1);
  }, [handlePageChange]);

  // Courses and categories for TopBar dropdowns
  const { data: coursesData } = useGetCourses({ size: 100 });
  const courses = (coursesData?.results ?? []).map((c: any) => ({ id: c.id, name: c.name }));

  const { data: categoriesData } = useGetCategories({ size: 100 });
  const categories = (categoriesData?.results ?? []).map((c) => ({ id: c.id, name: c.name }));

  const metric = METRIC_MAP[activeTab] ?? "PAYMENTS";

  const commonParams = {
    course_id: selectedCourseId ?? undefined,
    category_id: selectedCategoryId ?? undefined,
    date_from: dateFrom,
    date_to: dateTo,
    search: search || undefined,
    page: currentPage,
    size: PAGE_SIZE,
  };

  const { data: summary } = useGetCourseWiseSummary({
    course_id: selectedCourseId ?? undefined,
    category_id: selectedCategoryId ?? undefined,
    date_from: dateFrom,
    date_to: dateTo,
  });

  const { data: chartData, isLoading: chartLoading } = useGetCourseWiseChart({
    metric,
    date_from: dateFrom,
    date_to: dateTo,
    course_id: selectedCourseId ?? undefined,
  });


  const { data: paymentsData, isLoading: paymentsLoading } = useGetCourseWisePayments(commonParams);
  const { data: discountsData, isLoading: discountsLoading } = useGetCourseWiseDiscounts(commonParams);
  const { data: commissionsData, isLoading: commissionsLoading } = useGetCourseWiseCommissions(commonParams);
  const { data: expensesData, isLoading: expensesLoading } = useGetCourseWiseExpenses(commonParams);
  const { data: profitData, isLoading: profitLoading } = useGetCourseWiseNetProfit(commonParams);


  const activeData = {
    payment: { data: paymentsData, loading: paymentsLoading },
    discount: { data: discountsData, loading: discountsLoading },
    commission: { data: commissionsData, loading: commissionsLoading },
    expense: { data: expensesData, loading: expensesLoading },
    profit: { data: profitData, loading: profitLoading },
  }[activeTab] ?? { data: undefined, loading: false };


  const tableLoading = activeData.loading;
  const rawData = (activeData.data as any)?.data ?? [];
  const pagination = (activeData.data as any)?.pagination;
  const totalResults = pagination?.total ?? 0;
  const totalPages = pagination?.total_pages ?? 1;

  const stats: ReportByCoursesStatItem[] = [
    { key: "payment", title: "Total Payment", value: fmtLkr(summary?.total_payments), isActive: activeTab === "payment" },
    { key: "discount", title: "Total Discount", value: fmtLkr(summary?.total_discounts), isActive: activeTab === "discount" },
    { key: "commission", title: "Total Referral Commision", value: fmtLkr(summary?.total_referral_commissions), isActive: activeTab === "commission" },
    { key: "expense", title: "Total Expense", value: fmtLkr(summary?.total_expenses), isActive: activeTab === "expense" },
    { key: "profit", title: "Net Profit", value: fmtLkr(summary?.net_profit), isActive: activeTab === "profit" },
  ];

  const paymentRows = useMemo(() => rawData.map((r: any) => ({
    id: r.course_id ?? r.course_name,
    courseName: r.course_name ?? "—",
    category: r.category ?? "—",
    totalAmountToCollect: parseFloat(r.total_amount_to_collect ?? "0"),
    totalPendingPayment: r.total_pending != null ? parseFloat(r.total_pending) : null,
    status: (r.status === "Completed" ? "Completed" : "Pending") as "Pending" | "Completed",
  } satisfies ReportByCoursesDataType)), [rawData]);

  const discountRows = useMemo(() => rawData.map((r: any, i: number) => ({
    id: r.course_id ?? String(i),
    courseName: r.course_name ?? "—",
    category: r.category ?? "—",
    studentName: r.student_name ?? "—",
    referralName: r.referral_name ?? "—",
    actualValue: parseFloat(String(r.actual_value ?? "0")),
    offerValue: parseFloat(String(r.offer_value ?? "0")),
    discountReceived: parseFloat(r.discount_percentage ?? "0"),
    offeredOn: fmtDate(r.offered_on),
  } satisfies TotalDiscountDataType)), [rawData]);

  const commissionRows = useMemo(() => rawData.map((r: any, i: number) => ({
    id: r.course_id ?? String(i),
    courseName: r.course_name ?? "—",
    category: r.category ?? "—",
    studentName: r.student_name ?? "—",
    paymentAmount: parseFloat(String(r.payment_amount ?? "0")),
    referralCom: parseFloat(String(r.referral_commission ?? "0")),
    referralPerson: r.referral_name ?? "—",
    date: fmtDate(r.date),
    offeredBy: r.offered_by ?? "—",
  } satisfies TotalReferralCommissionDataType)), [rawData]);

  const expenseRows = useMemo(() => rawData.map((r: any, i: number) => ({
    id: String(i),
    date: fmtDate(r.date),
    courseName: r.course_name ?? "—",
    category: r.category ?? "—",
    description: r.description ?? "—",
    transactionVia: r.transaction_via ?? "—",
    amount: parseFloat(String(r.amount ?? "0")),
  } satisfies TotalExpenseDataType)), [rawData]);

  const profitRows = useMemo(() => rawData.map((r: any, i: number) => ({
    id: r.course_id ?? String(i),
    courseName: r.course_name ?? "—",
    category: r.category ?? "—",
    totalIncome: parseFloat(r.total_income ?? "0"),
    totalExpense: parseFloat(r.total_expenses ?? "0"),
    profitOrLossValue: parseFloat(r.profit_loss_value ?? "0"),
    status: (r.profit_loss_status === "PROFIT" ? "Profit" : r.profit_loss_status === "LOSS" ? "Loss" : "Profit") as "Profit" | "Loss",
  } satisfies NetProfitDataType)), [rawData]);

  const handleExport = () => {
    const endpointMap: Record<string, string> = {
      payment: API_ENDPOINTS.finances.COURSE_WISE_PAYMENTS,
      discount: API_ENDPOINTS.finances.COURSE_WISE_DISCOUNTS,
      commission: API_ENDPOINTS.finances.COURSE_WISE_COMMISSIONS,
      expense: API_ENDPOINTS.finances.COURSE_WISE_EXPENSES,
      profit: API_ENDPOINTS.finances.COURSE_WISE_NET_PROFIT,
    };

    const params = new URLSearchParams({
      date_from: dateFrom,
      date_to: dateTo,
      size: "10000",
      ...(selectedCourseId ? { course_id: selectedCourseId } : {}),
    });

    window.open(`${endpointMap[activeTab] ?? endpointMap.payment}?${params.toString()}`, "_blank");
  };

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col pb-10">
        <ReportByCoursesTopBar
          courses={courses}
          categories={categories}
          selectedCourseId={selectedCourseId}
          selectedCategoryId={selectedCategoryId}
          onSelectCourse={setSelectedCourseId}
          onSelectCategory={setSelectedCategoryId}
          onExport={handleExport}
        />

        <div className="mt-4">
          <ReportByCoursesStatsRow stats={stats} onCardClick={handleTabChange} />
        </div>

        <ReportByCoursesFilterRow selectedDays={selectedDays} onSelectDays={handleSelectDays} />

        <ReportByCoursesChart graphData={chartData} isLoading={chartLoading} />

        <div className="mt-2 flex w-full flex-col space-y-4">
          <ReportByCoursesSearch search={search} onSearchChange={setSearch} />

          {activeTab === "payment" && (
            <ReportByCoursesTable
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
