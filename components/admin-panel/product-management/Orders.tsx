"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import type { OrderDataType, OrderStatus as UIOrderStatus } from "@/types/product";

import { useGetOrders } from "@/hooks/api/orders/useGetOrders";
import type { OrderStatus as ApiOrderStatus, ProductType } from "@/hooks/api/orders/useGetOrders";

import { OrderStatsRow } from "./views/Orders/OrderStatsRow";
import { OrderToolbar } from "./views/Orders/OrderToolbar";
import { OrderTable } from "./views/Orders/OrderTable";

import { generateOrderCSV } from "@/utils/export/CSV/generate-order-csv";
import type { BulkOrderStatus } from "@/hooks/api/orders/useBulkUpdateOrderStatus";
import { useBulkUpdateOrderStatus } from "@/hooks/api/orders/useBulkUpdateOrderStatus";
import { useExportOrderAddresses } from "@/hooks/api/orders/useExportOrderAddresses";

export function Orders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";
  const date = searchParams.get("date") || "";
  const status = searchParams.get("status") as ApiOrderStatus | null;
  const type = searchParams.get("product_type") as ProductType | null;

  // ===== REPORT STATE =====
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // ===== BULK STATUS HOOK =====
  const { mutateAsync: bulkUpdateStatus } = useBulkUpdateOrderStatus();
  const { mutate: exportAddresses } = useExportOrderAddresses();

  // ===== API HOOK =====
  const { data: apiData, isLoading, isError } = useGetOrders({
    page: currentPage,
    size: 10,
    search: search || undefined,
    date: date || undefined,
    status: status || undefined,
    product_type: type || undefined,
  });

  const orders = useMemo(() => {
    if (!apiData?.data) return [];
    
    // Transform API data to match UI type OrderDataType
    return apiData.data.map((item) => {
      // Map API status to UI status if they differ, or just use as is if types overlap.
      // The API returns PENDING, PROCESSING, COMPLETED, DISPATCHED, REFUNDED, DOWNLOADED
      // The UI expects Processing, Pending, Downloaded, Refunded, Dispatched (capitalized).
      const formattedStatus = item.order_status.charAt(0) + item.order_status.slice(1).toLowerCase();

      return {
        id: item.order_id,
        orderId: item.order_number || item.order_id,
        date: new Date(item.order_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        productName: item.ordered_product,
        productType: item.product_type === "DIGITAL" ? "Digital" : "Delivery",
        quantity: item.ordered_quantity,
        amount: Number(item.order_amount) || 0,
        customerName: item.customer_name,
        paymentMethod: item.payment_method
          ? item.payment_method
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" ")
          : "-",
        commissions: Number(item.commissions) || 0,
        orderStatus: formattedStatus as unknown as UIOrderStatus,
      };
    }) as OrderDataType[];
  }, [apiData]);

  // ===== SHARED STATE =====
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // ===== HANDLERS =====
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search when URL search changes (e.g. back button)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch.trim() !== search.trim()) {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearch.trim()) {
          params.set("search", localSearch.trim());
        } else {
          params.delete("search");
        }

        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, search, searchParams, pathname, router]);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleFilterChange = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("status");
    params.delete("product_type");
    params.delete("date");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleGenerateReport = useCallback(async () => {
    try {
      setIsGeneratingReport(true);
      await generateOrderCSV({
        search: search || undefined,
        status: status || undefined,
        product_type: type || undefined,
        date: date || undefined,
      });
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  }, [search, status, type, date]);

  // ===== BULK ACTIONS =====
  const selectedCount = Object.keys(rowSelection).length;
  const totalCount = orders.length;

  const handleBulkMarkStatus = useCallback(async (targetStatus: BulkOrderStatus) => {
    const selectedIds = Object.keys(rowSelection);

    if (selectedIds.length === 0) return;

    try {
      await bulkUpdateStatus({
        ids: selectedIds,
        target_status: targetStatus,
      });
      setRowSelection({});
    } catch (error) {
      console.error("Error updating bulk status:", error);
    }
  }, [rowSelection, bulkUpdateStatus]);

  const bulkActions = useMemo(() => ({
    onSelectAll: () => {
      const selection: { [key: string]: boolean } = {};

      orders.forEach((o) => (selection[o.id] = true));
      setRowSelection(selection);
    },
    onClear: () => setRowSelection({}),
    onPrintAddress: () => {
      const selectedIds = Object.keys(rowSelection);

      if (selectedIds.length > 0) {
        exportAddresses({ order_ids: selectedIds });
      }
    },
    onPrintInvoices: () => console.log("Printing Invoices"),
    onPrintWaybill: () => console.log("Printing Waybills"),
    onMarkProcessing: () => handleBulkMarkStatus("PROCESSING"),
    onMarkDispatched: () => handleBulkMarkStatus("DISPATCHED"),
    onMarkCompleted: () => handleBulkMarkStatus("COMPLETED"),
    onMarkRefunded: () => handleBulkMarkStatus("REFUNDED"),
  }), [orders, rowSelection, exportAddresses, handleBulkMarkStatus]);

  return (
    <div className="flex flex-col">
      {/* Stats Row */}
      <OrderStatsRow />

      {/* Table Toolbar */}
      <div className="mt-4">
        <OrderToolbar
          bulkActions={bulkActions}
          selectedCount={selectedCount}
          totalCount={totalCount}
          search={localSearch}
          onSearchChange={setLocalSearch}
          statusFilter={status}
          typeFilter={type}
          dateFilter={date}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onGenerateReport={handleGenerateReport}
          isGeneratingReport={isGeneratingReport}
        />
      </div>

      {/* Order Table */}
      <div className="mt-4">
        <OrderTable
          data={orders}
          isLoading={isLoading}
          isError={isError}
          totalResults={apiData?.meta.total || 0}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
    </div>
  );
}
