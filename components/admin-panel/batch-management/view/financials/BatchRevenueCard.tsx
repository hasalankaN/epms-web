"use client";

import React from "react";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface BatchRevenueCardProps {
  completedPercentage: number;
  estimatedPayment: string;
  pendingPayment: string;
  className?: string;
}

export function BatchRevenueCard({
  completedPercentage = 75,
  estimatedPayment = "89,935",
  pendingPayment = "19,935",
  className,
}: BatchRevenueCardProps) {
  // Data for the circular progress chart
  const data = [
    { name: "Completed", value: completedPercentage },
    { name: "Remaining", value: 100 - completedPercentage },
  ];

  return (
    <div
      className={`flex h-auto lg:h-[134px] w-full items-center gap-4 lg:gap-6 rounded-lg border border-[#E2E8F0] bg-transparent px-4 py-6 lg:px-6 lg:py-0 ${className || ""}`}
    >
      {/* Circular Progress Chart */}
      <div className="relative shrink-0">
        <ResponsiveContainer width={100} height={100} className="lg:!w-[100px] lg:!h-[100px]">
          <PieChart>
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="50%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#FBCFE8" />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="90%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              paddingAngle={0}
            >
              <Cell fill="url(#progressGradient)" />
              <Cell fill="#F1F5F9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-inter text-[14px] sm:text-[18px] font-semibold leading-[20px] sm:leading-[30px] text-[#020618]">
            {completedPercentage}%
          </span>
          <span className="font-inter text-[10px] sm:text-[12px] font-medium leading-[14px] sm:leading-[16px] text-[#90A1B9]">
            Completed
          </span>
        </div>
      </div>

      {/* Revenue Details */}
      <div className="flex flex-1 flex-col">
        {/* Title */}
        <h3 className="font-inter text-[14px] sm:text-[16px] font-semibold leading-[20px] sm:leading-[24px] text-[#0F172B]">
          Revenue
        </h3>

        {/* Payment Details */}
        <div className="mt-2 sm:mt-4 flex flex-wrap gap-4 sm:gap-6">
          {/* Estimated Payment */}
          <div className="flex flex-col">
            <span className="font-inter text-[11px] sm:text-[12px] font-normal leading-[16px] text-[#45556C]">
              Estimated Payment
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-inter text-[14px] sm:text-[16px] font-semibold leading-[20px] sm:leading-[24px] text-[#0F172B] underline">
                {estimatedPayment}
              </span>
              <span className="font-inter text-[10px] sm:text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                LKR
              </span>
            </div>
          </div>

          {/* Pending Payment */}
          <div className="flex flex-col">
            <span className="font-inter text-[11px] sm:text-[12px] font-normal leading-[16px] text-[#45556C]">
              Pending Payment
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-inter text-[14px] sm:text-[16px] font-semibold leading-[20px] sm:leading-[24px] text-[#0F172B] underline">
                {pendingPayment}
              </span>
              <span className="font-inter text-[10px] sm:text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                LKR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

