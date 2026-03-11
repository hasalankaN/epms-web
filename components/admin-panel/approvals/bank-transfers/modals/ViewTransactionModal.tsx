"use client";

import React from "react";

import { X } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";

export interface TransactionDetails {
  id: string;
  transactionDate: string;
  transactionId: string;
  amount: string;
  invoiceUrl?: string;
}

export interface UserSummaryData {
  name: string;
  studentId: string;
  registeredDate: string;
  email: string;
  phone: string;
  whatsapp: string;
  avatarUrl?: string;
}

interface ViewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSummaryData | null;
  transactions: TransactionDetails[];
}

export function ViewTransactionModal({
  isOpen,
  onClose,
  user,
  transactions = [],
}: ViewTransactionModalProps) {
  if (!user) return null;

  const handleDownloadInvoice = (url?: string) => {
    toast.success("Downloading invoice...");

    // Mock download logic
    if (url) {
      console.log("Downloading from:", url);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[700px] flex-col gap-8 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] outline-none [&>button]:hidden">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col gap-4 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
              View Transaction
            </DialogTitle>
            <button
              title="Close"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </div>

        {/* ===== USER SUMMARY ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 w-full text-left">
          {/* Avatar Area */}
          <div className="flex items-center gap-4">
            <div 
               className="w-16 h-16 shrink-0 rounded-full border border-gray-200 bg-gray-300 bg-cover bg-center bg-no-repeat"
               style={{ backgroundImage: `url(${user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name.replace(/\s+/g, '')}`})` }}
            />
            <div className="flex flex-col text-left">
               <h3 className="text-base font-semibold text-[#1D293D] font-inter leading-6">{user.name}</h3>
               <p className="text-xs font-normal text-[#45556C] font-inter leading-4 mt-1">{user.studentId}</p>
               <p className="text-xs font-normal text-[#45556C] font-inter leading-4 mt-1">{user.registeredDate}</p>
            </div>
          </div>

          {/* Contact Details Area */}
          <div className="flex flex-col gap-2 md:justify-center items-start">
             <div className="flex items-center gap-2 text-[#45556C]">
                <i className="email-icon h-4 w-4 shrink-0" />
                <span className="text-xs font-normal font-inter leading-4">{user.email}</span>
             </div>
             <div className="flex items-center gap-2 text-[#45556C]">
                <i className="phone h-4 w-4 shrink-0" />
                <span className="text-xs font-normal font-inter leading-4">{user.phone}</span>
             </div>
             <div className="flex items-center gap-2 text-[#45556C]">
                <i className="whatsapp-logo h-4 w-4 shrink-0" />
                <span className="text-xs font-normal font-inter leading-4">{user.whatsapp}</span>
             </div>
          </div>
        </div>

        <div className="border-b border-[#E2E8F0]" />

        {/* ===== TRANSACTION DETAILS TABLE ===== */}
        <div className="flex flex-col gap-2 shrink-0">
          <h4 className="text-xs font-normal text-[#9F9FA9] font-inter leading-4">Transaction Details</h4>
          
          <div className="border border-[#E4E4E7] rounded-lg bg-white shadow-sm overflow-x-auto w-full">
            <Table className="min-w-[500px]">
              <TableHeader className="bg-[#FDF2F8]">
                <TableRow className="border-none hover:bg-[#FDF2F8]">
                  <TableHead className="text-[12px] font-semibold leading-[16px] text-[#1D293D] font-inter pl-6 py-3 h-auto whitespace-nowrap overflow-hidden text-ellipsis">Date</TableHead>
                  <TableHead className="text-[12px] font-semibold leading-[16px] text-[#1D293D] font-inter text-center py-3 h-auto whitespace-nowrap overflow-hidden text-ellipsis">Transaction ID</TableHead>
                  <TableHead className="text-[12px] font-semibold leading-[16px] text-[#1D293D] font-inter text-center py-3 h-auto whitespace-nowrap overflow-hidden text-ellipsis">Amount(LKR)</TableHead>
                  <TableHead className="text-[12px] font-semibold leading-[16px] text-[#1D293D] font-inter text-right pr-6 py-3 h-auto whitespace-nowrap overflow-hidden text-ellipsis">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="h-24 text-center text-sm text-[#90A1B9] border-t border-transparent">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((txn) => (
                    <TableRow key={txn.id} className="border-b border-[#F1F5F9] last:border-none hover:bg-transparent">
                      <TableCell className="text-[#45556C] text-[14px] font-normal font-inter leading-[20px] text-left pl-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                        {txn.transactionDate}
                      </TableCell>
                      <TableCell className="text-[#45556C] text-[14px] font-normal font-inter leading-[20px] text-center py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                        {txn.transactionId}
                      </TableCell>
                      <TableCell className="text-[#45556C] text-[14px] font-normal font-inter leading-[20px] text-center py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                        {txn.amount}
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4 align-middle whitespace-nowrap">
                        <Button
                           variant="ghost"
                           onClick={() => handleDownloadInvoice(txn.invoiceUrl)}
                           className={cn(BUTTON_STYLES.ghost.sm, "h-8 px-2 gap-1.5 ml-auto text-[#45556C] hover:text-[#0F172B] hover:bg-slate-100 font-normal")}
                        >
                           <i className="file-pdf h-4 w-4 shrink-0 text-[#45556C]" />
                           Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
