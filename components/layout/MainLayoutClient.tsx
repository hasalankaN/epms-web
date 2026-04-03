"use client";

import { useMemo } from "react";

import Navbar from "@/components/common/navbar/Navbar";
import LecturerNavbar from "@/components/common/navbar/LecturerNavbar";
import ReferralNavbar from "@/components/common/navbar/ReferralNavbar";
import Sidebar from "@/components/common/sidebar/Sidebar";
import type { SidebarNavItem } from "@/data/sidebar";


// import { useGetCounts } from "@/hooks/api/counts/useGetCounts"

interface MainLayoutClientProps {
  children: React.ReactNode;
  initialSidebarData: SidebarNavItem[];
  role: string;
}

function getNavbarForRole(
  role: string,
  filteredSidebarData: SidebarNavItem[]
) {
  switch (role) {
    case "LECTURER":
      return <LecturerNavbar filteredSidebarData={filteredSidebarData} />;
    case "REFERRAL":
    case "REFERRAL_AGENT":
      return <ReferralNavbar filteredSidebarData={filteredSidebarData} />;
    default:
      return <Navbar filteredSidebarData={filteredSidebarData} />;
  }
}

export function MainLayoutClient({ children, initialSidebarData, role }: MainLayoutClientProps) {
  // const { data: counts } = useGetCounts();
  const counts = undefined;

  // Update sidebar data with real counts from the hook
  const updatedSidebarData = useMemo(() => {
    if (!counts) return initialSidebarData;

    return initialSidebarData.map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.map((child) => {
            if (child.value === "inventory.products") {
              // return { ...child, count: counts.totalProducts };
              return child;
            }

            if (child.value === "inventory.category") {
              // return { ...child, count: counts.totalCategories };
              return child;
            }

            return child;
          }),
        };
      }

      return item;
    });
  }, [initialSidebarData, counts]);

  return (
    <div className="fixed inset-0 flex w-full overflow-hidden bg-background">
      <Sidebar filteredSidebarData={updatedSidebarData} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {getNavbarForRole(role, updatedSidebarData)}

        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
