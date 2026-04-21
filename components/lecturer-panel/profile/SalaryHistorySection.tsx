"use client";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SalaryRecord {
  id: string;
  paidDate: string;
  description: string;
  status: "Paid" | "Pending";
  amount: string;
}

interface SalaryHistorySectionProps {
  salaryType?: string;
  amount?: string;
  salaryRecords: SalaryRecord[];
}

export function SalaryHistorySection({ 
  salaryType = "Monthly Salary", 
  amount = "XXXX.00", 
  salaryRecords 
}: SalaryHistorySectionProps) {
  return (
    <div className="max-w-[1000px] space-y-8">
      {/* Salary Type & Amount Section */}
      <div className="space-y-5">
        <h3 className="text-[16px] font-bold text-[#1D293D]">Salary Type & Amount</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-[#1D293D]">Salary Type</Label>
            <Input 
              readOnly 
              defaultValue={salaryType} 
              className="h-10 rounded-[8px] border-none bg-[#F1F5F9] text-[#90A1B9] focus-visible:ring-0" 
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-[#1D293D]">Amount</Label>
            <Input 
              readOnly 
              defaultValue={amount} 
              className="h-10 rounded-[8px] border-none bg-[#F1F5F9] text-[#90A1B9] focus-visible:ring-0" 
            />
          </div>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="space-y-5">
        <h3 className="text-[16px] font-bold text-[#1D293D]">Payment History</h3>
        <div className="overflow-hidden rounded-[10px] border border-[#E2E8F0]">
          <table className="w-full text-left">
            <thead className="bg-[#FFF1F8] text-[12px] font-bold text-[#0F172B]">
              <tr>
                <th className="px-6 py-3.5">Paid Date</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F1F5F9]">
              {salaryRecords.map((record) => (
                <tr key={record.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4 text-[13px] text-[#45556C]">
                    {record.paidDate}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#45556C]">
                    {record.description}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                      record.status === "Paid" ? "bg-[#DFFFF0] text-[#16A34A]" : "bg-[#FFF7D7] text-[#F59E0B]"
                    )}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-[#45556C]">
                    {record.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[12px] font-medium text-[#E60076] hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
