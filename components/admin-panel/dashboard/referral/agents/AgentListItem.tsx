"use client";

import React from "react";

import Image from "next/image";

interface AgentListItemProps {
  avatarUrl?: string;
  name: string;
  students: number;
  products: number;
  price: string;
  isLast?: boolean;
}

export function AgentListItem({
  avatarUrl,
  name,
  students,
  products,
  price,
  isLast = false,
}: AgentListItemProps) {
  return (
    <div
      className={`flex flex-col items-start gap-3 self-stretch px-2 pb-4 pt-2 ${
        !isLast ? "border-b border-[#E2E8F0]" : ""
      }`}
    >
      {/* Avatar and Name */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-400 to-purple-500">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-white">
              {name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>
        <span className="break-words font-sans text-[14px] font-medium leading-5 text-[#1D293D]">
          {name}
        </span>
      </div>

      {/* Stats and Price Row */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[12px] font-normal leading-4 text-[#45556C]">
            {students} Students
          </span>
          {/* Vertical Separator */}
          <div className="h-3 w-px bg-[#E2E8F0]" />
          <span className="font-sans text-[12px] font-normal leading-4 text-[#45556C]">
            {products} Products
          </span>
        </div>
        <span className="font-sans text-[14px] font-semibold leading-5 text-[#1D293D]">
          {price}
        </span>
      </div>
    </div>
  );
}
