"use client";

import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#299D8F", "#E76F51", "#264653", "#E9C46A", "#F4A261"];

interface PieItem {
  name: string;
  value: number;
  color: string;
  amount: string;
}

const CustomLegend = ({ data }: { data: PieItem[] }) => (
  <div className="flex flex-col gap-[24px]">
    {data.map((entry, index) => (
      <div key={index} className="flex items-center gap-[64px] w-fit">
        <div className="flex items-center gap-[0.5rem] min-w-[120px]">
          <div
            className="w-[11px] h-[11px] rounded-[0.125rem]"
            style={{ background: entry.color }}
          />
          <span className="font-inter text-[14px] font-medium leading-[20px] text-[#314158]">
            {entry.name}
          </span>
        </div>
        <span className="font-inter text-[14px] font-medium leading-[20px] text-[#314158]">
          {entry.amount}
        </span>
      </div>
    ))}
  </div>
);

interface SalesByItemsPieChartProps {
  items?: { item_name: string; total_sales: string }[];
  isLoading?: boolean;
}

export function SalesByItemsPieChart({ items, isLoading }: SalesByItemsPieChartProps) {
  const pieData: PieItem[] = (items ?? []).map((item, i) => ({
    name: item.item_name,
    value: parseFloat(item.total_sales ?? "0"),
    color: COLORS[i % COLORS.length],
    amount: `LKR ${parseFloat(item.total_sales ?? "0").toLocaleString("en-LK", { minimumFractionDigits: 2 })}`,
  }));

  // Fallback display items when no real data
  const displayData = pieData.length > 0 ? pieData : [
    { name: "Item 1", value: 1, color: COLORS[0], amount: "—" },
    { name: "Item 2", value: 1, color: COLORS[1], amount: "—" },
    { name: "Item 3", value: 1, color: COLORS[2], amount: "—" },
    { name: "Item 4", value: 1, color: COLORS[3], amount: "—" },
    { name: "Item 5", value: 1, color: COLORS[4], amount: "—" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#1C1917]">
          Top 5 Items
        </h2>
      </div>

      {isLoading ? (
        <div className="flex h-[334px] items-center justify-center">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-0">
          <div className="h-[334px] w-full max-w-[332.495px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={160}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {displayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col items-center md:items-start md:pl-[64px]">
            <CustomLegend data={displayData} />
          </div>
        </div>
      )}
    </div>
  );
}
