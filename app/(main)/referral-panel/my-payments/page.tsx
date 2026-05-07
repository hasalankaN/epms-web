"use client";

import React, { useState, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { MyPaymentsTable } from "@/components/referral-panel/my-payments/MyPaymentsTable";
import type { PaymentDataType } from "@/types/payment";

// ===== MOCK DATA =====
const mockPayments: PaymentDataType[] = Array.from({ length: 15 }, (_, i) => ({
  id: `pay-${i + 1}`,
  requestedDate: "2026/01/21",
  requestedAmount: "#000001", 
  status: i === 0 ? "Active" : (["Active", "Pending", "Completed", "Rejected"] as const)[i % 4],
  paidDate: i === 0 ? "2026/01/25" : (i % 2 === 0 ? "2026/01/25" : ""),
  paidAmount: i === 0 ? "XXXX.00" : (i % 2 === 0 ? "XXXX.00" : ""),
  evidenceUrl: i % 3 === 0 ? "https://example.com/receipt.jpg" : null,
}));

export default function MyPaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [data] = useState<PaymentDataType[]>(mockPayments);

  // ===== HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Main Data Table */}
      <MyPaymentsTable
        data={data}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={data.length}
      />
    </div>
  );
}
