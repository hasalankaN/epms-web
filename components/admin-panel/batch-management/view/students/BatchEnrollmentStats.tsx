"use client";

import React from "react";

interface BatchEnrollmentStatsProps {
  total?: number;
  direct?: number;
  referral?: number;
}

export function BatchEnrollmentStats({
  total = 0,
  direct = 0,
  referral = 0,
}: BatchEnrollmentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:flex items-center gap-4 md:gap-6 lg:gap-16 self-stretch rounded-lg border border-slate-200 bg-transparent px-4 py-4 lg:px-6 lg:py-3">
      {/* Total Enrollments Card */}
      <div
        className="col-span-1 md:col-span-2 lg:col-span-auto flex w-full lg:w-[180px] h-[104px] flex-col items-center justify-center gap-2 rounded-lg border border-[#FFCFEA] shadow-sm"
        style={{
          background: "linear-gradient(315deg, #FFCFEA 0.35%, #F8FAFC 99.65%)",
        }}
      >
        <div className="flex items-center gap-2 text-[#314158]">
          <i className="customers-icon h-5 w-5" />
          {/* Icon size not strictly specified for this one, mostly implicit from "gap 8px" and context, assuming standard or small */}
        </div>
        <div className="flex flex-col items-center gap-0">
          <span className="font-inter text-sm font-normal text-[#314158]">
            Total Enrollments
          </span>
          <span className="font-inter text-2xl font-semibold leading-[38px] text-[#020618]">
            {total}
          </span>
        </div>
      </div>

      {/* Separator - Visible only on Desktop */}
      <div className="hidden lg:block h-14 w-px bg-slate-200" />

      {/* Direct Enrollments */}
      <div className="flex flex-1 items-center gap-4">
        <div className="flex items-center justify-center p-4 rounded-lg bg-slate-100">
          <i className="circle-check h-6 w-6 text-slate-600" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-inter text-sm font-normal leading-5 text-slate-700">
            Direct Enrollments
          </span>
          <span className="font-inter text-2xl font-semibold leading-[38px] text-slate-950">
            {direct}
          </span>
        </div>
      </div>

      {/* Separator - Visible only on Desktop */}
      <div className="hidden lg:block h-14 w-px bg-slate-200" />

      {/* Referral Enrollments */}
      <div className="flex flex-1 items-center gap-4">
        <div className="flex items-center justify-center p-4 rounded-lg bg-slate-100">
          <i className="referral-icon h-6 w-6 text-slate-600" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-inter text-sm font-normal leading-5 text-slate-700">
            Referral Enrollments
          </span>
          <span className="font-inter text-2xl font-semibold leading-[38px] text-slate-950">
            {referral}
          </span>
        </div>
      </div>
    </div>
  );
}
