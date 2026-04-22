"use client";

import React from "react";

import type { LucideIcon } from "lucide-react";
import { ChevronDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

export interface BulkActionItem {
  key: string;
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "danger";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

interface BulkActionDropdownProps {
  items: BulkActionItem[];
  className?: string;
  iconOnly?: boolean;
  triggerIcon?: LucideIcon;
  label?: string;
}

export function BulkActionDropdown({
  items,
  className,
  iconOnly = false,
  triggerIcon: TriggerIcon,
  label = "Bulk Action",
}: BulkActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            BUTTON_STYLES.outline.md,
            iconOnly ? "px-3" : "min-w-[120px] justify-between",
            buttonTextStyles,
            className
          )}
        >
          {iconOnly && TriggerIcon ? (
            <TriggerIcon className="h-4 w-4 text-[#0F172B]" />
          ) : (
            <>
              {label}
              <ChevronDown className="h-4 w-4 text-[#45556C]" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px]">
        {items.map((item) => {
          const Icon = item.icon;
          const isDisabled = item.disabled || item.isLoading;

          return (
            <DropdownMenuItem
              key={item.key}
              onClick={isDisabled ? undefined : item.onClick}
              disabled={isDisabled}
              className={cn(
                "cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]",
                item.variant === "danger" && "text-red-600 focus:text-red-600",
                isDisabled && "cursor-not-allowed opacity-50 hover:bg-transparent focus:bg-transparent"
              )}
            >
              {item.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#E60076]" />
              ) : (
                Icon && <Icon className="mr-2 h-4 w-4" />
              )}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

