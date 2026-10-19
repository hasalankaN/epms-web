"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  User,
  Clock,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  DollarSign,
  Star,
  Briefcase,
  Building2,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import Logo from "../Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { logout } from "@/lib/authentication";
import type { SidebarNavItem } from "@/data/sidebar";
import { clearAuthData } from "@/hooks/api/auth/useAuth";
import { useSession } from "@/components/providers/SessionProvider";
import { ROLE_PANEL_MAP, type UserRole } from "@/types/roles";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  filteredSidebarData: SidebarNavItem[];
}

function getSidebarIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case "layoutdashboard":
    case "dashboard":
    case "dashboard-icon":
      return LayoutDashboard;
    case "user":
    case "profile":
    case "customers-icon":
    case "user-gear":
      return User;
    case "clock":
    case "attendance":
      return Clock;
    case "calendar":
    case "leaves":
    case "leave":
      return Calendar;
    case "clipboardcheck":
    case "tasks":
    case "list-checks":
      return ClipboardCheck;
    case "graduationcap":
    case "training":
    case "student":
      return GraduationCap;
    case "dollarsign":
    case "salary":
    case "invoice":
    case "payroll":
      return DollarSign;
    case "star":
    case "performance":
    case "self evaluation":
    case "reviews":
    case "chart-bar":
      return Star;
    case "briefcase":
    case "jobs":
    case "internal jobs":
    case "stamp":
      return Briefcase;
    case "building2":
    case "building":
    case "departments":
      return Building2;
    case "settings":
      return Settings;
    case "bell":
    case "notifications":
      return Bell;
    default:
      return LayoutDashboard;
  }
}

export default function MobileSidebar({ filteredSidebarData }: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();

  const getDashboardLink = () => {
    const role = session?.user?.role as UserRole;

    return ROLE_PANEL_MAP[role] ? `${ROLE_PANEL_MAP[role]}/dashboard` : "/admin-panel/dashboard";
  };

  const handleLinkClick = () => setIsOpen(false);

  const handleLogout = async () => {
    setIsOpen(false);
    clearAuthData();
    await logout();
    router.push("/sign-in");
  };

  const isLinkActive = (url?: string) => {
    if (!url) return false;

    return pathname === url || pathname.startsWith(`${url}/`);
  };

  const userName = session?.user?.name || "Kasun Perera";
  const userRole = session?.user?.role ? (session.user.role.charAt(0) + session.user.role.slice(1).toLowerCase()) : "Employee";

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "KP";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 lg:hidden h-9 w-9">
          <Menu className="h-5 w-5 text-neutral-800" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="flex w-[280px] flex-col p-0 bg-white z-50 h-full border-r border-neutral-200 shadow-xl overflow-hidden"
      >
        <SheetHeader className="px-6 py-4 border-b border-neutral-200 min-h-[64px] flex flex-row items-center justify-between">
          <SheetTitle asChild>
            <Link
              href={getDashboardLink()}
              onClick={handleLinkClick}
              className="flex items-center gap-2"
            >
              <Logo disableLink />
            </Link>
          </SheetTitle>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </SheetHeader>

        <ScrollArea className="flex-1 px-3 py-3">
          <nav className="flex flex-col space-y-0.5">
            {filteredSidebarData.map((item) => {
              if (item.type === "header") {
                return (
                  <div
                    key={item.id}
                    className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-3 pt-4 pb-1"
                  >
                    {item.title}
                  </div>
                );
              }

              const Icon = getSidebarIcon(item.icon);
              const active = isLinkActive(item.url);

              return (
                <Link
                  key={item.id}
                  href={item.url || "#"}
                  onClick={handleLinkClick}
                  prefetch={false}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    active
                      ? "bg-neutral-100 text-neutral-900 font-semibold"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50/90 font-normal"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active
                        ? "text-neutral-900"
                        : "text-neutral-500 group-hover:text-neutral-900"
                    )}
                  />
                  <span className="truncate">{item.title}</span>

                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-neutral-900 px-1.5 text-[10px] font-bold text-white">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Mobile bottom user card */}
        <div className="p-3 mt-auto border-t border-neutral-100 bg-neutral-50/40">
          <div className="flex items-center justify-between rounded-xl border border-neutral-200/90 bg-white p-2.5 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-neutral-900 leading-tight">
                  {userName}
                </p>
                <p className="truncate text-[11px] text-neutral-400 leading-tight mt-0.5">
                  {userRole}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors shrink-0 ml-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}