"use client";

import React from "react";


import Image from "next/image";

import MobileSidebar from "../sidebar/MobileSidebar";
import type { SidebarNavItem } from "@/data/sidebar";
import DynamicBreadcrumb from "../DynamicBreadcrumb";


export interface NavbarProps {
  filteredSidebarData: SidebarNavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ filteredSidebarData }) => {

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

      <div className="flex items-center gap-4">
        {/* Chat Button */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-md bg-[#F1F5F9] shadow-sm transition-colors hover:bg-slate-200">
          <i className="message-icon h-5 w-5 shrink-0 text-[#0F172B]" />
          <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-[16px] max-w-[34px] items-center justify-center rounded-full bg-[#FB2C36] px-1 text-[11px] font-medium leading-4 tracking-[0.5px] text-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
            3
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
