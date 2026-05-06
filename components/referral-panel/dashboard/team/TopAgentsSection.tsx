"use client";

import React, { useState } from "react";

import Image from "next/image";

import { ChevronDown } from "lucide-react";

import { FilterChip } from "@/components/admin-panel/dashboard/overview/students-courses/shared/FilterChip";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

const filterOptions = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "Last 180 days", value: "180" },
];

const agents = [
  { id: 1, name: "Referral Agent Name", students: 22, products: 10, amount: "47,230", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
  { id: 2, name: "Referral Agent Name", students: 22, products: 10, amount: "47,230", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop" },
  { id: 3, name: "Referral Agent Name", students: 22, products: 10, amount: "47,230", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
  { id: 4, name: "Referral Agent Name", students: 22, products: 10, amount: "47,230", image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=80&h=80&fit=crop" },
  { id: 5, name: "Referral Agent Name", students: 22, products: 10, amount: "47,230", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
];

const AgentCard = ({ agent }: { agent: typeof agents[0] }) => (
  <div className="flex flex-1 flex-col items-center gap-3 rounded-lg border border-[#F1F5F9] bg-white p-[8px_8px_16px_8px] transition-all hover:shadow-md">
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-20 w-20 overflow-hidden rounded-full">
        <Image 
          src={agent.image} 
          alt={agent.name} 
          fill 
          className="object-cover"
        />
      </div>
      <span className="text-center font-sans text-[14px] font-medium leading-[20px] text-[#1D293D]">
        {agent.name}
      </span>
    </div>

    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="font-sans text-[12px] font-normal text-[#45556C]">
          {agent.students} Students
        </span>
        <div className="h-3 w-[1px] bg-[#E2E8F0]" />
        <span className="font-sans text-[12px] font-normal text-[#45556C]">
          {agent.products} Products
        </span>
      </div>
      
      <span className="font-sans text-[14px] font-semibold leading-[20px] text-[#1D293D]">
        LKR {agent.amount}
      </span>

      <Button variant="outline" className="h-8 min-w-[80px] rounded-md border-[#E2E8F0] px-3 font-sans text-[14px] font-semibold text-[#0F172B] hover:bg-slate-50">
        View
      </Button>
    </div>
  </div>
);

export function TopAgentsSection() {
  const [selectedFilter, setSelectedFilter] = useState("7");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedLabel = filterOptions.find(opt => opt.value === selectedFilter)?.label || "Last 7 days";

  return (
    <div className="flex w-full flex-col gap-10 px-6 pb-6 pt-8">
      <div className="flex items-center gap-6">
        <h3 className="font-sans text-[16px] font-medium leading-[24px] text-[#0F172B]">
          Top Agents
        </h3>
        
        {/* Mobile/Tablet Dropdown */}
        <div className="relative lg:hidden">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center gap-2 rounded-[42px] border-[0.5px] border-[#F6339A] bg-gradient-to-bl from-[#F8FAFC] to-[#FFCFEA] px-3 py-2 font-sans text-[12px] font-medium leading-[16px] text-[#F6339A] shadow-[4px_4px_10px_0_rgba(2,17,36,0.05)]"
          >
            {selectedLabel}
            <ChevronDown 
              className={cn(
                "h-3 w-3 stroke-[#F6339A] stroke-2 transition-transform",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-[140px] rounded-[8px] border border-[#E2E8F0] bg-white py-1 shadow-lg">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedFilter(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left font-sans text-[12px] font-medium leading-[16px] transition-colors hover:bg-[#FDF2F8]",
                    selectedFilter === option.value
                      ? "bg-[#FDF2F8] text-[#F6339A]"
                      : "text-[#45556C]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Chips */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          {filterOptions.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              selected={selectedFilter === option.value}
              onClick={() => setSelectedFilter(option.value)}
              className="w-auto min-w-[90px] px-3"
            />
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
