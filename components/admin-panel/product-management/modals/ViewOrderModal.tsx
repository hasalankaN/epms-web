"use client";

import React, { useState, useEffect } from "react";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusPopover } from "@/components/common/StatusPopover";

import { cn } from "@/lib/utils";
import type { OrderDataType, OrderStatus } from "@/types/product";
import { ORDER_STATUS_CONFIG } from "@/types/product";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDataType | null;
}

// ===== Reusable read-only field label =====
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p className={cn(AUTH_TYPOGRAPHY.label, "mb-1 block")}>{children}</p>
);

// ===== Read-only styled textarea (grey bg) =====
const ReadonlyTextarea = ({ value }: { value: string }) => (
  <textarea
    title="readonly"
    value={value}
    readOnly
    rows={4}
    className={cn(
      "w-full resize-none rounded-md border border-transparent bg-[#F1F5F9] px-3 py-2 text-sm text-[#0F172B] outline-none",
      AUTH_INPUT.placeholder
    )}
  />
);

// ===== Read-only single-line field =====
const ReadonlyInput = ({ value }: { value: string }) => (
  <div className="flex h-10 w-full items-center rounded-md border border-transparent bg-[#F1F5F9] px-3 text-sm text-[#0F172B] font-normal">
    {value}
  </div>
);

// ===== Status options built from ORDER_STATUS_CONFIG =====
const STATUS_OPTIONS = (Object.entries(ORDER_STATUS_CONFIG) as [OrderStatus, { bg: string; text: string }][]).map(
  ([key, val]) => ({ value: key, bg: val.bg, text: val.text })
);

export function ViewOrderModal({ isOpen, onClose, order }: ViewOrderModalProps) {
  const [orderStatus, setOrderStatus] = useState<string>("");

  // Sync status when order or modal changes
  useEffect(() => {
    if (isOpen && order) {
      setOrderStatus(order.orderStatus);
    }
  }, [isOpen, order]);

  if (!order) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Build fee rows from order data
  const unitPrice = order.amount;
  
  const productRow = {
    id: order.id,
    product: order.productName,
    qty: order.quantity,
    unitPrice,
  };

  const appliedDiscount = 0; // placeholder — extend type when API ready
  const total = unitPrice * order.quantity - appliedDiscount;

  // Billing / Delivery dummy text (extend type when API ready)
  const billingDetails = `${order.customerName}\nPASAL MAWATHA, UDABARAGAMA,\nAMBALANTOTA\n82102`;
  const deliveryDetails = billingDetails;
  const mobileNumber = "+94770409738\n+94770409738";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-4 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
              Order Details
            </DialogTitle>
            <button
              title="close"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </div>

        {/* ===== BODY ===== */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-5">

            {/* Billing Details */}
            <div className="space-y-1">
              <FieldLabel>Billing Details</FieldLabel>
              <ReadonlyTextarea value={billingDetails} />
            </div>

            {/* Delivery Details */}
            <div className="space-y-1">
              <FieldLabel>Delivery Details</FieldLabel>
              <ReadonlyTextarea value={deliveryDetails} />
            </div>

            {/* Mobile Number (billing) */}
            <div className="space-y-1">
              <FieldLabel>Mobile Number</FieldLabel>
              <ReadonlyTextarea value={mobileNumber} />
            </div>

            {/* Mobile Number (delivery) */}
            <div className="space-y-1">
              <FieldLabel>Mobile Number</FieldLabel>
              <ReadonlyTextarea value={mobileNumber} />
            </div>

            {/* Payment Via — half width on desktop */}
            <div className="col-span-1 space-y-1">
              <FieldLabel>Payment Via</FieldLabel>
              <ReadonlyInput value={order.paymentMethod} />
            </div>

            {/* Spacer on desktop to keep Payment Via left-aligned */}
            <div className="hidden sm:block" />

            {/* Fee History — full width */}
            <div className="col-span-1 sm:col-span-2 space-y-2">
              <FieldLabel>Fee History</FieldLabel>

              <div className="border border-[#E4E4E7] rounded-lg bg-white shadow-sm overflow-hidden">
                <Table>
                  {/* Pink header matching CourseFeeDetailsStep */}
                  <TableHeader className="bg-pink-50">
                    <TableRow className="border-none hover:bg-pink-50">
                      <TableHead className="text-sm font-semibold text-[#1D293D] font-inter pl-6 py-2 h-auto">
                        Product
                      </TableHead>
                      <TableHead className="w-[80px] text-sm font-semibold text-[#1D293D] font-inter text-right px-4 py-2 h-auto">
                        QTY
                      </TableHead>
                      <TableHead className="w-[130px] text-sm font-semibold text-[#1D293D] font-inter text-right pr-6 py-2 h-auto">
                        Unit Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {/* Product row */}
                    <TableRow className="border-b border-[#F1F5F9] hover:bg-transparent">
                      <TableCell className="text-[#45556C] text-sm font-normal font-inter leading-5 pl-6 py-2">
                        {productRow.product}
                      </TableCell>
                      <TableCell className="w-[80px] text-[#45556C] text-sm font-normal font-inter leading-5 text-right px-4 py-2">
                        {productRow.qty}
                      </TableCell>
                      <TableCell className="w-[130px] text-[#45556C] text-sm font-normal font-inter leading-5 text-right pr-6 py-2">
                        {formatCurrency(productRow.unitPrice)}
                      </TableCell>
                    </TableRow>

                    {/* Applied Discount row */}
                    {appliedDiscount !== 0 && (
                      <TableRow className="border-b border-[#F1F5F9] hover:bg-transparent">
                        <TableCell
                          colSpan={2}
                          className="text-[#45556C] text-sm font-normal font-inter leading-5 pl-6 py-2"
                        >
                          Applied Discount
                        </TableCell>
                        <TableCell className="w-[130px] text-[#EF4444] text-sm font-normal font-inter leading-5 text-right pr-6 py-2">
                          -{formatCurrency(appliedDiscount)}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>

                  {/* Total footer */}
                  <TableFooter className="border-t-[2px] border-t-[#62748E] bg-[#F8FAFC]">
                    <TableRow className="hover:bg-[#F8FAFC] border-none">
                      <TableCell
                        colSpan={2}
                        className="text-[#0F172B] text-sm font-semibold font-inter leading-6 pl-6 py-3"
                      >
                        Total Price
                      </TableCell>
                      <TableCell className="w-[130px] text-[#0F172B] text-sm font-semibold font-inter leading-6 text-right pr-6 py-3">
                        {formatCurrency(total)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>

          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4">
          {/* Status Popover */}
          <div className="mr-auto">
            <StatusPopover
              value={orderStatus}
              onValueChange={setOrderStatus}
              options={STATUS_OPTIONS}
            />
          </div>

          {/* View Invoice primary button */}
          <Button
            onClick={() => {
              // TODO: wire to invoice URL
              console.log("View Invoice for order", order.orderId);
            }}
            className={cn(BUTTON_STYLES.primary.md, "text-sm font-semibold text-white")}
          >
            View Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
