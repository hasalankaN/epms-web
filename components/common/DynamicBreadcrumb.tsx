"use client";

import * as React from "react";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import type { SidebarNavItem } from "@/data/sidebar";

const formatBreadcrumbSegment = (segment: string): string => {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function DynamicBreadcrumb({ sidebarData }: { sidebarData: SidebarNavItem[] }) {
  const pathname = usePathname();
  
  const pathSegments = pathname.split("/").filter(Boolean);

  const findLinkWithParent = (url: string) => {
    // Check main items and their children
    for (const item of sidebarData) {
      if (item.type === "sub" && item.children) {
        for (const child of item.children) {
          if (child.url === url) {
            return { parentTitle: item.title, linkTitle: child.title };
          }
        }
      }
      
      if (item.type === "link" && item.url === url) {
        return { parentTitle: undefined, linkTitle: item.title };
      }
    }

    return undefined;
  };

  // Try to find an exact match for the current URL in the sidebar
  const exactMatch = findLinkWithParent(pathname);
  const IGNORED_LABELS = ["Admin Panel", "Lecturer Panel", "Referral Panel"];

  if (exactMatch) {
    const { parentTitle, linkTitle } = exactMatch;
    
    const labels = (parentTitle ? [parentTitle, linkTitle] : [linkTitle]).filter(
      (label) => label && !IGNORED_LABELS.includes(label)
    );

    // Remove "View" if it's the last item and there are other segments
    // BUT only if there are at least 3 segments (e.g. Course Management > View > View)
    // OR if it's a double view
    if (labels.length > 1) {
      const lastIsView = labels[labels.length - 1] === "View";
      const secondLastIsView = labels[labels.length - 2] === "View";

      if (lastIsView && (labels.length >= 3 || secondLastIsView)) {
        labels.pop();
      }
    }

    return (
      <Breadcrumb className="hidden lg:flex">
        <BreadcrumbList>
          {labels.map((label, index) => {
            const isLast = index === labels.length - 1;

            return (
              <React.Fragment key={`${index}-${label}`}>
                {index > 0 && <BreadcrumbSeparator />}

                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="text-sm font-normal text-gray-900">{label}</BreadcrumbPage>
                  ) : (
                    <span className="text-sm font-normal text-gray-500">{label}</span>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Fallback: Generate breadcrumbs from path segments
  const allSegments = pathSegments.map((segment, index) => {
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(segment);
    
    return {
      segment,
      href: "/" + pathSegments.slice(0, index + 1).join("/"),
      formatted: isUUID ? "View" : formatBreadcrumbSegment(segment)
    };
  });

  const displayedSegments = allSegments.filter(
    (item) => !IGNORED_LABELS.includes(item.formatted)
  );

  const filteredSegments = displayedSegments;

  // Remove "View" if it's the last item and there are other segments
  // BUT only if there are at least 3 segments (e.g. Course Management > View > View or Course Management > Edit > View)
  // OR if it's a double view
  if (filteredSegments.length > 1) {
    const lastIsView = filteredSegments[filteredSegments.length - 1].formatted === "View";
    const secondLastIsView = filteredSegments[filteredSegments.length - 2].formatted === "View";
    
    if (lastIsView && (filteredSegments.length >= 3 || secondLastIsView)) {
      filteredSegments.pop();
    }
  }

  return (
    <Breadcrumb className="hidden lg:flex">
      <BreadcrumbList>
        {displayedSegments.map((item, index) => {
          const isLast = index === displayedSegments.length - 1;
          
          return (
            <React.Fragment key={item.href}>
              {index > 0 && <BreadcrumbSeparator />}
              
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-sm font-normal text-gray-900">
                    {item.formatted}
                  </BreadcrumbPage>
                ) : (
                  <span className="text-sm font-normal text-gray-500">{item.formatted}</span>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
