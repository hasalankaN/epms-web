"use client";

import React from "react";

import Image from "next/image";

import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle, motion, itemVariants } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetReferralAgentSummary } from "@/hooks/api/referrals/useGetReferralAgentSummary";

import { AgentTeamInfoTable } from "./views/AgentTeamInfoTable";
import { AgentCourseEnrollmentsTable } from "./views/AgentCourseEnrollmentsTable";
import { AgentBatchEnrollmentsTable } from "./views/AgentBatchEnrollmentsTable";
import { AgentProductsTable } from "./views/AgentProductsTable";

interface AgentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string | null;
}

export function AgentProfileModal({ isOpen, onClose, memberId }: AgentProfileModalProps) {
  const { data: summary, isLoading } = useGetReferralAgentSummary(memberId);

  const profile = summary?.profile;
  const cards = summary?.summary_cards;

  const formatAmount = (value: number | undefined) => {
    if (value === undefined || value === null) return "0.00";
    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        isLoading={isLoading}
        animateChildren={true}
        className="flex max-h-[90vh] w-[95vw] flex-col gap-0 overflow-hidden bg-white p-0 sm:h-[640px] sm:max-w-[704px] sm:rounded-[12px] border-[#E2E8F0] shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        {/* Static Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 p-4 sm:p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              Agent Profile
            </DialogTitle>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </motion.div>

        {/* Scrollable Body */}
        <motion.div variants={itemVariants} className="flex-1 overflow-y-auto px-6 pt-4 pb-6 flex flex-col gap-4 sm:gap-[16px] custom-scrollbar bg-white w-full">
          
          {/* Profile Quick Info Section */}
          <div className="flex gap-8 items-start w-full border-b border-[#F1F5F9] pb-6">
            
            {/* Avatar Section */}
            <div className="relative h-16 w-16 flex-shrink-0 rounded-full bg-[#D9D9D9] shadow-sm border border-[#E2E8F0] overflow-visible">
              <Image
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                alt="Agent"
                fill
                className="rounded-full object-cover"
              />
              {profile?.status === "ACTIVE" && (
                <div 
                  className="absolute z-10 flex items-center justify-center px-2 py-[2px] bg-[#DFFFF0] text-[#16A34A] text-[12px] font-medium leading-[16px] rounded-[32px] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] whitespace-nowrap"
                  style={{ left: "32px", bottom: "-4px" }}
                >
                  Active
                </div>
              )}
            </div>

            {/* Responsive Grid Section */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_178.6px] gap-x-6 gap-y-4 pt-0">
              
              {/* 1. Agent Details */}
              <div className="flex flex-col items-start text-left order-1 sm:order-1 lg:order-1">
                {isLoading ? (
                  <>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24 mt-1" />
                    <Skeleton className="h-4 w-20 mt-1" />
                  </>
                ) : (
                  <>
                    <h2 className="text-[16px] font-semibold leading-[24px] text-[#1D293D] whitespace-nowrap">{profile?.name || "—"}</h2>
                    <div className="text-[12px] font-normal leading-[16px] text-[#62748E] mt-1">{profile?.member_code || "—"}</div>
                    <div className="text-[12px] font-normal leading-[16px] text-[#45556C] mt-[4px]">{profile?.role || "—"}</div>
                  </>
                )}
              </div>

              {/* 2. Email Info */}
              <div className="flex items-center gap-2 text-[12px] font-normal text-[#45556C] order-2 sm:order-3 lg:order-4">
                <i className="email-icon h-4 w-4 text-[#64748B]" />
                <span className="truncate max-w-[200px]">{isLoading ? <Skeleton className="h-4 w-32" /> : profile?.email || "—"}</span>
              </div>

              {/* 3. Phone Info */}
              <div className="flex items-center gap-2 text-[12px] font-normal text-[#45556C] order-3 sm:order-4 lg:order-5">
                <i className="phone h-4 w-4 text-[#64748B]" />
                <span>{isLoading ? <Skeleton className="h-4 w-28" /> : profile?.phone || "—"}</span>
              </div>

              {/* 4. WhatsApp Info */}
              <div className="flex items-center gap-2 text-[12px] font-normal text-[#45556C] order-4 sm:order-5 lg:order-6">
                <i className="whatsapp-logo h-4 w-4 text-[#64748B]" />
                <span>{isLoading ? <Skeleton className="h-4 w-28" /> : profile?.whatsapp || "—"}</span>
              </div>

              {/* 5. Team Leader Details */}
              <div className="flex flex-col items-start order-5 sm:order-2 lg:order-2">
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : profile?.role === "LEADER" ? (
                  <>
                    <div className="text-[12px] font-medium leading-[16px] text-[#F6339A]">Team Leader</div>
                    <div className="text-[12px] font-normal leading-[16px] text-[#45556C] mt-1">+ Team Members Assigned</div>
                  </>
                ) : (
                  <>
                    <div className="text-[12px] font-medium leading-[16px] text-[#1D293D] truncate">Team Member</div>
                  </>
                )}
              </div>

              {/* 6. Pink Commission Card */}
              <div className="flex justify-start w-auto order-6 sm:order-6 lg:order-3">
                <div 
                  className="flex flex-col justify-center items-start gap-2 rounded-[8px] border border-[#E2E8F0] px-3 py-[6px] min-w-[178.6px] w-fit"
                  style={{ 
                    maxWidth: "100%",
                    background: "linear-gradient(315deg, #FFCFEA 0.35%, #F8FAFC 99.65%)"
                  }}
                >
                  <span className="text-[12px] font-normal leading-[16px] text-[#45556C]">Total Commission</span>
                  <span className="text-[16px] font-semibold leading-[24px] text-[#1D293D]">
                    {isLoading ? <Skeleton className="h-6 w-20" /> : formatAmount(cards?.total_commissions)}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 6 Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            <MetricCard title="Commission from Team" value={formatAmount(cards?.commissions_from_teams)} isLoading={isLoading} />
            <MetricCard title="Direct Commission" value={formatAmount(cards?.direct_commissions)} isLoading={isLoading} />
            <MetricCard title="Estimated Commission" value={formatAmount(cards?.estimated_commissions)} isLoading={isLoading} />
            <MetricCard title="Pending Commission" value={formatAmount(cards?.pending_commissions)} isLoading={isLoading} />
            <MetricCard title="Commission Withdraws" value={formatAmount(cards?.commission_withdrawn)} isLoading={isLoading} />
            <MetricCard title="Pending Withdrawal" value={formatAmount(cards?.pending_withdrawals)} isLoading={isLoading} />
          </div>

          {/* Tables Section */}
          <div className="flex flex-col w-full pt-2">
            {profile?.role === "LEADER" && (
              <>
                <AgentTeamInfoTable memberId={memberId} />
                <div className="h-[1px] w-full bg-[#E2E8F0] my-4" />
              </>
            )}
            <AgentCourseEnrollmentsTable memberId={memberId} />
            <div className="h-[1px] w-full bg-[#E2E8F0] my-4" />
            
            <AgentBatchEnrollmentsTable memberId={memberId} />
            <div className="h-[1px] w-full bg-[#E2E8F0] my-4" />
            
            <AgentProductsTable memberId={memberId} />
          </div>

        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function MetricCard({ title, value, isLoading }: { title: string; value: string; isLoading?: boolean }) {
  return (
    <div className="flex flex-col justify-center border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(16,24,40,0.10)] rounded-[8px] p-[16px] w-full bg-white h-[76px]">
      <span className="text-[14px] font-normal leading-[20px] text-[#45556C] font-inter mb-1">{title}</span>
      <span className="text-[14px] font-medium leading-[20px] text-[#1D293D] font-inter">
        {isLoading ? <Skeleton className="h-5 w-24" /> : value}
      </span>
    </div>
  );
}
