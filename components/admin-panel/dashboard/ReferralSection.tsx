"use client";

import React from "react";

import { ReferralStats } from "./referral/stats/ReferralStats";
import { ReferralPendingStats } from "./referral/stats/ReferralPendingStats";
import { ReferralContent } from "./referral/ReferralContent";
import { ReferralAgentStats } from "./referral/agents/ReferralAgentStats";
import { ReferralStudentStats } from "./referral/students/ReferralStudentStats";

export function ReferralSection() {
  return (
    <div className="flex flex-col gap-4">
      <ReferralStats />
      
      {/* Pending Stats - 24px gap from above (gap-4 = 16px + mt-2 = 8px) */}
      <div className="mt-2">
        <ReferralPendingStats />
      </div>
      
      {/* Referral Content Tabs */}
      <ReferralContent />

      {/* Referral Agents Statistics Section */}
      <div className="flex flex-col gap-[12px]">
        {/* Header */}
        <div className="mt-2 w-full border-b border-[#E2E8F0]">
          <h2 className="font-sans text-[20px] font-semibold leading-[32px] text-[#1D293D]">
            Referral Agents Statistics
          </h2>
        </div>
        
        {/* Agent Cards */}
        <ReferralAgentStats />
      </div>

      {/* Student Referral Statistics Section - 24px gap from above */}
      <div className="mt-2 flex flex-col gap-[12px]">
        {/* Header */}
        <div className="w-full border-b border-[#E2E8F0]">
          <h2 className="font-sans text-[20px] font-semibold leading-[32px] text-[#1D293D]">
            Student Referral Statistics
          </h2>
        </div>
        
        {/* Student Cards */}
        <ReferralStudentStats />
      </div>
    </div>
  );
}

