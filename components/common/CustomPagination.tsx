"use client";

import React, { useEffect, useState } from "react";

import { usePathname, useSearchParams } from "next/navigation";

import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

// ===== TYPES =====

type PaginationVariant = "full" | "simple";

export interface CustomPaginationProps {

  /** Total number of items */
  totalCount?: number;

  /** Number of pending items (shows "Total Pending" badge) */
  pending?: number;

  /** Number of selected rows (for "X of Y row(s) selected" display) */
  selectedRowCount?: number;

  /** Variant: "full" shows numbered buttons, "simple" shows only first/last buttons */
  variant?: PaginationVariant;

  /** Current page (1-indexed, for controlled mode) */
  currentPage?: number;

  /** Total pages (for controlled mode) */
  totalPages?: number;

  /** Callback when page changes (for controlled mode) */
  onPageChange?: (page: number) => void;

  /** Items per page (default: 10) */
  itemsPerPage?: number;

  /** Custom class name */
  className?: string;

  /** Hide the total count/selected count text on the left */
  hideTotalCount?: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  totalCount,
  pending,
  selectedRowCount,
  variant = "full",
  currentPage: controlledPage,
  totalPages: controlledTotalPages,
  onPageChange,
  itemsPerPage: initialItemsPerPage = 10,
  className,
  hideTotalCount = false,
}) => {
  // URL-based state (for uncontrolled mode)
  const [internalPage, setInternalPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Determine if controlled or uncontrolled mode
  const isControlled = controlledPage !== undefined && onPageChange !== undefined;
  
  const currentPage = isControlled ? controlledPage : internalPage;

  const totalPages = isControlled 
    ? (controlledTotalPages ?? Math.max(1, Math.ceil((totalCount ?? itemsPerPage) / itemsPerPage)))
    : Math.max(1, Math.ceil((totalCount ?? itemsPerPage) / itemsPerPage));

  // Sync with URL params (uncontrolled mode only)
  useEffect(() => {
    if (isControlled) return;
    
    const items = searchParams.get("items");
    const page = searchParams.get("page");

    if (items) {
      setItemsPerPage(parseInt(items));
    }

    if (page) {
      setInternalPage(parseInt(page));
    } else {
      setInternalPage(1);
    }
  }, [searchParams, isControlled]);

  // ===== HANDLERS =====

  const handlePageChange = (page: number) => {
    if (isControlled) {
      onPageChange?.(page);
    } else {
      const searchparams = new URLSearchParams(searchParams.toString());

      if (page === 1) {
        searchparams.delete("page");
      } else {
        searchparams.set("page", page.toString());
      }

      window.location.href = `${pathname}?${searchparams.toString()}`;
      setInternalPage(page);
    }
  };

  const handleNavigateFirstPage = () => handlePageChange(1);
  const handleNavigateLastPage = () => handlePageChange(totalPages);
  const handlePreviousPage = () => handlePageChange(Math.max(1, currentPage - 1));
  const handleNextPage = () => handlePageChange(Math.min(totalPages, currentPage + 1));

  // ===== RENDER HELPERS =====

  const buttonClass = "size-10 text-[13px] text-[#555555] font-semibold";

  const createButton = (
    key: string | number,
    variantType: "default" | "outline",
    onClick: (() => void) | undefined,
    buttonClassName: string,
    children: React.ReactNode
  ) => (
    <Button key={key} variant={variantType} onClick={onClick} className={buttonClassName}>
      {children}
    </Button>
  );

  const createPaginationButton = (pageNumber: number) => {
    const buttonVariant = currentPage === pageNumber ? "default" : "outline";

    return createButton(
      pageNumber,
      buttonVariant,
      () => handlePageChange(pageNumber),
      cn(buttonClass, currentPage === pageNumber && "text-white"),
      pageNumber
    );
  };

  // Generate numbered buttons for "full" variant
  const buttons: React.ReactNode[] = [];
  
  if (variant === "full") {
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(createPaginationButton(i));
      }
    } else {
      if (currentPage < 5) {
        for (let i = 1; i <= 5; i++) {
          buttons.push(createPaginationButton(i));
        }

        buttons.push(createButton("...", "outline", undefined, buttonClass, "..."));
        buttons.push(createPaginationButton(totalPages));
      } else if (currentPage > totalPages - 4) {
        buttons.push(createPaginationButton(1));
        buttons.push(createButton("...", "outline", undefined, buttonClass, "..."));

        for (let i = totalPages - 4; i <= totalPages; i++) {
          buttons.push(createPaginationButton(i));
        }
      } else {
        buttons.push(createPaginationButton(1));
        buttons.push(createButton("...1", "outline", undefined, buttonClass, "..."));

        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(createPaginationButton(i));
        }

        buttons.push(createButton("...2", "outline", undefined, buttonClass, "..."));
        buttons.push(createPaginationButton(totalPages));
      }
    }
  }

  // ===== RENDER =====

  // Simple variant (like InquiryPagination)
  if (variant === "simple") {
    return (
      <div className={cn("flex h-[64px] w-full items-center justify-between border-t border-[#E4E4E7] px-4 py-4", className)}>
        {/* Left: Selection count or record count */}
        <div className="text-[14px] font-normal text-[#6B7280]">
          {!hideTotalCount && (
            selectedRowCount !== undefined ? (
              selectedRowCount > 0 ? (
                `${selectedRowCount} of ${totalCount ?? 0} row(s) selected.`
              ) : (
                `0 of ${totalCount ?? 0} row(s) selected.`
              )
            ) : (
              `Total: ${totalCount ?? 0} records`
            )
          )}
        </div>

        {/* Right: Page info and navigation */}
        <div className="flex items-center gap-6">
          <div className="text-[14px] font-medium text-[#111827]">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-[#D1D5DB] hover:bg-[#F9FAFB]"
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              aria-label="Go to previous page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-[#D1D5DB] hover:bg-[#F9FAFB]"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              aria-label="Go to next page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Full variant (original complex pagination)
  return (
    <div
      className={cn(
        "flex items-center justify-between pl-5 -mt-5",
        pending && "pl-0",
        className
      )}
    >
      <div className="flex flex-col w-full">
        {pending && (
          <div className="flex flex-row items-center gap-[15px] pt-2.5">
            <span className="text-sm font-normal text-activeText">
              Total Pending
            </span>
            <div className="flex items-center justify-center bg-primary rounded-[5px] px-2 min-w-[90px] h-[29px] text-white font-semibold text-sm">
              {pending}
            </div>
          </div>
        )}
        <div className="flex-1 whitespace-nowrap text-sm text-dark font-normal">
          Showing results{" "}
          {totalCount === 0
            ? 0
            : totalCount && totalCount < itemsPerPage
              ? totalCount
              : (searchParams.get("items") ?? itemsPerPage)}{" "}
          out of {totalCount === 0 ? 0 : totalCount ? totalCount : "all"}{" "}
        </div>
      </div>
      <div className="flex flex-row items-center gap-[5px] mt-[15px] mx-auto">
        <Button
          aria-label="Go to first page"
          variant="outline"
          size="icon"
          className="size-10"
          onClick={handleNavigateFirstPage}
          disabled={currentPage <= 1}
        >
          <ChevronsLeft className="size-4" aria-hidden="true" />
        </Button>
        {buttons.map((button, index) => (
          <React.Fragment key={index}>{button}</React.Fragment>
        ))}
        {buttons.length === 0 && (
          <Button
            variant="default"
            onClick={() => handlePageChange(1)}
            className={cn(buttonClass, currentPage === 1 && "text-white")}
          >
            1
          </Button>
        )}
        <Button
          aria-label="Go to last page"
          variant="outline"
          size="icon"
          className="size-10"
          onClick={handleNavigateLastPage}
          disabled={currentPage >= totalPages}
        >
          <ChevronsRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default CustomPagination;
