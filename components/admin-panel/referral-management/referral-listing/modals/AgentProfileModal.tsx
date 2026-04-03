"use client";

import React, { useState, useEffect } from "react";

import Image from "next/image";

import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle, motion, itemVariants } from "@/components/ui/dialog";

import { AgentTeamInfoTable } from "./views/AgentTeamInfoTable";
import { AgentCourseEnrollmentsTable } from "./views/AgentCourseEnrollmentsTable";
import { AgentBatchEnrollmentsTable } from "./views/AgentBatchEnrollmentsTable";
import { AgentProductsTable } from "./views/AgentProductsTable";

export interface AgentProfile {
  id: string;
  name: string;
  ref: string;
  memberId: string;
  email: string;
  phone: string;
  whatsapp: string;
  status: "Active" | "Inactive";
  isTeamLeader: boolean;
  totalCommission: string;

  // Metrics
  commissionFromTeam: string;
  directCommission: string;
  estimatedCommission: string;
  pendingCommission: string;
  commissionWithdrawals: string;
  pendingWithdrawal: string;

  // Leader Specific
  teamMembersAssigned?: number;

  // Member Specific
  teamLeaderName?: string;
  assignedDate?: string;
}

interface AgentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string | null;
}


export function AgentProfileModal({ isOpen, onClose, memberId }: AgentProfileModalProps) {
  const [profile, setProfile] = useState<AgentProfile | null>(null);

  useEffect(() => {
    if (isOpen && memberId) {
      setTimeout(() => {
        setProfile({
          id: memberId,
          name: "Agent Name",
          ref: "Ref#12345",
          memberId: "Member Id",
          email: "User@gmail.com",
          phone: "(+94) 70 493 4587",
          whatsapp: "(+94) 70 493 4587",
          status: "Active",
          isTeamLeader: memberId.includes("leader"), 
          totalCommission: "XXXX.00",

          commissionFromTeam: "XXXX.00",
          directCommission: "XXXX.00",
          estimatedCommission: "XXXX.00",
          pendingCommission: "XXXX.00",
          commissionWithdrawals: "XXXX.00",
          pendingWithdrawal: "XXXX.00",

          teamMembersAssigned: 5,
          teamLeaderName: "Team Leader Name",
          assignedDate: "2026/01/21",
        });
      }, 300);
    } else {
      setProfile(null);
    }
  }, [isOpen, memberId]);



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        isLoading={!profile}
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
          
          {/* Profile Quick Info Section - Unified Grid for all breakpoints using Order classes */}
          <div className="flex gap-8 items-start w-full border-b border-[#F1F5F9] pb-6">
            
            {/* Avatar Section */}
            <div className="relative h-16 w-16 flex-shrink-0 rounded-full bg-[#D9D9D9] shadow-sm border border-[#E2E8F0] overflow-visible">
              <Image
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                alt="Agent"
                fill
                className="rounded-full object-cover"
              />
              {profile?.status === "Active" && (
                <div 
                  className="absolute z-10 flex items-center justify-center px-2 py-[2px] bg-[#DFFFF0] text-[#16A34A] text-[12px] font-medium leading-[16px] rounded-[32px] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] whitespace-nowrap"
                  style={{ left: "32px", bottom: "-4px" }}
                >
                  Active
                </div>
              )}
            </div>

            {/* Responsive Grid Section: Stacks vertically on mobile, 2-col on tablet, 3-col on desktop */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_178.6px] gap-x-6 gap-y-4 pt-0">
              
              {/* 1. Agent Details: Mobile Order 1, Tablet Order 1, Desktop Order 1 */}
              <div className="flex flex-col items-start text-left order-1 sm:order-1 lg:order-1">
                <h2 className="text-[16px] font-semibold leading-[24px] text-[#1D293D] whitespace-nowrap">{profile?.name || "Agent Name"}</h2>
                <div className="text-[12px] font-normal leading-[16px] text-[#62748E] mt-1">{profile?.ref || "Ref#12345"}</div>
                <div className="text-[12px] font-normal leading-[16px] text-[#45556C] mt-[4px]">{profile?.memberId || "Member Id"}</div>
              </div>

              {/* 2. Email Info: Mobile Order 2, Tablet Order 3, Desktop Order 4 */}
              <div className="flex items-center gap-2 text-[12px] font-normal text-[#45556C] order-2 sm:order-3 lg:order-4">
                <i className="email-icon h-4 w-4 text-[#64748B]" />
                <span className="truncate max-w-[200px]">{profile?.email}</span>
              </div>

              {/* 3. Phone Info: Mobile Order 3, Tablet Order 4, Desktop Order 5 */}
              <div className="flex items-center gap-2 text-[12px] font-normal text-[#45556C] order-3 sm:order-4 lg:order-5">
                <i className="phone h-4 w-4 text-[#64748B]" />
                <span>{profile?.phone}</span>
              </div>

              {/* 4. WhatsApp Info: Mobile Order 4, Tablet Order 5, Desktop Order 6 */}
              <div className="flex items-center gap-2 text-[12px] font-normal text-[#45556C] order-4 sm:order-5 lg:order-6">
                <i className="whatsapp-logo h-4 w-4 text-[#64748B]" />
                <span>{profile?.whatsapp}</span>
              </div>

              {/* 5. Team Leader Details: Mobile Order 5, Tablet Order 2, Desktop Order 2 */}
              <div className="flex flex-col items-start order-5 sm:order-2 lg:order-2">
                {profile?.isTeamLeader ? (
                  <>
                    <div className="text-[12px] font-medium leading-[16px] text-[#F6339A]">Team Leader</div>
                    <div className="text-[12px] font-normal leading-[16px] text-[#45556C] mt-1">+ Team Members Assigned</div>
                  </>
                ) : (
                  <>
                    <div className="text-[12px] font-medium leading-[16px] text-[#1D293D] truncate">{profile?.teamLeaderName || "Team Leader Name"}</div>
                    <div className="text-[12px] font-normal leading-[16px] text-[#45556C] mt-1 truncate">Assigned Date: {profile?.assignedDate || "Assigned Date"}</div>
                  </>
                )}
              </div>

              {/* 6. Pink Commission Card: Mobile Order 6, Tablet Order 6, Desktop Order 3 */}
              <div className="flex justify-start w-auto order-6 sm:order-6 lg:order-3">
                <div 
                  className="flex flex-col justify-center items-start gap-2 rounded-[8px] border border-[#E2E8F0] px-3 py-[6px] min-w-[178.6px] w-fit"
                  style={{ 
                    maxWidth: "100%",
                    background: "linear-gradient(315deg, #FFCFEA 0.35%, #F8FAFC 99.65%)"
                  }}
                >
                  <span className="text-[12px] font-normal leading-[16px] text-[#45556C]">Total Commission</span>
                  <span className="text-[16px] font-semibold leading-[24px] text-[#1D293D]">{profile?.totalCommission || "XXXX.00"}</span>
                </div>
              </div>

            </div>
          </div>

          {/* 6 Metrics Grid - Fully responsive stacking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            <MetricCard title="Commission from Team" value={profile?.commissionFromTeam || ""} />
            <MetricCard title="Direct Commission" value={profile?.directCommission || ""} />
            <MetricCard title="Estimated Commission" value={profile?.estimatedCommission || ""} />
            <MetricCard title="Pending Commission" value={profile?.pendingCommission || ""} />
            <MetricCard title="Commission Withdraws" value={profile?.commissionWithdrawals || ""} />
            <MetricCard title="Pending Withdrawal" value={profile?.pendingWithdrawal || ""} />
          </div>

          {/* Tables Section - Reusing subcomponents */}
          <div className="flex flex-col w-full pt-2">
            {profile?.isTeamLeader && (
              <>
                <AgentTeamInfoTable />
                <div className="h-[1px] w-full bg-[#E2E8F0] my-4" />
              </>
            )}
            <AgentCourseEnrollmentsTable />
            <div className="h-[1px] w-full bg-[#E2E8F0] my-4" />
            
            <AgentBatchEnrollmentsTable />
            <div className="h-[1px] w-full bg-[#E2E8F0] my-4" />
            
            <AgentProductsTable />
          </div>

        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col justify-center border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(16,24,40,0.10)] rounded-[8px] p-[16px] w-full bg-white h-[76px]">
      <span className="text-[14px] font-normal leading-[20px] text-[#45556C] font-inter mb-1">{title}</span>
      <span className="text-[14px] font-medium leading-[20px] text-[#1D293D] font-inter">{value}</span>
    </div>
  );
}
