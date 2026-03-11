import React from "react";

import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  showDoD?: boolean;
  className?: string;
  valueClassName?: string;
}

export function StatCard({
  title,
  value,
  trend,
  showDoD = true,
  className,
  valueClassName,
}: StatCardProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-4 py-6", className)}>
      {/* Title */}
      <h3 className="mb-1 text-center font-sans text-[14px] font-normal leading-[20px] text-[#1E293B]">
        {title}
      </h3>

      {/* Value */}
      <div className={cn("mb-2 text-center font-sans text-[18px] font-semibold leading-[30px] text-[#020618]", valueClassName)}>
        {value}
      </div>

      {/* Trend & DoD */}
      {(trend || showDoD) && (
        <div className="flex items-center gap-1">
          {trend && (
            <div className={cn(
              "flex items-center gap-0.5 text-[12px] font-medium leading-[16px]",
              trend.isPositive ? "text-[#16A34A]" : "text-red-500"
            )}>
              <span>{trend.isPositive ? "+" : ""}{trend.value}</span>
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
            </div>
          )}
          
          {showDoD && (
            <div className="flex items-center gap-1 text-[12px] font-normal leading-[16px] text-[#64748B]">
              <span>DoD</span>
              <HelpCircle className="relative -top-0.5 h-3 w-3" fill="#1E293B" stroke="white" /> 
            </div>
          )}
        </div>
      )}
    </div>
  );
}
