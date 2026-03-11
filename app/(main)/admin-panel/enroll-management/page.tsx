"use client";

import React, { useState } from "react";

import { EnrollStatsRow } from "@/components/admin-panel/enroll-management/EnrollStatsRow";
import { EnrollTableToolbar } from "@/components/admin-panel/enroll-management/EnrollTableToolbar";
import { EnrollTable } from "@/components/admin-panel/enroll-management/EnrollTable";
import { DUMMY_ENROLL_DATA } from "@/types/enroll";

export default function EnrollManagementPage() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Top Stats Row */}
      <EnrollStatsRow />

      {/* Toolbar (Search & Filters) */}
      <div className="mt-6">
        <EnrollTableToolbar />
      </div>

      {/* Main Data Table */}
      <div className="mt-4">
        <EnrollTable
          data={DUMMY_ENROLL_DATA}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
