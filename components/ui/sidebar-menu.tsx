import * as React from "react";

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { SIDEBAR_NAV } from "@/lib/constants/theme";

const SidebarMenu = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cn("grid items-start gap-1", className)} {...props} />
  )
);

SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);

SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuSub = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative grid pl-8 pt-1 gap-1",
        "before:absolute before:left-4 before:top-0 before:h-full before:w-px before:bg-gray-200 dark:before:bg-gray-800",
        className
      )}
      {...props}
    />
  )
);

SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuHeader = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "px-2 pt-4 pb-2 text-xs font-medium leading-4 tracking-tight text-zinc-700 opacity-70 dark:text-zinc-400",
        className
      )}
      {...props}
    />
  )
);

SidebarMenuHeader.displayName = "SidebarMenuHeader";

interface SidebarButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  count?: number;
  hasSubMenu?: boolean;
  active?: boolean;
  disabled?: boolean;
  level?: "main" | "sub";
}

const SidebarMenuButton = React.forwardRef<HTMLDivElement, SidebarButtonProps>(
  ({ className, icon, children, active, disabled, count, hasSubMenu, level, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        SIDEBAR_NAV.base,
        disabled
          ? SIDEBAR_NAV.disabled
          : active
          ? SIDEBAR_NAV.active
          : level === "sub"
          ? SIDEBAR_NAV.subDefault
          : SIDEBAR_NAV.default,
        className
      )}
      {...props}
    >
      <div className="flex flex-[1_0_0] items-center gap-2 overflow-hidden">
        {icon && <i className={cn(SIDEBAR_NAV.icon, icon)} />}
        <span
          className={cn(
            SIDEBAR_NAV.text,
            level === "sub" && !active ? "font-normal" : "font-medium"
          )}
        >
          {children}
        </span>
      </div>

      {count !== undefined && (
        <span className={active ? SIDEBAR_NAV.badge.active : SIDEBAR_NAV.badge.default}>
          {count}
        </span>
      )}

      {/* Only show chevron if it's a main level item AND has a submenu */}
      {level === "main" && hasSubMenu && (
        <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
      )}
    </div>
  )
);

SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuHeader,
};