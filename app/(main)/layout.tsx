import { redirect } from "next/navigation";

import { MainLayoutClient } from "@/components/layout/MainLayoutClient";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { getSession } from "@/lib/authentication";
import { adminSidebarData } from "@/data/sidebar-admin";
import { lecturerSidebarData } from "@/data/sidebar-lecturer";
import { referralSidebarData } from "@/data/sidebar-referral";
import type { SidebarNavItem } from "@/data/sidebar";

function getSidebarDataForRole(role: string): SidebarNavItem[] {
  switch (role) {
    case "LECTURER":
      return lecturerSidebarData;
    case "REFERRAL":
    case "REFERRAL_AGENT":
      return referralSidebarData;
    default:
      return adminSidebarData;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  // Middleware handles auth redirects for panel routes,
  // but if somehow there's no session, redirect to sign-in as a fallback.
  if (!session) {
    redirect("/sign-in");
  }

  // Determine the correct sidebar based on user role
  const sidebarData = getSidebarDataForRole(session.user.role);

  // Filter sidebar by user privileges
  const filteredSidebarData = sidebarData.filter((item) => {
    // Non-admin roles don't use granular privilege filtering on their custom sidebars
    if (session.user.role !== "ADMIN") return true;

    if (!item.value) return true;

    return (
      session.user.privileges?.includes("all") ||
      session.user.privileges?.includes(item.value) ||
      item.value === "administrators"
    );
  });

  return (
    <SessionProvider session={session} notifications={[]}>
      <MainLayoutClient initialSidebarData={filteredSidebarData} role={session.user.role}>
        {children}
      </MainLayoutClient>
    </SessionProvider>
  );
}
