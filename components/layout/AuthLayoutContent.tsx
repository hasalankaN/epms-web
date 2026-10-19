"use client";

import React from "react";

import Image from "next/image";
import { usePathname } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export default function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/sign-in";

  return (
    <div className="flex min-h-screen w-full bg-white relative overflow-hidden">
      <div
        className={`flex w-full min-h-screen transition-all duration-500 ease-in-out ${
          isLoginPage ? "flex-col lg:flex-row" : "flex-col lg:flex-row-reverse"
        }`}
      >
        {/* Left Hero Section (Image 1 Left Side) */}
        <div className="hidden lg:flex lg:w-1/2 relative min-h-screen flex-col justify-between p-12 lg:p-16 bg-[#09090b] text-white overflow-hidden select-none">
          {/* Subtle Concentric Rings Pattern (Top Right) */}
          <div className="absolute -top-12 -right-12 w-[480px] h-[480px] pointer-events-none opacity-20">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
              <circle cx="360" cy="40" r="120" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="360" cy="40" r="200" stroke="currentColor" strokeWidth="1" />
              <circle cx="360" cy="40" r="280" stroke="currentColor" strokeWidth="1" />
              <circle cx="360" cy="40" r="360" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Top Brand Logo */}
          <div className="flex items-center gap-3 z-10">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white p-0.5 shadow-sm border border-white/20">
              <Image
                src="/images/logo.jpg"
                alt="Source Code Logo"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Source Code
            </span>
          </div>

          {/* Main Hero Content */}
          <div className="relative z-10 my-auto max-w-xl space-y-8 pr-4">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-[1.15]">
              People, performance and payroll in one place.
            </h1>

            <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-lg">
              Track attendance, approve leave, plan training, run evaluations and manage salaries with one system built around your team.
            </p>

            {/* Feature Bullets with Teal Checkmarks */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full text-teal-400">
                  <Check className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="text-sm text-neutral-300">Attendance and leave with simple approvals</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full text-teal-400">
                  <Check className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="text-sm text-neutral-300">Training, evaluations and KPI tracking</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full text-teal-400">
                  <Check className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="text-sm text-neutral-300">Payroll, payslips and internal job postings</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Tagline */}
          <div className="z-10 text-xs text-neutral-500 font-normal">
            Employee and Performance Management System
          </div>
        </div>

        {/* Right Form Section (Image 1 Right Side) */}
        <div className="flex w-full items-center justify-center lg:w-1/2 min-h-screen bg-white relative p-6 sm:p-12">
          {/* Mobile Header Branding */}
          <div className="absolute top-6 left-6 flex items-center gap-2.5 lg:hidden">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white border border-neutral-200/80 shadow-xs">
              <Image
                src="/images/logo.jpg"
                alt="Source Code Logo"
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-neutral-900 tracking-tight">
              Source Code
            </span>
          </div>

          <div className="w-full max-w-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
