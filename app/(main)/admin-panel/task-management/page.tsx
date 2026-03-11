"use client";

import React, { useState } from "react";

import { TaskTableToolbar } from "@/components/admin-panel/task-management/TaskTableToolbar";
import { TaskTable } from "@/components/admin-panel/task-management/TaskTable";
import { mockTasksData } from "@/components/admin-panel/task-management/mockData";

export default function TaskManagementPage() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Toolbar */}
      <TaskTableToolbar
        selectedCount={selectedCount}
        totalCount={mockTasksData.length}
        bulkActions={{
          onSelectAll: () => {
            const newSelection: Record<string, boolean> = {};

            mockTasksData.forEach((item) => {
              newSelection[item.id] = true;
            });
            setRowSelection(newSelection);
          },
          onClear: () => setRowSelection({}),
          onDelete: () => {
            console.log("Delete Selected Tasks");
            setRowSelection({});
          },
        }}
      />

      {/* Main Data Table */}
      <TaskTable
        data={mockTasksData}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
