"use client";

import React, { useState, useMemo } from "react";

import { OtherIncomeToolbar } from "./OtherIncomeToolbar";
import { OtherIncomeTable } from "./OtherIncomeTable";

import { mockOtherIncomeData } from "../mockData";

export function OtherIncomeTab() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [transactionVia, setTransactionVia] = useState("all");

  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const filteredData = useMemo(() => {
    return mockOtherIncomeData.filter((item) => {
      // Transaction Via filter
      if (transactionVia !== "all" && item.transactionVia.toLowerCase() !== transactionVia) return false;

      // Date filter
      if (dateRange.start || dateRange.end) {
        const itemDate = new Date(item.date);

        if (dateRange.start && itemDate < dateRange.start) return false;

        if (dateRange.end && itemDate > dateRange.end) return false;
      }

      return true;
    });
  }, [transactionVia, dateRange]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, filteredData]);

  return (
    <div className="space-y-4 pt-2">
      <OtherIncomeToolbar 
        transactionVia={transactionVia}
        setTransactionVia={setTransactionVia}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <OtherIncomeTable
        data={paginatedData}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalResults={filteredData.length}
      />
    </div>
  );
}
