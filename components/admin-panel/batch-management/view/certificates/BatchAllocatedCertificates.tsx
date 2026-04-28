"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCertificateTemplateById } from "@/hooks/api/certificates/useGetCertificateTemplateById";

interface BatchAllocatedCertificatesProps {
  certificateIds?: string[];
}

function CertRow({ certId }: { certId: string }) {
  const { data, isLoading } = useGetCertificateTemplateById(certId);

  if (isLoading) {
    return (
      <TableRow className="border-b border-[#F1F5F9] last:border-none hover:bg-transparent">
        <TableCell className="px-6 py-3">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
        </TableCell>
        <TableCell className="w-[152px] px-6 py-3 text-right">
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100 ml-auto" />
        </TableCell>
      </TableRow>
    );
  }

  if (!data) return null;

  const isFree = data.pricing_type === "FREE";
  const amountLabel = isFree ? "Free" : parseFloat(data.price).toFixed(2);

  return (
    <TableRow className="border-b border-[#F1F5F9] last:border-none hover:bg-transparent">
      <TableCell className="text-[#45556C] text-sm font-normal font-inter leading-5 break-all px-6 py-3">
        {data.name}
      </TableCell>
      <TableCell className="w-[152px] shrink-0 text-right px-6 py-3 align-middle">
        <span className="inline-flex items-center justify-center rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
          {amountLabel}
        </span>
      </TableCell>
    </TableRow>
  );
}

export function BatchAllocatedCertificates({ certificateIds = [] }: BatchAllocatedCertificatesProps) {
  return (
    <div className="border border-[#E4E4E7] rounded-lg bg-white shadow-sm overflow-hidden flex flex-col w-full">
      <Table className="min-w-[500px]">
        <TableHeader className="bg-pink-50">
          <TableRow className="border-none hover:bg-pink-50">
            <TableHead className="text-sm font-semibold text-[#1D293D] font-inter pl-6 py-2 h-auto w-auto">
              Description
            </TableHead>
            <TableHead className="w-[152px] text-sm font-semibold text-[#1D293D] font-inter text-right pr-6 py-2 h-auto shrink-0">
              Amount (LKR)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificateIds.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-sm text-slate-400 py-6">
                No certificates allocated
              </TableCell>
            </TableRow>
          ) : (
            certificateIds.map((id) => <CertRow key={id} certId={id} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
}
