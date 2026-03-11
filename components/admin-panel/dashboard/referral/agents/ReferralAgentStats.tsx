"use client";

import React from "react";

import { AgentListCard } from "./AgentListCard";

// Dummy data for agents
const dummyAgents = [
  { id: "1", name: "Referal Agent Name", students: 22, products: 10, price: "LKR 47,230" },
  { id: "2", name: "Referal Agent Name", students: 22, products: 10, price: "LKR 47,230" },
  { id: "3", name: "Referal Agent Name", students: 22, products: 10, price: "LKR 47,230" },
  { id: "4", name: "Referal Agent Name", students: 22, products: 10, price: "LKR 47,230" },
  { id: "5", name: "Referal Agent Name", students: 22, products: 10, price: "LKR 47,230" },
];

export function ReferralAgentStats() {
  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      <AgentListCard title="Top Agents" agents={dummyAgents} />
      <AgentListCard title="Recent Agents" agents={dummyAgents} />
    </div>
  );
}
