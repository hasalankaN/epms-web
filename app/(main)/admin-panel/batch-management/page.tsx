"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { BatchStatsRow } from "@/components/admin-panel/batch-management/BatchStatsRow";
import { BatchTableToolbar } from "@/components/admin-panel/batch-management/BatchTableToolbar";
import { BatchTable } from "@/components/admin-panel/batch-management/BatchTable";
import type { BatchDataType } from "@/types/batch";

// ===== DUMMY DATA =====
const DUMMY_BATCH_DATA: BatchDataType[] = [
  {
    id: "1",
    batchName: "Web Development 2024 - A",
    batchId: "WD-24-A",
    type: "Diploma",
    level: "Beginner",
    status: "Active",
    category: "Online",
    payment: "Paid",
    branch: "Main",
    lecturer: "Mr. Ruwan",
    studentsCount: 45,
    startDate: "2024-01-15",
    endDate: "2024-06-15",
  },
  {
    id: "2",
    batchName: "Graphic Design 2024 - B",
    batchId: "GD-24-B",
    type: "HND",
    level: "Advanced",
    status: "Ongoing",
    category: "On-Site",
    payment: "Paid",
    branch: "Negombo",
    lecturer: "Miss. Akarshani",
    studentsCount: 28,
    startDate: "2024-02-01",
    endDate: "2024-08-01",
  },
  {
    id: "3",
    batchName: "Digital Marketing 2024",
    batchId: "DM-24-01",
    type: "Certificate",
    level: "Beginner",
    status: "Upcoming",
    category: "Hybrid",
    payment: "Paid",
    branch: "Galle",
    lecturer: "Mrs. Theja",
    studentsCount: 0,
    startDate: "2024-04-10",
    endDate: "2024-07-10",
  },
  {
    id: "4",
    batchName: "Software Engineering 2023",
    batchId: "SE-23-C",
    type: "Degree",
    level: "Advanced",
    status: "Completed",
    category: "On-Site",
    payment: "Paid",
    branch: "Main",
    lecturer: "Mr. Saadh",
    studentsCount: 120,
    startDate: "2023-01-10",
    endDate: "2024-01-10",
  },
  {
    id: "5",
    batchName: "Free Workshop on UI/UX",
    batchId: "WS-UIUX-01",
    type: "Workshop",
    level: "Beginner",
    status: "Inactive",
    category: "Online",
    payment: "Free",
    branch: "Main",
    lecturer: "Mr. Ruwan",
    studentsCount: 250,
    startDate: "2023-12-05",
    endDate: "2023-12-05",
  },
];

export default function BatchManagementPage() {
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCount, setSelectedCount] = useState(0);

  // Update selected count when rowSelection changes
  useEffect(() => {
    setSelectedCount(Object.keys(rowSelection).length);
  }, [rowSelection]);


  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-end gap-4">
        <Link
          href="/admin-panel/batch-management/add-new-batch"
          className={cn(
            BUTTON_STYLES.primary.md,
            "text-sm font-semibold text-white px-3 md:px-4"
          )}
        >
          <Plus className="h-5 w-5 md:hidden" />
          <span className="hidden md:inline">Add New Batch</span>
        </Link>
      </div>

      {/* Content Wrapper (Matches AllInquiries structure) */}
      <div className="flex flex-col gap-4">
        {/* Stats Row */}
        <BatchStatsRow />

        {/* Separator Line (24px below) */}
        <div className="mt-4 h-[1px] w-full bg-[#E2E8F0]" />

        {/* Table Toolbar (24px below separator) */}
        <div className="mt-4">
          <BatchTableToolbar
            selectedCount={selectedCount}
            totalCount={DUMMY_BATCH_DATA.length}
          />
        </div>

        {/* Batch Table (16px below toolbar) */}
        <div className="mt-4">
          <BatchTable
              data={DUMMY_BATCH_DATA}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
