"use client";

import { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

import { LogOut, CircleUser, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface MobileSidebarProps {
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

export default function MobileSidebar({ filteredSidebarData }: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();

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

  const handleLinkClick = () => setIsOpen(false);

  const handleLogout = async () => {
    setIsOpen(false);
    
    // Clear session storage
    clearAuthData();
    
    await logout();
    router.push("/sign-in");
  };

  const isLinkActive = (url?: string) => {
    if (!url) return false;
    
    return pathname.startsWith(url);
  };

  const handleProfileClick = () => {
    setIsOpen(false);

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
                    className="group-data-[state=open]:bg-gray-100 dark:group-data-[state=open]:bg-gray-800 transition-transform duration-300 hover:translate-x-1"
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
                                onClick={handleLinkClick}
                                className="block"
                              >
                                <SidebarMenuButton
                                  level="sub"
                                  active={false}
                                  count={child.count}
                                  className="transition-transform duration-300 hover:translate-x-1"
                                >
                                  {child.title}
                                </SidebarMenuButton>
                              </a>
                            ) : (
                              <Link href={child.url!} onClick={handleLinkClick} prefetch={false}>
                                <SidebarMenuButton
                                  level="sub"
                                  active={isLinkActive(child.url)}
                                  count={child.count}
                                  className="transition-transform duration-300 hover:translate-x-1"
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
                  onClick={handleLinkClick}
                  className="block"
                >
                  <SidebarMenuButton
                    level="main"
                    icon={item.icon}
                    active={false}
                    className="transition-transform duration-300 hover:translate-x-1"
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
              <Link href={item.url!} onClick={handleLinkClick} prefetch={false}>
                <SidebarMenuButton
                  level="main"
                  icon={item.icon}
                  active={isLinkActive(item.url)}
                  count={item.count}
                  className="transition-transform duration-300 hover:translate-x-1"
                >
                  {item.title}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </motion.div>
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 lg-hidden">
          <i className="mobsidebar-icon h-5 w-5 shrink-0 text-[#0F172B]" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        showCloseButton={false}
        overlayClassName="bg-[rgba(0,0,0,0.10)]"
        className="flex w-[280px] flex-col p-0 bg-white dark:bg-slate-950 z-50 h-full data-[state=open]:duration-300 rounded-r-[16px] border-r border-[#E2E8F0] shadow-[2px_0_12px_8px_rgba(202,213,226,0.15)] overflow-hidden"
      >
        <SheetHeader className="px-6 py-[11px] border-b border-[#E2E8F0] min-h-[62px]">
          <div className="flex w-full items-center justify-between">
            <SheetTitle asChild>
              <Link href={getDashboardLink()} onClick={handleLinkClick} className="flex-shrink-0">
                <Image 
                  src="/mobile-logo.svg" 
                  alt="Binzo" 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
              </Link>
            </SheetTitle>
            <button 
              onClick={() => setIsOpen(false)}
              className="flex h-5 w-5 shrink-0 items-center justify-center text-[#0F172B]"
            >
              <i className="square-close-icon h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1">
          <SidebarMenu className="px-6 py-4 overflow-hidden">
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  key="mobile-menu-container"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="flex flex-col gap-1"
                >
                  {filteredSidebarData.map(renderNavItem)}
                </motion.div>
              )}
            </AnimatePresence>
          </SidebarMenu>
        </ScrollArea>
        <div className="mt-auto border-t border-[#E2E8F0] bg-white p-4 flex flex-col gap-[6px] shadow-[0_-1px_2px_0_rgba(16,24,40,0.05)]">
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
      </SheetContent>
    </Sheet>
  );
}