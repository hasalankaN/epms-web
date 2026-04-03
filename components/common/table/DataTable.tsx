"use client";

import React, { useState, useEffect } from "react";

import dynamic from "next/dynamic";

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

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
}: DataTableProps<T>) {
  const [animationData, setAnimationData] = useState<any>(cachedLoadingAnimationData);

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
    <div className="flex flex-col rounded-lg border border-[#E4E4E7] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
      {/* Table Scoll Container */}
      <div className={cn("overflow-auto relative w-full", tableContainerClassName !== undefined ? tableContainerClassName : "h-[550px]")}>
        <table className="w-full caption-bottom text-xs">
          <thead className="[&_tr]:border-b">
            <tr className="h-[36px] border-b border-[#E7E7EB] bg-[#FDF2F8] hover:bg-[#FDF2F8]">
              {columns.map((col, index) => (
                <th
                  key={col.id || index}
                  className={cn(
                    "h-9 px-2 text-left align-middle font-semibold text-[#1D293D] [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                    col.headerClassName || col.className
                  )}
                >
                  {typeof col.header === "function" ? col.header({ table: {} }) : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody
            key={data.map((d) => keyExtractor(d)).join(",")}
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
                        "p-1.5 align-middle",
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
