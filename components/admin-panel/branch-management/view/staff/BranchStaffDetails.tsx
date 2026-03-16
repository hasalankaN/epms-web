"use client";

import React, { useState, useMemo, useCallback } from "react";

import type { StaffDataType } from "@/types/user-management";

import { BranchStaffToolbar } from "./BranchStaffToolbar";
import { BranchStaffTable } from "./BranchStaffTable";

// ===== MOCK DATA =====
const mockStaff: StaffDataType[] = [
  {
    id: "staff-1",
    regDate: "01/21",
    idNo: "#000001",
    name: "Amali Perera",
    district: "Colombo",
    phone: "+9470 492 2345",
    whatsApp: "+9470 492 2345",
    email: "user@gmail.com",
    privileges: "Privilege 1",
    commissions: "N/A",
    branch: "Colombo",
    salaryStatus: "OVER_DUE",
    status: "ACTIVE",
    role: "Manager",
    rawPrivileges: [],
    isBranchManager: false
  },
  {
    id: "staff-2",
    regDate: "01/21",
    idNo: "#000001",
    name: "Amali Perera",
    district: "Colombo",
    phone: "+9470 492 2345",
    whatsApp: "+9470 492 2345",
    email: "user@gmail.com",
    privileges: "Privilege 1",
    commissions: "N/A",
    branch: "Colombo",
    salaryStatus: "PENDING",
    status: "ACTIVE",
    role: "",
    rawPrivileges: [],
    isBranchManager: false
  },
  {
    id: "staff-3",
    regDate: "01/21",
    idNo: "#000001",
    name: "Amali Perera",
    district: "Colombo",
    phone: "+9470 492 2345",
    whatsApp: "+9470 492 2345",
    email: "user@gmail.com",
    privileges: "Privilege 1",
    commissions: "N/A",
    branch: "Colombo",
    salaryStatus: "PAID",
    status: "ACTIVE",
    role: "",
    rawPrivileges: [],
    isBranchManager: false
  },
  {
    id: "staff-4",
    regDate: "01/21",
    idNo: "#000001",
    name: "Amali Perera",
    district: "Colombo",
    phone: "+9470 492 2345",
    whatsApp: "+9470 492 2345",
    email: "user@gmail.com",
    privileges: "Privilege 1",
    commissions: "N/A",
    branch: "Colombo",
    salaryStatus: "OVER_DUE",
    status: "INACTIVE",
    role: "",
    rawPrivileges: [],
    isBranchManager: false
  },
  {
    id: "staff-5",
    regDate: "01/21",
    idNo: "#000001",
    name: "Amali Perera",
    district: "Colombo",
    phone: "+9470 492 2345",
    whatsApp: "+9470 492 2345",
    email: "user@gmail.com",
    privileges: "Privilege 1",
    commissions: "N/A",
    branch: "Colombo",
    salaryStatus: "PAID",
    status: "INACTIVE",
    role: "",
    rawPrivileges: [],
    isBranchManager: false
  },
];

export function BranchStaffDetails() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchQuery) return mockStaff;

    const lowerQuery = searchQuery.toLowerCase();

    return mockStaff.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.idNo.toLowerCase().includes(lowerQuery) ||
        item.phone.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const pageSize = 10;
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  const handleRowSelectionChange = useCallback((id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const newSelection = Object.fromEntries(filteredData.map((staff) => [staff.id, true]));
      
      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  }, [filteredData]);

  return (
    <div className="flex flex-col gap-4">
      <BranchStaffToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <BranchStaffTable
        data={filteredData}
        rowSelection={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        onSelectAll={handleSelectAll}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
