"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { LogOut, CircleUser, ChevronsRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "../Logo";
import { logout } from "@/lib/authentication";
import type { SidebarNavItem } from "@/data/sidebar";
import { clearAuthData } from "@/hooks/api/auth/useAuth";
import { useSession } from "@/components/providers/SessionProvider";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuHeader,
} from "@/components/ui/sidebar-menu";

interface SidebarProps {
  filteredSidebarData: SidebarNavItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function Sidebar({ filteredSidebarData }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Clear session storage
    clearAuthData();
    
    await logout();
    router.push("/sign-in");
  };

  const isLinkActive = (url?: string) => {
    if (!url) return false;
    
    return pathname.startsWith(url);
  };

  const session = useSession();

  const handleProfileClick = () => {
    if (session?.user?.role === "LECTURER") {
      router.push("/lecturer-panel/profile");
    }
  };

  const renderNavItem = (item: SidebarNavItem) => {
    switch (item.type) {
      case "header":
        return (
          <motion.div variants={itemVariants} key={item.id} whileHover={{ x: 4 }}>
            <SidebarMenuHeader>{item.title}</SidebarMenuHeader>
          </motion.div>
        );

      case "sub":
        return (
          <motion.div variants={itemVariants} key={item.id} whileHover={{ x: 4 }}>
            <Collapsible
              defaultOpen={item.children?.some((child) => isLinkActive(child.url))}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger className="w-full group">
                  <SidebarMenuButton
                    level="main"
                    icon={item.icon}
                    hasSubMenu={true}
                    className="group-data-[state=open]:bg-gray-100 dark:group-data-[state=open]:bg-gray-800"
                  >
                    {item.title}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="flex flex-col gap-1"
                    >
                      {item.children?.map((child) => (
                        <motion.div variants={itemVariants} key={child.id} whileHover={{ x: 4 }}>
                          <SidebarMenuItem>
                            {child.external ? (
                              <a
                                href={child.url!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <SidebarMenuButton
                                  level="sub"
                                  active={false}
                                  count={child.count}
                                >
                                  {child.title}
                                </SidebarMenuButton>
                              </a>
                            ) : (
                              <Link href={child.url!} prefetch={false}>
                                <SidebarMenuButton
                                  level="sub"
                                  active={isLinkActive(child.url)}
                                  count={child.count}
                                >
                                  {child.title}
                                </SidebarMenuButton>
                              </Link>
                            )}
                          </SidebarMenuItem>
                        </motion.div>
                      ))}
                    </motion.div>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </motion.div>
        );

      case "link":
      default:
        if (item.external) {
          return (
            <motion.div variants={itemVariants} key={item.id} whileHover={{ x: 4 }}>
              <SidebarMenuItem>
                <a
                  href={item.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <SidebarMenuButton
                    level="main"
                    icon={item.icon}
                    active={false}
                  >
                    {item.title}
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
            </motion.div>
          );
        }
        
        return (
          <motion.div variants={itemVariants} key={item.id} whileHover={{ x: 4 }}>
            <SidebarMenuItem>
              <Link href={item.url!} prefetch={false}>
                  <SidebarMenuButton
                    level="main"
                    icon={item.icon}
                    active={isLinkActive(item.url)}
                  >
                  {item.title}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </motion.div>
        );
    }
  };



  const getDashboardLink = () => {
    switch (session?.user?.role) {
      case "LECTURER":
        return "/lecturer-panel/dashboard";
      case "REFERRAL":
        return "/referral-panel/dashboard";
      default:
        return "/admin-panel/dashboard";
    }
  };

  return (
    <div className="hidden w-64 shrink-0 border-r bg-white dark:bg-slate-950 lg:block">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center border-b border-slate-200 bg-white px-6 py-[11px] shadow-[0_4px_12px_8px_rgba(0,0,0,0.05)] dark:bg-slate-950">
          <div className="w-full">
            <Link href={getDashboardLink()} className="flex items-center gap-2 font-semibold">
              <Logo disableLink />
            </Link>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <SidebarMenu className="px-4 py-4 overflow-hidden">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-1"
            >
              {filteredSidebarData.map(renderNavItem)}
            </motion.div>
          </SidebarMenu>
        </ScrollArea>
        <div className="mt-auto border-t border-[#E2E8F0] bg-white p-4 flex flex-col gap-[6px] shadow-[0_-1px_2px_0_rgba(16,24,40,0.05)]">
          {/* Notification Item */}
          <div className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 h-8 hover:bg-[#FDF2F8] transition-colors cursor-pointer">
            <i className="notification-bell-icon h-4 w-4 shrink-0 text-[#0F172B]" />
            <span className="flex-1 truncate font-[Inter] text-sm font-medium leading-5 text-[#0F172B]">
              Notification
            </span>
            <span className="ml-auto text-sm font-medium text-[#64748B]">12</span>
          </div>

          {/* User Profile Item */}
          <div 
            onClick={handleProfileClick}
            className="flex w-[224px] items-center justify-between rounded-[6px] border border-[#E2E8F0] bg-[#F1F5F9] pt-[6px] pr-[7px] pb-[6px] pl-0 cursor-pointer hover:bg-[#F1F5F9]/80 transition-colors"
          >
            <div className="flex items-center gap-2 pl-1 overflow-hidden flex-1">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
                <CircleUser className="h-4 w-4 text-[#0F172B]" strokeWidth={1.5} />
              </div>
              <span className="flex-1 truncate font-[Inter] text-sm font-medium leading-5 text-[#0F172B]">
                {session?.user?.name || "Lecturer Profile"}
              </span>
            </div>
            <ChevronsRight className="h-4 w-4 text-[#94A3B8]" strokeWidth={1.5} />
          </div>

          {/* Logout Button */}
          <div className="pt-2"> 
            <Button variant="ghost" className="w-full justify-start gap-3 px-2 h-auto py-2 hover:bg-[#FDF2F8]" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-[#0F172B]" />
              <span className="flex-1 text-left truncate font-[Inter] text-sm font-medium leading-5 text-[#0F172B]">
                Log out
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
