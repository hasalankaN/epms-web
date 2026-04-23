"use client";

import React, { useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderSummary } from "@/hooks/api/orders/useGetOrderSummary";

interface OrderStatCardProps {
  title: string;
  value: string | number;
  isActive: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

function OrderStatCard({ title, value, isActive, onClick, isLoading }: OrderStatCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex w-full flex-col items-center justify-center gap-[3px] rounded-[0.375rem] border-2 px-[14px] py-[14px] transition-all duration-300",
        isActive
          ? "border-[#F6339A] shadow-sm"
          : "border-[#E2E8F0] bg-white hover:border-[#F6339A]/30 hover:bg-[#F8FAFC]"
      )}
    >
      {/* Sliding Selection Highlight */}
      {isActive && (
        <motion.div
          layoutId="active-order-stat-bg"
          className="absolute inset-0 z-0 rounded-[0.375rem] bg-[linear-gradient(315deg,#FFCFEA_0.35%,#F8FAFC_99.65%)]"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 35,
          }}
        />
      )}

      {/* Title */}
      <span
        className={cn(
          "relative z-10 text-center text-[13px] font-medium leading-[18px] transition-colors duration-300",
          isActive ? "text-[#F6339A]" : "text-[#475569]"
        )}
      >
        {title}
      </span>

      {/* Value */}
      <div className="relative z-10 w-full flex justify-center">
        {isLoading ? (
          <Skeleton className="h-[30px] w-12 rounded-md" />
        ) : (
          <span
            className={cn(
              "text-center text-[18px] font-bold leading-[26px] transition-colors duration-300",
              isActive ? "text-[#F6339A]" : "text-[#0F172B]"
            )}
          >
            {typeof value === "number" ? value.toString().padStart(2, "0") : value}
          </span>
        )}
      </div>
    </button>
  );
}

export function OrderStatsRow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data, isLoading } = useGetOrderSummary();

  const currentStatus = searchParams.get("status");
  const currentSource = searchParams.get("source");

  const handleCardClick = useCallback(
    (type: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("status");
      params.delete("source");
      params.set("page", "1");

      if (type === "status" && value) {
        params.set("status", value);
      } else if (type === "source" && value) {
        params.set("source", value);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const statsData = useMemo(
    () => [
      {
        title: "All Orders",
        value: data?.all ?? 0,
        isActive: !currentStatus && !currentSource,
        onClick: () => handleCardClick("all"),
      },
      {
        title: "Pending",
        value: data?.pending ?? 0,
        isActive: currentStatus === "PENDING",
        onClick: () => handleCardClick("status", "PENDING"),
      },
      {
        title: "Processing",
        value: data?.processing ?? 0,
        isActive: currentStatus === "PROCESSING",
        onClick: () => handleCardClick("status", "PROCESSING"),
      },
      {
        title: "Completed",
        value: data?.completed ?? 0,
        isActive: currentStatus === "COMPLETED",
        onClick: () => handleCardClick("status", "COMPLETED"),
      },
      {
        title: "Dispatched",
        value: data?.dispatched ?? 0,
        isActive: currentStatus === "DISPATCHED",
        onClick: () => handleCardClick("status", "DISPATCHED"),
      },
      {
        title: "Refunded",
        value: data?.refunded ?? 0,
        isActive: currentStatus === "REFUNDED",
        onClick: () => handleCardClick("status", "REFUNDED"),
      },
      {
        title: "Direct Orders",
        value: data?.direct ?? 0,
        isActive: currentSource === "DIRECT",
        onClick: () => handleCardClick("source", "DIRECT"),
      },
      {
        title: "Referral Orders",
        value: data?.referral ?? 0,
        isActive: currentSource === "REFERRAL",
        onClick: () => handleCardClick("source", "REFERRAL"),
      },
    ],
    [data, currentStatus, currentSource, handleCardClick]
  );

  return (
    <div className="flex w-full flex-wrap items-stretch gap-2.5">
      {statsData.map((stat) => (
        <div key={stat.title} className="flex-1 min-w-[140px] md:min-w-[160px]">
          <OrderStatCard
            title={stat.title}
            value={stat.value}
            isActive={stat.isActive}
            onClick={stat.onClick}
            isLoading={isLoading}
          />
        </div>
      ))}
    </div>
  );
}
