"use client";

import React, { useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { format } from "date-fns";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEnquiryDashboard } from "@/hooks/api/enquiries/useGetEnquiryDashboard";

interface InquiryStatCardProps {
  title: string;
  value: string | number;
  isActive: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

function InquiryStatCard({ title, value, isActive, onClick, isLoading }: InquiryStatCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex w-full flex-col items-center justify-center gap-[4px] rounded-[0.375rem] border-2 px-[16px] py-[16px] transition-all duration-300",
        isActive
          ? "border-[#F6339A] shadow-sm"
          : "border-[#E2E8F0] bg-white hover:border-[#F6339A]/30 hover:bg-[#F8FAFC]"
      )}
    >
      {/* Sliding Selection Highlight */}
      {isActive && (
        <motion.div
          layoutId="active-inquiry-stat-bg"
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
          "relative z-10 text-center text-[14px] font-medium leading-[20px] transition-colors duration-300",
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
              "text-center text-[20px] font-bold leading-[30px] transition-colors duration-300",
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

export function AllInquiryStatsRow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data, isLoading } = useGetEnquiryDashboard();

  const todayStr = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const currentStatus = searchParams.get("status");
  const currentDateFrom = searchParams.get("date_from");
  const currentFollowUpFrom = searchParams.get("follow_up_from");

  const handleCardClick = useCallback(
    (type: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("status");
      params.delete("date_from");
      params.delete("date_to");
      params.delete("follow_up_from");
      params.delete("follow_up_to");
      params.set("page", "1");

      if (type === "today") {
        params.set("date_from", todayStr);
        params.set("date_to", todayStr);
      } else if (type === "follow_up") {
        params.set("follow_up_from", todayStr);
        params.set("follow_up_to", todayStr);
      } else if (type === "status" && value) {
        params.set("status", value);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router, todayStr]
  );

  const statsData = useMemo(
    () => [
      {
        title: "All Inquiries",
        value: data?.total ?? 0,
        isActive: !currentStatus && !currentDateFrom && !currentFollowUpFrom,
        onClick: () => handleCardClick("all"),
      },
      {
        title: "Today Inquiry",
        value: data?.today ?? 0,
        isActive: currentDateFrom === todayStr,
        onClick: () => handleCardClick("today"),
      },
      {
        title: "Today Follow Ups",
        value: data?.today_follow_ups ?? 0,
        isActive: currentFollowUpFrom === todayStr,
        onClick: () => handleCardClick("follow_up"),
      },
      {
        title: "Pending",
        value: data?.pending ?? 0,
        isActive: currentStatus === "PENDING",
        onClick: () => handleCardClick("status", "PENDING"),
      },
      {
        title: "In Progress",
        value: data?.in_progress ?? 0,
        isActive: currentStatus === "IN_PROGRESS" || currentStatus === "IN PROGRESS",
        onClick: () => handleCardClick("status", "IN_PROGRESS"),
      },
      {
        title: "Completed",
        value: data?.completed ?? 0,
        isActive: currentStatus === "COMPLETED",
        onClick: () => handleCardClick("status", "COMPLETED"),
      },
      {
        title: "No Response",
        value: data?.no_response ?? 0,
        isActive: currentStatus === "NO_RESPONSE" || currentStatus === "NO RESPONSE",
        onClick: () => handleCardClick("status", "NO_RESPONSE"),
      },
    ],
    [data, currentStatus, currentDateFrom, currentFollowUpFrom, todayStr, handleCardClick]
  );

  return (
    <div className="flex w-full flex-wrap items-stretch gap-3 pb-4">
      {statsData.map((stat) => (
        <div key={stat.title} className="flex-1 min-w-[140px] md:min-w-[160px]">
          <InquiryStatCard
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
