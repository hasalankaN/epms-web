"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { SidebarNavItem } from "@/data/sidebar";

const PANEL_NAME_MAP: Record<string, string> = {
  "employee-panel": "Employee",
  "admin-panel": "Admin",
  "hr-panel": "HR",
  "supervisor-panel": "Supervisor",
};

const formatBreadcrumbSegment = (segment: string): string => {
  if (PANEL_NAME_MAP[segment]) {
    return PANEL_NAME_MAP[segment];
  }
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function DynamicBreadcrumb({
  sidebarData,
}: {
  sidebarData: SidebarNavItem[];
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // Extract panel prefix name e.g. "Employee"
  const panelSegment = pathSegments[0];
  const roleName = PANEL_NAME_MAP[panelSegment] || "Employee";

  // Find matching nav title
  const currentItem = sidebarData.find((item) => item.url === pathname);
  const pageTitle = currentItem?.title || formatBreadcrumbSegment(pathSegments[pathSegments.length - 1] || "Dashboard");

  return (
    <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-normal select-none">
      <span className="hover:text-neutral-700 transition-colors">
        {roleName}
      </span>
      <ChevronRight className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5]" />
      <span className="text-neutral-800 font-medium">
        {pageTitle}
      </span>
    </nav>
  );
}
