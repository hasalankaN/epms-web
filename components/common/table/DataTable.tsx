"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import dynamic from "next/dynamic";

import { motion, AnimatePresence } from "framer-motion";
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CustomPaginationProps } from "@/components/common/CustomPagination";
import CustomPagination from "@/components/common/CustomPagination";
import { itemVariants } from "@/components/ui/dialog";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LOADING_ANIMATION_URL = "/animations/loading-animation.json";

let cachedLoadingAnimationData: any = null;

export interface Column<T> {
  id?: string;
  header: React.ReactNode | ((props: { table: any }) => React.ReactNode);
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  pagination?: CustomPaginationProps;
  rowClassName?: (item: T) => string;
  showCheckboxes?: boolean;
  tableContainerClassName?: string;
  emptyState?: React.ReactNode;
  footerRow?: React.ReactNode;
  hideBorder?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  isError = false,
  pagination,
  rowClassName,
  showCheckboxes = true,
  tableContainerClassName,
  emptyState,
  footerRow,
  hideBorder = false,
}: DataTableProps<T>) {
  const [animationData, setAnimationData] = useState<any>(cachedLoadingAnimationData);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isTableHovered, setIsTableHovered] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading || cachedLoadingAnimationData) return;

    fetch(LOADING_ANIMATION_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        return res.json();
      })
      .then((data) => {
        cachedLoadingAnimationData = data;
        setAnimationData(data);
      })
      .catch((err) => console.error("Failed to load animation", err));
  }, [isLoading]);

  const checkScroll = useCallback(() => {

    const el = tableRef.current;

    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;

      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  }, []);

  useEffect(() => {
    const el = tableRef.current;

    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);

      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [data, checkScroll, isLoading]);

  const scrollTable = (direction: "left" | "right") => {
    const el = tableRef.current;

    if (el) {
      const scrollAmount = el.clientWidth * 0.6;

      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-[#E2E8F0] bg-white">
        {animationData ? (
          <>
            <Lottie animationData={animationData} loop className="h-50 w-50" />
            <p className="mt-4 text-[14px] text-[#64748B]">Loading...</p>
          </>
        ) : (
          <>
            {/* <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E60076] border-t-transparent" /> */}
            <p className="mt-4 text-[14px] text-[#64748B]">Loading...</p>
          </>
        )}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-[#E2E8F0] bg-white">
        <p className="text-[14px] text-red-500">Error loading data. Please try again.</p>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsTableHovered(true)}
      onMouseLeave={() => setIsTableHovered(false)}
      className={cn(
        "flex flex-col relative group/table",
        !hideBorder && "rounded-lg border border-[#E4E4E7] bg-white shadow-[0_1px_2_px_0_rgba(0,0,0,0.05)]"
      )}
    >
      {/* Edge Gradients - Visual cue for horizontal overflow */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.div
            key="left-gradient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/40 to-transparent pointer-events-none z-10 transition-opacity"
          />
        )}
        {canScrollRight && (
          <motion.div
            key="right-gradient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/40 to-transparent pointer-events-none z-10 transition-opacity"
          />
        )}
      </AnimatePresence>

      {/* Horizontal Scroll Buttons - Placed outside scroll container to remain vertically fixed */}
      <AnimatePresence>
        {canScrollLeft && isTableHovered && (
          <motion.button
            key="left-scroll-btn"
            initial={{ opacity: 0, x: -10, y: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: -10, y: "-50%", scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTable("left")}
            className="absolute left-2 top-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/90 text-[#64748B] shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all hover:text-[#E60076]"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        )}
        {canScrollRight && isTableHovered && (
          <motion.button
            key="right-scroll-btn"
            initial={{ opacity: 0, x: 10, y: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: 10, y: "-50%", scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTable("right")}
            className="absolute right-2 top-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/90 text-[#64748B] shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all hover:text-[#E60076]"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Table Scroll Container */}
      <div
        ref={tableRef}
        className={cn(
          "overflow-auto relative w-full",
          tableContainerClassName !== undefined ? tableContainerClassName : "h-[550px]"
        )}
      >
        <table className="w-full caption-bottom text-xs">
          <thead className="[&_tr]:border-b">
            <tr className="h-[36px] border-b border-[#E7E7EB] bg-[#FDF2F8] hover:bg-[#FDF2F8]">
              {columns.map((col, index) => (
                <th
                  key={col.id || index}
                  className={cn(
                    "h-9 px-2 text-left align-middle font-semibold text-[#1D293D] whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                    col.headerClassName || col.className
                  )}
                >
                  {typeof col.header === "function" ? col.header({ table: {} }) : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody
            key={data?.length > 0 ? `table-body-${data.length}-${keyExtractor(data[0])}` : "empty-table-body"}
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="[&_tr:last-child]:border-0"
          >
            {data.length > 0 ? (
              data.map((item) => (
                <motion.tr
                  key={keyExtractor(item)}
                  variants={itemVariants}
                  className={cn(
                    "h-[50px] border-b border-[#E7E5E4] transition-colors hover:bg-[#FFF9FC] data-[state=selected]:bg-muted",
                    rowClassName?.(item)
                  )}
                >
                  {columns.map((col, index) => (
                    <td
                      key={col.id || index}
                      className={cn(
                        "p-1.5 align-middle whitespace-nowrap",
                        showCheckboxes && "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                        col.className
                      )}
                    >
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                          ? (item[col.accessorKey] as React.ReactNode)
                          : null}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-full">
                  <div className="flex flex-col items-center justify-center py-20">
                    {emptyState || (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF2F8]">
                          <Inbox className="h-6 w-6 text-[#E60076]" />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-[#1D293D]">No results found</h3>
                        <p className="mt-1 text-sm text-[#64748B]">
                          Try adjusting your search or filters to find what you&apos;re looking for.
                        </p>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </motion.tbody>
          {footerRow && (
            <tfoot className="border-t border-[#E2E8F0] bg-[#F1F5F9]">
              {footerRow}
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      {pagination && <CustomPagination {...pagination} />}
    </div>
  );
}
