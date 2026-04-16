"use client";

import React, { useState } from "react";

import { format } from "date-fns";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";


import { Skeleton } from "@/components/ui/skeleton";
import type { ReferralCommissionItem, StudentDetailProfile } from "@/types/user-management";

interface StudentReferralDetailsProps {
  profile?: StudentDetailProfile;
  commissions?: ReferralCommissionItem[];
  totalCommissions?: number;
  isLoading?: boolean;
}

export function StudentReferralDetails({ 
  profile, 
  commissions = [], 
  totalCommissions = 0,
  isLoading 
}: StudentReferralDetailsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalCount = totalCommissions;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const columns: Column<ReferralCommissionItem>[] = [
    {
      header: "Date",
      accessorKey: "created_at",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          {item.created_at ? format(new Date(item.created_at), "yyyy/MM/dd") : "-"}
        </div>
      ),
    },
    {
      header: "Used For",
      accessorKey: "source_name",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.source_name || "-"}</div>,
    },
    {
      header: "Student Name",
      accessorKey: "triggered_by_student_name",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.triggered_by_student_name || "-"}</div>,
    },
    {
      header: "Amount",
      accessorKey: "payment_amount",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          {item.payment_amount ? `LKR ${new Intl.NumberFormat().format(parseFloat(item.payment_amount))}` : "-"}
        </div>
      ),
    },
    {
      header: "Commission Gained",
      accessorKey: "amount_snapshot",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          LKR {new Intl.NumberFormat().format(parseFloat(item.amount_snapshot))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <h2 className="font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
        Referral Details
      </h2>
      
      <div className="mt-4 flex flex-col md:flex-row gap-4 w-full">
        {/* Referral Code Card */}
        <div 
          className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] py-6 min-h-[110px]"
          style={{
            border: "1px solid #FFCFEA",
            background: "linear-gradient(315deg, #FFCFEA 0.35%, #F8FAFC 99.65%)",
            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)"
          }}
        >
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px]">
            Referral Code
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
              {profile?.referral_code || "####"}
            </div>
          )}
        </div>

        {/* Total Commissions Earned Card */}
        <div 
          className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] border border-[#E2E8F0] py-6 min-h-[110px]"
        >
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px]">
            Total Commissions Earned
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-32" />
          ) : (
            <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
              LKR {new Intl.NumberFormat().format(parseFloat(profile?.total_commissions_earned || "0"))}
            </div>
          )}
        </div>

        {/* No of Referrals Card */}
        <div 
          className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] border border-[#E2E8F0] py-6 min-h-[110px]"
        >
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px]">
            No of Referrals
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-12" />
          ) : (
            <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
              {profile?.referral_count || 0}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 w-full max-w-full overflow-hidden">
        <DataTable
          data={commissions}
          columns={columns}
          keyExtractor={(item) => item.id}
          showCheckboxes={false}
          tableContainerClassName="h-auto"
          isLoading={isLoading}
          pagination={{
            variant: "simple",
            totalCount: totalCount,
            currentPage: currentPage,
            totalPages: totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
}

