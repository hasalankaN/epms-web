"use client";

import React, { useState, useCallback, useMemo } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { SalesByItemsPieChart } from "@/components/admin-panel/report-and-analytics/sales-by-items/SalesByItemsPieChart";
import { SalesByItemsToolbar } from "@/components/admin-panel/report-and-analytics/sales-by-items/SalesByItemsToolbar";
import { SalesByItemsTable } from "@/components/admin-panel/report-and-analytics/sales-by-items/SalesByItemsTable";
import type { SalesByItemsDataType } from "@/components/admin-panel/report-and-analytics/sales-by-items/SalesByItemsTable";

import {
  useGetSalesByItemsTop5,
  useGetSalesByItemsTable,
} from "@/hooks/api/analytics/useGetSalesByItems";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

const PAGE_SIZE = 10;


export default function SalesByItemsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [search, setSearch] = useState("");


  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    handlePageChange(1);
  }, [handlePageChange]);

  const { data: top5Data, isLoading: top5Loading } = useGetSalesByItemsTop5();

  const { data: tableData, isLoading: tableLoading } = useGetSalesByItemsTable({
    search: search || undefined,
    page: currentPage,
    size: PAGE_SIZE,
  });
  
  const tableRows = useMemo(() =>
    (tableData?.data ?? []).map((r, i) => ({
      id: `${r.item_name}-${i}`,
      itemName: r.item_name,
      noOfItemsSold: parseInt(r.quantity_sold ?? "0"),
      grossSale: parseFloat(r.gross_sale ?? "0"),
      totalDiscounts: parseFloat(r.total_discounts ?? "0"),
      totalRefCommissions: parseFloat(r.total_commissions ?? "0"),
      totalRefunds: parseFloat(r.total_refunds ?? "0"),
      netSales: parseFloat(r.net_sales ?? "0"),
    } satisfies SalesByItemsDataType)),
  [tableData]
  );

  const handleExport = () => {
    const params = new URLSearchParams();
    
    if (search) {
      params.set("search", search);
    }

    window.open(`${API_ENDPOINTS.finances.SALES_BY_ITEMS_EXPORT}?${params.toString()}`, "_blank");
  };

  const totalCount = parseInt(String(tableData?.pagination?.total ?? "0"));
  const totalPages = tableData?.pagination?.total_pages ?? 1;

  return (
    <div className="w-full space-y-6 p-4 pb-10 md:p-6">
      {/* Pie Chart */}
      <div className="rounded-[8px] bg-white p-6 border border-[#E2E8F0]">
        <SalesByItemsPieChart items={top5Data} isLoading={top5Loading} />
      </div>

      {/* Toolbar & Table */}
      <div className="space-y-4">
        <SalesByItemsToolbar
          onExportCsv={handleExport}
          onSearchChange={handleSearchChange}
        />
        <SalesByItemsTable
          data={tableRows}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={tableLoading}
          totalCount={totalCount}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
