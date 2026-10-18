"use client";

import React from "react";
import { Bell, Search } from "lucide-react";

import MobileSidebar from "../sidebar/MobileSidebar";
import type { SidebarNavItem } from "@/data/sidebar";
import DynamicBreadcrumb from "../DynamicBreadcrumb";
import { Input } from "@/components/ui/input";

export interface NavbarProps {
  filteredSidebarData: SidebarNavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ filteredSidebarData }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200/80 bg-white px-6">
      {/* Left side: Breadcrumb & Mobile menu trigger */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <MobileSidebar filteredSidebarData={filteredSidebarData} />
        </div>
        <DynamicBreadcrumb sidebarData={filteredSidebarData} />
      </div>

      {/* Right side: Search bar & Notifications matching Image 2 */}
      <div className="flex items-center gap-3">
        {/* Search Input Pill */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search"
            className="h-9 w-60 rounded-full border-neutral-200/90 bg-neutral-50/70 pl-9 pr-4 text-xs text-neutral-800 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:bg-white transition-all shadow-none"
          />
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200/90 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-xs"
        >
          <Bell className="h-4 w-4" />
          {/* Red indicator dot on top right */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
