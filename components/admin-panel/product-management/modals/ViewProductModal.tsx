"use client";

import React, { useState, useEffect } from "react";

import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import type { ProductDataType } from "@/types/product";
import { useGetProductById, type ProductDetailItem } from "@/hooks/api/products/useGetProductById";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDataType | null;
}

// Build image list from product detail, filtering out empty entries
function buildImageList(product: ProductDetailItem): string[] {
  return (product.images || [])
    .filter(img => img.url)
    .sort((a, b) => a.display_order - b.display_order)
    .map(img => img.url);
}

export function ViewProductModal({ isOpen, onClose, product: listProduct }: ViewProductModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: product, isLoading } = useGetProductById(isOpen ? listProduct?.id ?? null : null);

  useEffect(() => {
    if (isOpen) setSelectedIndex(0);
  }, [isOpen, product]);

  const handleClose = () => {
    onClose();
  };

  const images = product ? buildImageList(product) : [];
  const totalImages = images.length;

  const handlePrev = () =>
    setSelectedIndex((prev) => (prev === 0 ? Math.max(0, totalImages - 1) : prev - 1));

  const handleNext = () =>
    setSelectedIndex((prev) => (prev >= totalImages - 1 ? 0 : prev + 1));

  const activeImage = images[selectedIndex] || "";

  const currentStock = product?.current_stock ?? 0;
  const stockThreshold = product?.stock_threshold ?? 0;
  const stockColor = currentStock > stockThreshold ? "#34C759" : "#FB2C36";
  const stockLabel = `${currentStock} items left`;

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    return `LKR${numPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        isLoading={isLoading}
        animateChildren={true}
        className="w-[95vw] max-w-[1200px] max-h-[90vh] overflow-hidden rounded-xl bg-white p-3 shadow-lg [&>button]:hidden"
        style={{ display: "flex", flexDirection: "column", gap: 0, borderRadius: "12px", background: "#FFF" }}
      >
        {/* ===== HEADER ===== */}
        <motion.div variants={itemVariants} className="flex flex-col shrink-0">
          <div className="flex items-center justify-between px-1 pb-[12px]">
            <DialogTitle
              className="font-inter font-semibold pr-2"
              style={{ fontSize: 18, lineHeight: "30px", color: "#0F172B" }}
            >
              {product?.name || listProduct?.productName}
            </DialogTitle>
            <button
              title="Close"
              onClick={handleClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div style={{ height: 1, background: "#E2E8F0", width: "100%" }} />
        </motion.div>

        {/* gap between header and content — 32px constant as per request */}
        <div className="h-8 shrink-0" />

        {/* ===== BODY ===== */}
        <motion.div variants={itemVariants} className="flex-1 overflow-hidden min-h-0 flex flex-col">
        {!isLoading && !product ? (
          <div className="h-full w-full flex items-center justify-center min-h-[400px] text-slate-500">
            Failed to load product details.
          </div>
        ) : isLoading || !product ? (
          <div className="h-full w-full min-h-[400px]" />
        ) : (
          <div className="flex-1 w-full overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-start md:gap-6 lg:gap-0 gap-5 px-1 min-h-full">

            {/* ── LEFT SECTION: MAIN IMAGE + THUMBNAILS ── */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-0 shrink-0">

              {/* ── BIG MAIN IMAGE ── */}
              <div
                className="relative shrink-0 rounded-[6px] overflow-hidden w-full max-w-[384px] md:w-[260px] lg:w-[384px]"
                style={{
                  aspectRatio: "1/1",
                  boxShadow: "0 1.5px 6px 0 rgba(0,0,0,0.05)",
                  background: "lightgray 50% / cover no-repeat",
                }}
              >
                <img
                  src={activeImage || "/images/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                />

                {/* Prev / Next arrows */}
                {totalImages > 1 && (
                  <div className="absolute bottom-[14px] right-[14px] lg:bottom-[18px] lg:right-[18px] flex items-center gap-4 lg:gap-[24px]">
                    <button
                      title="Previous"
                      onClick={handlePrev}
                      className="flex items-center justify-center transition hover:bg-white"
                      style={{
                        width: 36,
                        height: 36,
                        padding: 7.5,
                        borderRadius: 90,
                        border: "0.9px solid #E5E7EB",
                        background: "rgba(243, 244, 246, 0.90)",
                      }}
                    >
                      <ChevronLeft className="h-5 w-5 text-[#1D293D]" />
                    </button>
                    <button
                      title="Next"
                      onClick={handleNext}
                      className="flex items-center justify-center transition hover:bg-white"
                      style={{
                        width: 36,
                        height: 36,
                        padding: 7.5,
                        borderRadius: 90,
                        border: "0.9px solid #E5E7EB",
                        background: "rgba(243, 244, 246, 0.90)",
                      }}
                    >
                      <ChevronRight className="h-5 w-5 text-[#1D293D]" />
                    </button>
                  </div>
                )}
              </div>

              {/* ── THUMBNAIL STRIP — only renders when there are real images ── */}
              {images.length > 0 && (
                <div
                  className="flex flex-row md:flex-col gap-3 md:gap-[12px] shrink-0 md:ml-[16px] lg:ml-[20px] pb-1 md:pb-0"
                  style={{
                    maxHeight: 300,
                    overflowY: "auto",
                    overflowX: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {images.map((imgUrl, i) => {
                    const isSelected = i === selectedIndex;

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedIndex(i)}
                        className={cn(
                          "relative flex-shrink-0 transition-all overflow-hidden",
                          !isSelected && "opacity-60 hover:opacity-100"
                        )}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 4,
                          boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.06)",
                          border: isSelected ? "2px solid #E60076" : "1.5px solid #E2E8F0",
                          background: `url(${imgUrl}) lightgray 50% / cover no-repeat`,
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && (
                          <>
                            <div className="absolute inset-0 bg-black/40 rounded" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Eye className="h-5 w-5 text-white" />
                            </div>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── VERTICAL DIVIDER ── lg+ only */}
            <div
              className="hidden lg:block shrink-0 self-stretch mx-[24px]"
              style={{ width: 1, background: "#E2E8F0", minHeight: 314 }}
            />

            {/* ── CONTENT PANE ── */}
            <div className="flex flex-col flex-1 min-w-0 lg:w-[628px] lg:max-w-[628px] lg:flex-none">

              <div className="flex items-center justify-between gap-4">
                {/* SKU */}
                <p
                  className="font-inter text-sm font-normal leading-[20px]"
                  style={{ color: "#62748E" }}
                >
                  {product.sku}
                </p>

                {/* Status Badge */}
                <div 
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ 
                    background: product.status === "ACTIVE" ? "#DFFFF0" : "#F1F5F9",
                    color: product.status === "ACTIVE" ? "#16A34A" : "#64748B"
                  }}
                >
                  {product.status}
                </div>
              </div>

              {/* Category */}
              {(product.category_name || product.category_id) && (
                <p
                  className="font-inter text-[12px] font-semibold tracking-wider uppercase mt-3"
                  style={{ color: "#E60076", opacity: 0.5 }}
                >
                  {product.category_name || "—"}
                </p>
              )}

              {/* Short Description */}
              <p
                className="font-inter text-sm font-normal leading-[20px] mt-[8px]"
                style={{ color: "#1D293D" }}
              >
                {product.short_description || "—"}
              </p>

              {/* Price */}
              <p
                className="font-inter font-semibold leading-[38px] mt-4 lg:mt-[26px]"
                style={{ fontSize: 24, color: "#171717" }}
              >
                {formatPrice(product.price)}
              </p>

              {/* Stock — only for DELIVERY products */}
              {product.type === "DELIVERY" && (
                <p
                  className="font-inter text-sm font-semibold leading-[20px] mt-4 lg:mt-[26px]"
                  style={{ color: stockColor }}
                >
                  {stockLabel}
                </p>
              )}

              {/* Long Description */}
              <p
                className="font-inter text-sm font-normal leading-[20px] mt-[12px]"
                style={{ color: "#314158" }}
              >
                {product.long_description || "No description available."}
              </p>

            </div>
          </div>
            </div>
        )}
        </motion.div>

        {/* bottom spacing */}
        <motion.div variants={itemVariants} className="h-2 lg:h-0" />
      </DialogContent>
    </Dialog>
  );
}
