"use client";

import React, { useState } from "react";
import {
  DollarSign,
  Download,
  PlusCircle,
  FileText,
  Search,
  Filter,
  Eye,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { AdjustSalaryModal } from "./AdjustSalaryModal";
import { GenerateSlipsModal } from "./GenerateSlipsModal";
import { AddBonusModal } from "./AddBonusModal";
import { SalaryDrawer } from "./SalaryDrawer";
import {
  useEmployeeSalariesQuery,
  useMySalarySlipsQuery,
  useBonusesQuery,
} from "@/hooks/api/salary/useSalary";
import type { EmployeeSalaryRecord, SalarySlip, BonusRecord } from "@/types/dto/salary.dto";
import { toast } from "sonner";

export function HrPayrollView() {
  const [activeTab, setActiveTab] = useState<"employees" | "slips" | "bonuses" | "reports">("employees");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modals state
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isBonusOpen, setIsBonusOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EmployeeSalaryRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Queries
  const { data: salaryData, isLoading: isSalaryLoading } = useEmployeeSalariesQuery(page, 10, search);
  const { data: slips = [], isLoading: isSlipsLoading } = useMySalarySlipsQuery();
  const { data: bonuses = [], isLoading: isBonusesLoading } = useBonusesQuery();

  const employeeRecords = salaryData?.items || [];

  const employeeColumns: Column<EmployeeSalaryRecord>[] = [
    {
      header: "Employee",
      accessorKey: "employeeName",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.employeeName}</p>
          <p className="text-xs text-muted-foreground">{item.employeeCode} • {item.departmentName}</p>
        </div>
      ),
    },
    {
      header: "Position",
      accessorKey: "positionName",
      cell: (item) => <span className="text-xs font-medium">{item.positionName}</span>,
    },
    {
      header: "Basic Salary",
      accessorKey: "basicSalary",
      cell: (item) => (
        <span className="font-semibold text-sm">
          Rs. {item.basicSalary.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Allowances",
      accessorKey: "allowancesTotal",
      cell: (item) => (
        <span className="text-xs font-medium text-emerald-600">
          + Rs. {item.allowancesTotal.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Deductions",
      accessorKey: "deductionsTotal",
      cell: (item) => (
        <span className="text-xs font-medium text-destructive">
          - Rs. {item.deductionsTotal.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Net Take-Home",
      accessorKey: "netSalary",
      cell: (item) => (
        <span className="font-bold text-sm text-[#E60076]">
          Rs. {item.netSalary.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              setSelectedRecord(item);
              setIsDrawerOpen(true);
            }}
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            Breakdown
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs text-[#E60076]"
            onClick={() => {
              setSelectedRecord(item);
              setIsAdjustOpen(true);
            }}
          >
            Adjust
          </Button>
        </div>
      ),
    },
  ];

  const slipColumns: Column<SalarySlip>[] = [
    {
      header: "Month",
      accessorKey: "month",
      cell: (item) => <span className="font-semibold text-sm">{item.month}</span>,
    },
    {
      header: "Basic (LKR)",
      accessorKey: "basic",
      cell: (item) => <span>Rs. {item.basic.toLocaleString()}</span>,
    },
    {
      header: "Allowances & OT",
      accessorKey: "allowances",
      cell: (item) => (
        <span>Rs. {(item.allowances + item.overtime + item.bonus).toLocaleString()}</span>
      ),
    },
    {
      header: "Statutory Deductions",
      accessorKey: "deductions",
      cell: (item) => <span className="text-destructive">- Rs. {item.deductions.toLocaleString()}</span>,
    },
    {
      header: "Net Disbursed",
      accessorKey: "net",
      cell: (item) => (
        <span className="font-bold text-foreground">Rs. {item.net.toLocaleString()}</span>
      ),
    },
    {
      header: "Action",
      accessorKey: "id",
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs gap-1.5"
          onClick={() => toast.success(`Downloading salary slip for ${item.month}...`)}
        >
          <Download className="w-3.5 h-3.5" />
          PDF
        </Button>
      ),
    },
  ];

  const bonusColumns: Column<BonusRecord>[] = [
    {
      header: "Employee",
      accessorKey: "employeeName",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.employeeName}</p>
          <p className="text-xs text-muted-foreground">{item.employeeCode} • {item.departmentName}</p>
        </div>
      ),
    },
    {
      header: "Bonus Description",
      accessorKey: "description",
      cell: (item) => <span className="text-xs font-medium">{item.description}</span>,
    },
    {
      header: "Target Month",
      accessorKey: "month",
      cell: (item) => <span className="text-xs text-muted-foreground">{item.month}</span>,
    },
    {
      header: "Amount (LKR)",
      accessorKey: "amount",
      cell: (item) => (
        <span className="font-bold text-sm text-[#E60076]">
          Rs. {item.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Grant Date",
      accessorKey: "grantedDate",
      cell: (item) => <span className="text-xs text-muted-foreground">{item.grantedDate}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Salary & Payroll Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Calculate statutory payroll, EPF/ETF contributions, monthly pay slips, and incentive bonuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsBonusOpen(true)}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Allocate Bonus
          </Button>
          <Button
            className="bg-[#E60076] hover:bg-[#c40064] text-white gap-2"
            onClick={() => setIsGenerateOpen(true)}
          >
            <FileText className="w-4 h-4" />
            Generate Monthly Slips
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("employees")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "employees"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Staff Compensation Roster ({employeeRecords.length})
        </button>
        <button
          onClick={() => setActiveTab("slips")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "slips"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Disbursed Salary Slips ({slips.length})
        </button>
        <button
          onClick={() => setActiveTab("bonuses")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "bonuses"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Bonuses & Special Allowances ({bonuses.length})
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "reports"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          EPF / ETF Statutory Report
        </button>
      </div>

      {/* Tab 1: Staff Compensation */}
      {activeTab === "employees" && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by worker name, code, or position..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={employeeColumns}
              data={employeeRecords}
              isLoading={isSalaryLoading}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Salary Slips */}
      {activeTab === "slips" && (
        <div className="space-y-4">
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={slipColumns}
              data={slips}
              isLoading={isSlipsLoading}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Tab 3: Bonuses */}
      {activeTab === "bonuses" && (
        <div className="space-y-4">
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={bonusColumns}
              data={bonuses}
              isLoading={isBonusesLoading}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Tab 4: Statutory Reports */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Total Employee EPF (8%)</p>
              <p className="text-2xl font-bold mt-1 text-foreground">Rs. 384,500.00</p>
              <p className="text-xs text-muted-foreground mt-1">Deducted from employee salaries</p>
            </div>
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Total Employer EPF (12%)</p>
              <p className="text-2xl font-bold mt-1 text-[#E60076]">Rs. 576,750.00</p>
              <p className="text-xs text-muted-foreground mt-1">Company statutory liability</p>
            </div>
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Total Employer ETF (3%)</p>
              <p className="text-2xl font-bold mt-1 text-foreground">Rs. 144,187.50</p>
              <p className="text-xs text-muted-foreground mt-1">Company statutory liability</p>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Central Bank / EPF Department Monthly Return Form C</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Ready for electronic submission to the Department of Labour Sri Lanka.</p>
            </div>
            <Button
              className="bg-[#E60076] hover:bg-[#c40064] text-white gap-2"
              onClick={() => toast.success("Form C statutory return document exported!")}
            >
              <Download className="w-4 h-4" />
              Download Form C Schedule
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AdjustSalaryModal
        open={isAdjustOpen}
        onOpenChange={setIsAdjustOpen}
        employeeRecord={selectedRecord}
      />

      <GenerateSlipsModal
        open={isGenerateOpen}
        onOpenChange={setIsGenerateOpen}
      />

      <AddBonusModal
        open={isBonusOpen}
        onOpenChange={setIsBonusOpen}
      />

      <SalaryDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        record={selectedRecord}
        onAdjustClick={() => setIsAdjustOpen(true)}
      />
    </div>
  );
}

