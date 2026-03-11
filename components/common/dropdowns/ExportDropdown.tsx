"use client";

import React from "react";

import type { LucideIcon } from "lucide-react";
import { ChevronDown, Download } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

export interface ExportItem {
  key: string;
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

interface ExportDropdownProps {
  items: ExportItem[];
  className?: string;
  label?: string;
}

export function ExportDropdown({
  items,
  className,
  label = "Export",
}: ExportDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            BUTTON_STYLES.outline.md,
            "whitespace-nowrap",
            buttonTextStyles,
            className
          )}
        >
          <Download className="h-4 w-4" />
          {label}
          <ChevronDown className="h-4 w-4 text-[#45556C]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.key}
              onClick={item.onClick}
              className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]"
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
