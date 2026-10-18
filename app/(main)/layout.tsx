import { redirect } from "next/navigation";

import { MainLayoutClient } from "@/components/layout/MainLayoutClient";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { getSession } from "@/lib/authentication";
import { adminSidebarData } from "@/data/sidebar-admin";
import { hrSidebarData } from "@/data/sidebar-hr";
import { supervisorSidebarData } from "@/data/sidebar-supervisor";
import { employeeSidebarData } from "@/data/sidebar-employee";
import type { SidebarNavItem } from "@/data/sidebar";
import type { UserRole } from "@/types/roles";

function getSidebarDataForRole(role: UserRole): SidebarNavItem[] {
  switch (role) {
    case "ADMIN":
      return adminSidebarData;
    case "HR":
      return hrSidebarData;
    case "SUPERVISOR":
      return supervisorSidebarData;
    case "EMPLOYEE":
      return employeeSidebarData;
    default:
      return employeeSidebarData;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  // If no session, redirect to sign-in
  if (!session) {
    redirect("/sign-in");
  }

  const role = session.user.role as UserRole;
  const sidebarData = getSidebarDataForRole(role);

  return (
    <SessionProvider session={session} notifications={[]}>
      <MainLayoutClient initialSidebarData={sidebarData} role={role}>
        {children}
      </MainLayoutClient>
    </SessionProvider>
  );
}
