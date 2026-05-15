import React from "react";

const statsData = [
  { label: "Today's Referrals", value: "XX" },
  { label: "Today's Estimated Income", value: "XXXX.00" },
  { label: "Todays Income", value: "XXXX.00" },
  { label: "This Month's Referrals", value: "XX" },
  { label: "This Month's Income", value: "XXXX.00" },
  { label: "Total Referrals", value: "XX" },
  { label: "Total Estimated Income", value: "XXXX.00" },
  { label: "Total Income", value: "XXXX.00" },
  { label: "Total Pending Income", value: "XX" },
  { label: "Total Withdrawals", value: "XXXX.00" },
];

export function ReferralStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {statsData.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-start gap-2 rounded-lg border border-[#E2E8F0] p-3 shadow-sm bg-white"
        >
          <span className="font-sans text-sm font-normal leading-5 text-[#45556C]">
            {stat.label}
          </span>
          <span className="font-sans text-[24px] font-semibold leading-[38px] text-[#1D293D]">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
