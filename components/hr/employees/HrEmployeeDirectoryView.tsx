"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit,
  Shield,
  UserCheck,
  UserX,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { AssignSupervisorModal } from "./AssignSupervisorModal";
import { ChangeRoleModal } from "./ChangeRoleModal";
import { EditEmployeeModal } from "./EditEmployeeModal";
import { toast } from "sonner";
import { employeeService, type HrEmployeeRecord } from "@/lib/api/employee.service";

export type { HrEmployeeRecord };

export function HrEmployeeDirectoryView() {
  const router = useRouter();
  const [employees, setEmployees] = useState<HrEmployeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    setIsLoading(true);
    employeeService
      .getHrEmployees()
      .then((data) => {
        setEmployees(data || []);
      })
      .catch((err) => {
        console.error("Failed to load HR employees:", err);
        setEmployees([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const [selectedForEdit, setSelectedForEdit] = useState<HrEmployeeRecord | null>(null);
  const [selectedForSupervisor, setSelectedForSupervisor] = useState<HrEmployeeRecord | null>(null);
  const [selectedForRole, setSelectedForRole] = useState<HrEmployeeRecord | null>(null);
  const [selectedForDeactivate, setSelectedForDeactivate] = useState<HrEmployeeRecord | null>(null);

  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.status === "ACTIVE").length;
  const inactiveCount = employees.filter((e) => e.status === "INACTIVE").length;
  const newThisMonth = employees.filter((e) => e.joinDate.startsWith("2026-10")).length;

  const filtered = employees.filter((emp) => {
    const s = search.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(s) ||
      emp.code.toLowerCase().includes(s) ||
      emp.nic.toLowerCase().includes(s) ||
      emp.position.toLowerCase().includes(s);
    const matchesDept = deptFilter === "ALL" || emp.department === deptFilter;
    const matchesStatus = statusFilter === "ALL" || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleDeactivate = () => {
    if (!selectedForDeactivate) return;
    setEmployees(
      employees.map((e) =>
        e.id === selectedForDeactivate.id ? { ...e, status: "INACTIVE" } : e
      )
    );
    toast.success(`Deactivated employee record for ${selectedForDeactivate.name}`);
    setSelectedForDeactivate(null);
  };

  const columns: Column<HrEmployeeRecord>[] = [
    {
      header: "Employee Details",
      cell: (item) => (
        <div
          onClick={() => router.push(`/hr-panel/employees/${item.id}`)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <Avatar className="h-9 w-9 border border-pink-200">
            <AvatarFallback className="bg-pink-100 text-pink-700 font-bold text-xs">
              {item.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#E60076] transition-colors">
              {item.name}
            </p>
            <p className="text-[11px] text-slate-400">{item.code} · NIC: {item.nic}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      cell: (item) => <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.department}</span>,
    },
    {
      header: "Designation",
      cell: (item) => <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.position}</span>,
    },
    {
      header: "Supervisor",
      cell: (item) => <span className="text-xs text-slate-600 dark:text-slate-400">{item.supervisor}</span>,
    },
    {
      header: "Joined Date",
      cell: (item) => <span className="text-xs text-slate-500">{item.joinDate}</span>,
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/hr-panel/employees/${item.id}`)}
            className="h-7 text-xs px-2 text-[#E60076] hover:bg-pink-50"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedForEdit(item)}
            className="h-7 text-xs px-2"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedForSupervisor(item)}
            className="h-7 text-xs px-2 text-blue-600 hover:bg-blue-50"
          >
            Supervisor
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedForRole(item)}
            className="h-7 text-xs px-2 text-purple-600 hover:bg-purple-50"
          >
            Role
          </Button>
          {item.status === "ACTIVE" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedForDeactivate(item)}
              className="h-7 text-xs px-2 text-rose-600 hover:bg-rose-50"
            >
              Deactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Headcount" value={totalEmployees} icon={Users} subText="All recorded employees" />
        <StatCard label="Active Employees" value={activeCount} icon={UserCheck} subText="Active payroll status" />
        <StatCard label="Inactive / Resigned" value={inactiveCount} icon={UserX} subText="Offboarded accounts" />
        <StatCard label="New Onboardings" value={newThisMonth} icon={UserPlus} subText="Joined this month" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, code, NIC, position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {/* Department filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-pink-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Technology">Technology</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance & Accounting">Finance & Accounting</option>
            <option value="Operations">Operations</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-pink-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>

          <Button
            onClick={() => router.push(`/hr-panel/employees/add-employee`)}
            className="bg-[#E60076] hover:bg-[#d0006a] text-white text-xs gap-1.5 font-semibold"
          >
            <UserPlus className="h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
        <DataTable
          data={filtered}
          columns={columns}
          keyExtractor={(item) => item.id}
        />
      </div>

      <EditEmployeeModal
        isOpen={!!selectedForEdit}
        onClose={() => setSelectedForEdit(null)}
        employee={selectedForEdit}
        onSuccess={(updated) => {
          setEmployees(employees.map((e) => (e.id === updated.id ? updated : e)));
        }}
      />

      <AssignSupervisorModal
        isOpen={!!selectedForSupervisor}
        onClose={() => setSelectedForSupervisor(null)}
        employee={selectedForSupervisor}
        onSuccess={(empId, newSupervisor) => {
          setEmployees(
            employees.map((e) => (e.id === empId ? { ...e, supervisor: newSupervisor } : e))
          );
        }}
      />

      <ChangeRoleModal
        isOpen={!!selectedForRole}
        onClose={() => setSelectedForRole(null)}
        employee={selectedForRole}
        onSuccess={(empId, newRole) => {
          setEmployees(
            employees.map((e) => (e.id === empId ? { ...e, role: newRole } : e))
          );
        }}
      />

      <DeleteConfirmationModal
        isOpen={!!selectedForDeactivate}
        onClose={() => setSelectedForDeactivate(null)}
        onConfirm={handleDeactivate}
        title="Deactivate Employee Record"
        description={`Are you sure you want to deactivate ${selectedForDeactivate?.name} (${selectedForDeactivate?.code})? Their user account access will be revoked.`}
        confirmText="Confirm Deactivate"
      />
    </div>
  );
}

