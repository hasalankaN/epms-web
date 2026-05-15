"use client";

import React from "react";

import type { AgentItem } from "@/hooks/api/dashboard/useGetDashboardReferral";
import { AgentListCard } from "./AgentListCard";

interface Props {
  topAgents?: AgentItem[];
  recentAgents?: AgentItem[];
}

export function ReferralAgentStats({ topAgents, recentAgents }: Props) {
  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      <AgentListCard title="Top Agents" agents={topAgents ?? []} />
      <AgentListCard title="Recent Agents" agents={recentAgents ?? []} />
    </div>
  );
}
