"use client";

import React, { useState, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import type { OrderDataType } from "@/types/product";
import { DUMMY_ORDER_DATA } from "@/types/product";

import { OrderStatsRow } from "./views/Orders/OrderStatsRow";
import { OrderToolbar } from "./views/Orders/OrderToolbar";
import { OrderTable } from "./views/Orders/OrderTable";

export function Orders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [data] = useState<OrderDataType[]>(DUMMY_ORDER_DATA);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // ===== HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Row */}
      <OrderStatsRow />

      {/* Separator Line */}
      <div className="mt-4 h-[1px] w-full bg-[#E2E8F0]" />

      {/* Table Toolbar */}
      <div className="mt-4">
        <OrderToolbar />
      </div>

      {/* Order Table */}
      <div className="mt-4">
        <OrderTable
          data={data}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
    </div>
  );
}
