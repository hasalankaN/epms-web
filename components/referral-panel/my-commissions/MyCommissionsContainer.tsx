"use client";

import React from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import type { CommissionTabType } from "@/app/(main)/referral-panel/my-commissions/page.tsx";
import { BatchesTable } from "./views/BatchesTable";
import { CoursesTable } from "./views/CoursesTable";
import { ProductsTable } from "./views/ProductsTable";
import { MembersTable } from "./views/MembersTable";

interface MyCommissionsContainerProps {
  activeTab: CommissionTabType;
}

export function MyCommissionsContainer({ activeTab }: MyCommissionsContainerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full">
      {activeTab === "batches" && (
        <BatchesTable 
          currentPage={currentPage}
          totalResults={10}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "courses" && (
        <CoursesTable 
          currentPage={currentPage}
          totalResults={5}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "products" && (
        <ProductsTable 
          currentPage={currentPage}
          totalResults={8}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "members" && (
        <MembersTable 
          currentPage={currentPage}
          totalResults={12}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
