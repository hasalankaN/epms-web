"use client";

import React from "react";

import { AgentListItem } from "./AgentListItem";

interface Agent {
  id: string;
  name: string;
  avatarUrl?: string;
  students: number;
  products: number;
  price: string;
}

interface AgentListCardProps {
  title: string;
  chipLabel?: string;
  agents: Agent[];
}

export function AgentListCard({
  title,
  chipLabel = "Last 7 Days",
  agents,
}: AgentListCardProps) {
  return (
    <div className="flex flex-1 flex-col items-start gap-3 rounded-lg border border-[#E2E8F0] p-4 shadow-sm">
      {/* Header: Title + Chip */}
      <div className="flex w-full items-center justify-between">
        <span className="font-sans text-[16px] font-semibold leading-6 text-[#0F172B]">
          {title}
        </span>
        <div className="flex items-center justify-center gap-1 rounded-[40px] bg-[#F1F5F9] px-3 py-1 shadow-sm">
          <span className="text-center font-sans text-[14px] font-medium leading-5 text-black">
            {chipLabel}
          </span>
        </div>
      </div>

      {/* Agent List */}
      <div className="flex w-full flex-col gap-4">
        {agents.map((agent, index) => (
          <AgentListItem
            key={agent.id}
            avatarUrl={agent.avatarUrl}
            name={agent.name}
            students={agent.students}
            products={agent.products}
            price={agent.price}
            isLast={index === agents.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
