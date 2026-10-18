"use client";

import Navbar from "@/components/common/navbar/Navbar";
import Sidebar from "@/components/common/sidebar/Sidebar";
import type { SidebarNavItem } from "@/data/sidebar";

interface MainLayoutClientProps {
  children: React.ReactNode;
  initialSidebarData: SidebarNavItem[];
  role: string;
}

export function MainLayoutClient({ children, initialSidebarData }: MainLayoutClientProps) {
  return (
    <div className="fixed inset-0 flex w-full overflow-hidden bg-[#fbfbfb]">
      <Sidebar filteredSidebarData={initialSidebarData} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar filteredSidebarData={initialSidebarData} />

        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto bg-[#fbfbfb]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
