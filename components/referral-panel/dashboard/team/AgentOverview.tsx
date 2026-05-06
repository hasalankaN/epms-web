"use client";

import React from "react";

export function AgentOverview() {
  return (
    <div className="flex w-full flex-col gap-4 px-6 pb-4 pt-3">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-[20px] font-semibold leading-[32px] text-[#1D293D]">
          My Agents
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex w-[200px] flex-col gap-2 rounded-lg border border-[#E2E8F0] bg-transparent p-3">
          <span className="font-sans text-[14px] font-normal leading-[20px] text-[#45556C]">
            Number of Agents
          </span>
          <span className="font-sans text-[24px] font-semibold leading-[38px] text-[#1D293D]">
            05
          </span>
        </div>
      </div>
    </div>
  );
}
