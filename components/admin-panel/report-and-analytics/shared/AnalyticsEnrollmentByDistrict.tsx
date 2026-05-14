"use client";

import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Tooltip,
} from "recharts";

interface DistrictBarItem {
  district: string;
  count: number;
}

const MOCK_DISTRICTS: DistrictBarItem[] = [
  { district: "Galle", count: 186 },
  { district: "Colombo", count: 305 },
  { district: "Gampaha", count: 237 },
  { district: "Kandy", count: 73 },
  { district: "Kurunegala", count: 209 },
  { district: "Anuradhapura", count: 214 },
];

interface AnalyticsEnrollmentByDistrictProps {
  data?: DistrictBarItem[];
}

export function AnalyticsEnrollmentByDistrict({
  data = MOCK_DISTRICTS,
}: AnalyticsEnrollmentByDistrictProps) {
  const itemHeight = 50;
  const chartHeight = Math.max(384, data.length * itemHeight);

  return (
    <div className="w-full h-[384px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-2">
      <div style={{ height: `${chartHeight}px`, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 12, right: 60, left: 0, bottom: 12 }}
            barCategoryGap={12}
          >
            <XAxis type="number" hide domain={[0, 'dataMax + 50']} />
            <YAxis dataKey="district" type="category" hide />
            
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border border-[#E2E8F0] rounded shadow-sm text-xs font-semibold text-[#1D293D]">
                      {`${payload[0].payload.district}: ${payload[0].value}`}
                    </div>
                  );
                }
                
                return null;
              }}
            />

            <Bar 
              dataKey="count" 
              fill="#0F172B" 
              radius={[0, 6, 6, 0]} 
              barSize={38}
              animationDuration={1000}
            >
              <LabelList
                dataKey="district"
                position="insideLeft"
                offset={12}
                style={{
                  fill: "#FFFFFF",
                  fontFamily: "Inter",
                  fontSize: "17.985px",
                  fontWeight: 500,
                  lineHeight: "23.98px",
                  letterSpacing: "-0.108px",
                  pointerEvents: "none"
                }}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={15}
                style={{
                  fill: "var(--foreground, #0F172B)",
                  fontFamily: "Inter",
                  fontSize: "17.985px",
                  fontWeight: 400,
                  lineHeight: "23.98px",
                  letterSpacing: "-0.108px",
                  pointerEvents: "none"
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
