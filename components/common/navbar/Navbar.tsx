"use client";

import React, { useState } from "react";


import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams , useRouter } from "next/navigation";

import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

import MobileSidebar from "../sidebar/MobileSidebar";
import type { SidebarNavItem } from "@/data/sidebar";
import DynamicBreadcrumb from "../DynamicBreadcrumb";
import { FilterDropdown, type FilterCategory } from "../dropdowns/FilterDropdown";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";


export interface NavbarProps {
  filteredSidebarData: SidebarNavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ filteredSidebarData }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [branchSearch, setBranchSearch] = useState("");

  const isChatActive = pathname === "/admin-panel/chat";
  const currentTab = searchParams.get("tab");

  const { data: branchesData, isLoading: isBranchesLoading } = useGetBranches({ 
    size: 100, 
    status: "ACTIVE",
    search: branchSearch || undefined 
  });

  const branches = branchesData?.results || [];

  const selectedBranchId = searchParams.get("branch");
  const selectedBranchName = branches.find(b => b.id === selectedBranchId)?.name || null;

  const branchCategories: FilterCategory[] = [
    {
      key: "branches",
      label: "Branches",
      items: [
        { key: "all", label: "All Branches" },
        ...branches.map(b => ({ key: b.id, label: b.name }))
      ],
    },
  ];

  const handleBranchSelect = (_categoryKey: string, itemKey: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (itemKey === "all") {
      params.delete("branch");
    } else {
      params.set("branch", itemKey);
    }

    router.replace(`${pathname}?${params.toString()}`);
    setBranchSearch(""); // Reset search on select
  };
  
  // Mock counts for now
  const orderCount = 3;
  const taskCount = 5;
  const complaintCount = 1;
  const approvalCount = 2;

  const isApprovalsActive = pathname.startsWith("/admin-panel/approvals");
  const isComplaintsActive = pathname === "/admin-panel/complaint-management";
  const isTasksActive = pathname === "/admin-panel/task-management";

  const isOrdersActive = 
    pathname === "/admin-panel/product-management" && 
    (currentTab === "orders" || !currentTab);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 py-[11px] shadow-[0_4px_12px_8px_rgba(0,0,0,0.05)] md:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <MobileSidebar filteredSidebarData={filteredSidebarData} />
        </div>

        <DynamicBreadcrumb sidebarData={filteredSidebarData} />
      </div>

      {/* Mobile Center Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden">
        <Image 
          src="/mobile-logo.svg" 
          alt="Binzo" 
          width={40} 
          height={40} 
          className="rounded-full"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Global Branch Filter */}
        <FilterDropdown
          label="All Branches"
          value={selectedBranchName}
          categories={branchCategories}
          triggerIcon={MapPin}
          onFilterSelect={handleBranchSelect}
          isLoading={isBranchesLoading}
          responsive={true}
          searchValue={branchSearch}
          onSearchChange={setBranchSearch}
          searchPlaceholder="Search branch..."
          className="h-8"
        />

        {/* Navigation Shortcuts - Desktop Only */}
        <div className="hidden md:flex items-center gap-4">
          {/* Approvals Button */}
          <Link
            href="/admin-panel/approvals/bank-transfers"
            className={cn(
              "relative flex h-8 w-8 items-center justify-center rounded-md shadow-sm transition-colors",
              isApprovalsActive 
                ? "bg-[#0F172B] text-white hover:bg-[#0F172B]/90" 
                : "bg-[#F1F5F9] text-[#0F172B] hover:bg-slate-200"
            )}
            aria-label="Approvals"
          >
            <i className={cn(
              "stamp h-5 w-5 shrink-0",
              isApprovalsActive ? "brightness-0 invert" : "text-[#0F172B]"
            )} />
            {approvalCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-[16px] max-w-[34px] items-center justify-center rounded-full bg-[#FB2C36] px-1 text-[11px] font-medium leading-4 tracking-[0.5px] text-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {approvalCount}
              </span>
            )}
          </Link>

          {/* Complaints Button */}
          <Link
            href="/admin-panel/complaint-management?tab=pending-assignment"
            className={cn(
              "relative flex h-8 w-8 items-center justify-center rounded-md shadow-sm transition-colors",
              isComplaintsActive 
                ? "bg-[#0F172B] text-white hover:bg-[#0F172B]/90" 
                : "bg-[#F1F5F9] text-[#0F172B] hover:bg-slate-200"
            )}
            aria-label="Complaints"
          >
            <i className={cn(
              "warning-circle h-5 w-5 shrink-0",
              isComplaintsActive ? "brightness-0 invert" : "text-[#0F172B]"
            )} />
            {complaintCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-[16px] max-w-[34px] items-center justify-center rounded-full bg-[#FB2C36] px-1 text-[11px] font-medium leading-4 tracking-[0.5px] text-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {complaintCount}
              </span>
            )}
          </Link>

          {/* Tasks Button */}
          <Link
            href="/admin-panel/task-management"
            className={cn(
              "relative flex h-8 w-8 items-center justify-center rounded-md shadow-sm transition-colors",
              isTasksActive 
                ? "bg-[#0F172B] text-white hover:bg-[#0F172B]/90" 
                : "bg-[#F1F5F9] text-[#0F172B] hover:bg-slate-200"
            )}
            aria-label="Tasks"
          >
            <i className={cn(
              "list-checks h-5 w-5 shrink-0",
              isTasksActive ? "brightness-0 invert" : "text-[#0F172B]"
            )} />
            {taskCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-[16px] max-w-[34px] items-center justify-center rounded-full bg-[#FB2C36] px-1 text-[11px] font-medium leading-4 tracking-[0.5px] text-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {taskCount}
              </span>
            )}
          </Link>

          {/* Orders Button */}
          <Link
            href="/admin-panel/product-management?tab=orders"
            className={cn(
              "relative flex h-8 w-8 items-center justify-center rounded-md shadow-sm transition-colors",
              isOrdersActive 
                ? "bg-[#0F172B] text-white hover:bg-[#0F172B]/90" 
                : "bg-[#F1F5F9] text-[#0F172B] hover:bg-slate-200"
            )}
            aria-label="Orders"
          >
            <i className={cn(
              "package h-5 w-5 shrink-0",
              isOrdersActive ? "text-white" : "text-[#0F172B]"
            )} />
            {orderCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-[16px] max-w-[34px] items-center justify-center rounded-full bg-[#FB2C36] px-1 text-[11px] font-medium leading-4 tracking-[0.5px] text-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {orderCount}
              </span>
            )}
          </Link>
        </div>

        {/* Chat Button - Always Visible */}
        <Link
          href="/admin-panel/chat"
          className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-md shadow-sm transition-colors",
            isChatActive 
              ? "bg-[#0F172B] text-white hover:bg-[#0F172B]/90" 
              : "bg-[#F1F5F9] text-[#0F172B] hover:bg-slate-200"
          )}
          aria-label="Chat"
        >
          <i className={cn(
            "message-icon h-5 w-5 shrink-0",
            isChatActive ? "brightness-0 invert" : "text-[#0F172B]"
          )} />
          <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-[16px] max-w-[34px] items-center justify-center rounded-full bg-[#FB2C36] px-1 text-[11px] font-medium leading-4 tracking-[0.5px] text-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
            3
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
