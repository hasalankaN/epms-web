"use client";

import React, { useState, useCallback } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { format } from "date-fns";
import { toast } from "sonner";

import { IncomeStatsRow } from "./IncomeStatsRow";
import { IncomeFromStudentToolbar } from "./IncomeFromStudentToolbar";
import { IncomeFromStudentTable } from "./IncomeFromStudentTable";
import type { IncomeFromStudentData } from "./IncomeFromStudentTable";
import { useGetIncomeLedger } from "@/hooks/api/finances/useGetIncomeLedger";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import api from "@/lib/axios";

const PAGE_SIZE = 10;

function mapPaymentMethod(m: string) {
  if (m === "GATEWAY") return "Gateway";
  if (m === "BANK_TRANSFER") return "Bank Slip";
  
return m;
}

function mapPaymentVia(v: string | null) {
  if (!v) return "—";

  const map: Record<string, string> = {
    BOC: "BOC", PEOPLES_BANK: "Peoples", COMMERCIAL_BANK: "Commercial",
    HNB: "HNB", ONLINE: "Online", CASH: "Cash",
  };

  
return map[v] ?? v;
}

function mapStatus(s: string): "Pending" | "Completed" {
  return s === "COMPLETED" ? "Completed" : "Pending";
}

export function IncomeFromStudentTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page") || "1");

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({});

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const { data, isLoading } = useGetIncomeLedger({
    page: currentPage,
    size: PAGE_SIZE,
    date_from: activeFilters.dateFrom ?? undefined,
    date_to: activeFilters.dateTo ?? undefined,
    source: activeFilters.source as any ?? undefined,
    payment_method: activeFilters.paymentMethod as any ?? undefined,
    payment_type: activeFilters.paymentType ?? undefined,
    payment_via: activeFilters.paymentVia ?? undefined,
    status: activeFilters.status as any ?? undefined,
  });

  const mapped: IncomeFromStudentData[] = (data?.data ?? []).map((item) => ({
    id: item.id,
    date: format(new Date(item.transaction_date), "yyyy/MM/dd"),
    description: item.source_name,
    source: item.source_type.charAt(0) + item.source_type.slice(1).toLowerCase(),
    paymentMethod: mapPaymentMethod(item.payment_method),
    paymentType: item.payment_type_label ?? item.payment_type.replace(/_/g, " "),
    paymentVia: mapPaymentVia(item.payment_via),
    amount: `LKR ${Number(item.amount).toFixed(2)}`,
    studentName: item.student_name ?? item.student_email ?? "—",
    status: mapStatus(item.ledger_status),
  }));

  const handleExportCsv = async () => {
    try {
      const params: Record<string, string> = {};

      if (activeFilters.dateFrom) params.date_from = activeFilters.dateFrom;
      if (activeFilters.dateTo) params.date_to = activeFilters.dateTo;
      if (activeFilters.source) params.source = activeFilters.source;
      if (activeFilters.status) params.status = activeFilters.status;
      const res = await api.get(API_ENDPOINTS.finances.INCOME_EXPORT, { params, responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");

 a.href = url; a.download = "income-report.csv"; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("Failed to export CSV."); }
  };

  return (
    <div className="space-y-4">
      <IncomeStatsRow />
      <div className="flex flex-col gap-4">
        <IncomeFromStudentToolbar
          onApplyFilters={(f) => { setActiveFilters((p) => ({ ...p, ...f })); handlePageChange(1); }}
          onClearFilters={() => { setActiveFilters({}); handlePageChange(1); }}
          activeUrlFilters={activeFilters}
          onExportCsv={handleExportCsv}
        />
        <IncomeFromStudentTable
          data={mapped}
          isLoading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalResults={data?.meta?.total ?? 0}
        />
      </div>
    </div>
  );
}
