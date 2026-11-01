"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { EmployeeSalaryRecord } from "@/types/dto/salary.dto";

interface SalaryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: EmployeeSalaryRecord | null;
  onAdjustClick?: () => void;
}

export function SalaryDrawer({
  open,
  onOpenChange,
  record,
  onAdjustClick,
}: SalaryDrawerProps) {
  if (!record) return null;

  const epfEmployee = record.basicSalary * 0.08;
  const epfEmployer = record.basicSalary * 0.12;
  const etfEmployer = record.basicSalary * 0.03;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Salary Structure & Statutory Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Header Info */}
          <div className="p-4 rounded-xl border bg-muted/20 flex justify-between items-center">
            <div>
              <p className="font-bold text-base text-foreground">{record.employeeName}</p>
              <p className="text-xs text-muted-foreground">{record.employeeCode} • {record.positionName}</p>
              <p className="text-xs text-muted-foreground">{record.departmentName}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Calculated Net Pay</span>
              <p className="text-xl font-bold text-[#E60076]">
                Rs. {record.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Earnings */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Earnings & Allowances</h4>
            <div className="p-3 rounded-lg border bg-card space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Basic Salary</span>
                <span className="font-semibold text-foreground">Rs. {record.basicSalary.toLocaleString()}</span>
              </div>
              {record.allowances?.map((a) => (
                <div key={a.id} className="flex justify-between text-muted-foreground">
                  <span>{a.description}</span>
                  <span>+ Rs. {a.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 border-t font-semibold text-emerald-600">
                <span>Total Gross Earnings</span>
                <span>Rs. {(record.basicSalary + record.allowancesTotal).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Statutory Deductions */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Statutory Deductions & Contributions</h4>
            <div className="p-3 rounded-lg border bg-card space-y-1.5 text-xs">
              <div className="flex justify-between text-destructive">
                <span>Employee EPF (8%)</span>
                <span>- Rs. {epfEmployee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              {record.deductions?.map((d) => (
                <div key={d.id} className="flex justify-between text-muted-foreground">
                  <span>{d.description}</span>
                  <span>- Rs. {d.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 border-t font-semibold text-destructive">
                <span>Total Deductions</span>
                <span>- Rs. {(epfEmployee + record.deductionsTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Employer Contribution note */}
              <div className="pt-2 border-t mt-2 space-y-1 text-muted-foreground text-[11px]">
                <div className="flex justify-between">
                  <span>Employer EPF (12%)</span>
                  <span>Rs. {epfEmployer.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Employer ETF (3%)</span>
                  <span>Rs. {etfEmployer.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onAdjustClick && (
              <Button
                className="bg-[#E60076] hover:bg-[#c40064] text-white"
                onClick={() => {
                  onOpenChange(false);
                  onAdjustClick();
                }}
              >
                Adjust Basic Salary
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

