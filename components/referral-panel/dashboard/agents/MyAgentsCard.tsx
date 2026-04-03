import React from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";



interface Agent {
  id: string;
  name: string;
  avatarUrl?: string;
  students: number;
  products: number;
  price: string;
}

const mockAgents: Agent[] = [
  { id: "1", name: "Referral Agent Name", students: 22, products: 10, price: "LKR 47,230.00" },
  { id: "2", name: "Referral Agent Name", students: 22, products: 10, price: "LKR 47,230.00" },
  { id: "3", name: "Referral Agent Name", students: 22, products: 10, price: "LKR 47,230.00" },
  { id: "4", name: "Referral Agent Name", students: 22, products: 10, price: "LKR 47,230.00" },
  { id: "5", name: "Referral Agent Name", students: 22, products: 10, price: "LKR 47,230.00" },
];

function AgentListItem({ name, students, products, price, avatarUrl, isLast }: Agent & { isLast: boolean }) {
  return (
    <div
      className={`flex flex-col items-start gap-3 self-stretch px-2 pb-4 pt-2 ${
        !isLast ? "border-b border-[#E2E8F0]" : ""
      }`}
    >
      {/* Avatar and Name */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-400 to-purple-500">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-white">
              {name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>
        <span className="break-words font-sans text-[14px] font-medium leading-5 text-[#1D293D]">
          {name}
        </span>
      </div>

      {/* Stats and Price Row */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[12px] font-normal leading-4 text-[#45556C]">
            {students} Students
          </span>
          {/* Vertical Separator */}
          <div className="h-3 w-px bg-[#E2E8F0]" />
          <span className="font-sans text-[12px] font-normal leading-4 text-[#45556C]">
            {products} Products
          </span>
        </div>
        <span className="font-sans text-[14px] font-semibold leading-5 text-[#1D293D]">
          {price}
        </span>
      </div>
    </div>
  );
}

interface MyAgentsCardProps {
  className?: string;
}

export function MyAgentsCard({ className }: MyAgentsCardProps) {
  return (
    <div className={cn("flex w-full flex-col gap-6 rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm", className)}>
      <h2 className="font-sans text-xl font-semibold leading-[32px] text-[#1D293D]">
        My Agents
      </h2>

      {/* Number of Agents Box */}
      <div className="flex flex-col items-start gap-2 rounded-lg border border-[#E2E8F0] p-3">
        <span className="font-sans text-sm font-normal leading-5 text-[#45556C]">
          Number of Agents
        </span>
        <span className="font-sans text-[24px] font-semibold leading-[38px] text-[#1D293D]">
          XX
        </span>
      </div>

      {/* Top Agents Section */}
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <span className="font-sans text-[16px] font-semibold leading-6 text-[#0F172B]">
            Top Agents
          </span>
          <div className="flex items-center justify-center gap-1 rounded-[40px] bg-[#F1F5F9] px-3 py-1 shadow-sm">
            <span className="text-center font-sans text-[14px] font-medium leading-5 text-black">
              Last 7 Days
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          {mockAgents.map((agent, index) => (
            <AgentListItem 
              key={index} 
              {...agent} 
              isLast={index === mockAgents.length - 1} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
