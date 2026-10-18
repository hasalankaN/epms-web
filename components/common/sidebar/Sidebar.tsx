"use client";

import React from "react";
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
} from "lucide-react";

import Logo from "../Logo";
import { logout } from "@/lib/authentication";
import type { SidebarNavItem } from "@/data/sidebar";
import { clearAuthData } from "@/hooks/api/auth/useAuth";
import { useSession } from "@/components/providers/SessionProvider";
import { ROLE_PANEL_MAP, type UserRole } from "@/types/roles";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SidebarProps {
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

export default function Sidebar({ filteredSidebarData }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  const handleLogout = async () => {
    clearAuthData();
    await logout();
    router.push("/sign-in");
  };

  const isLinkActive = (url?: string) => {
    if (!url) return false;
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  const getDashboardLink = () => {
    const role = session?.user?.role as UserRole;
    return ROLE_PANEL_MAP[role] ? `${ROLE_PANEL_MAP[role]}/dashboard` : "/admin-panel/dashboard";
  };

  // Extract initials
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
    <aside className="hidden w-64 shrink-0 border-r border-neutral-200/80 bg-white lg:flex lg:flex-col select-none">
      <div className="flex h-full max-h-screen flex-col">
        {/* Top Header Logo */}
        <div className="flex h-16 items-center px-6 border-b border-neutral-200/80 bg-white">
          <Link href={getDashboardLink()} className="flex items-center gap-2">
            <Logo disableLink />
          </Link>
        </div>

        {/* Scrollable Navigation */}
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

                  {/* Notification count badge */}
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

        {/* Bottom User Profile Card matching Image 2 */}
        <div className="p-3 mt-auto">
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
              title="Sign out"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors shrink-0 ml-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
