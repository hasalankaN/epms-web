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
  const IGNORED_LABELS = ["Lecturer Panel", "Referral Panel"];

  if (exactMatch) {
    const { parentTitle, linkTitle } = exactMatch;
    
    const labels = (parentTitle ? [parentTitle, linkTitle] : [linkTitle]).filter(
      (label) => label && !IGNORED_LABELS.includes(label)
    );

    return (
      <Breadcrumb className="hidden lg:flex">
        <BreadcrumbList>
          {labels.map((label, index) => {
            const isLast = index === labels.length - 1;

            return (
              <React.Fragment key={label}>
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
  const allSegments = pathSegments.map((segment, index) => ({
    segment,
    href: "/" + pathSegments.slice(0, index + 1).join("/"),
    formatted: formatBreadcrumbSegment(segment)
  }));

  const displayedSegments = allSegments.filter(
    (item) => !IGNORED_LABELS.includes(item.formatted)
  );

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
