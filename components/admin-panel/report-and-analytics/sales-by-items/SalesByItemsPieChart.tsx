"use client";

import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Item 1", value: 400, color: "#299D8F" },
  { name: "Item 2", value: 300, color: "#E76F51" },
  { name: "Item 3", value: 200, color: "#264653" },
  { name: "Item 4", value: 150, color: "#E9C46A" },
  { name: "Item 5", value: 100, color: "#F4A261" },
];

const CustomLegend = ({ data }: { data: any[] }) => (
  <div className="flex flex-col gap-[24px]">
    {data.map((entry, index) => (
      <div key={index} className="flex items-center gap-[64px] w-fit">
        <div className="flex items-center gap-[0.5rem] min-w-[120px]">
          <div 
            className="w-[11px] h-[11px] rounded-[0.125rem]" 
            style={{ 
              background: `linear-gradient(0deg, ${entry.color} 0%, ${entry.color} 100%)`
            }} 
          />
          <span className="font-inter text-[14px] font-medium leading-[20px] text-[#314158]">
            {entry.name}
          </span>
        </div>
        <span className="font-inter text-[14px] font-medium leading-[20px] text-[#314158]">
          Amount
        </span>
      </div>
    ))}
  </div>
);

export function SalesByItemsPieChart() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#1C1917]">
          Top 5 Items
        </h2>
      </div>
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-0">
        {/* Pie Chart Container */}
        <div className="h-[334px] w-full max-w-[332.495px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={160}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Container */}
        <div className="flex flex-col items-center md:items-start md:pl-[64px]">
          <CustomLegend data={data} />
        </div>
      </div>
    </div>
  );
}
