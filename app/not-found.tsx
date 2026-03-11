"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { ArrowLeft, LayoutDashboard } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const ANIMATION_URL = "https://cdn.prod.website-files.com/5d829bf092d4644f5c42e0ea/5e30966f17aaed84ffdadae2_ghost%20404.json";

export default function NotFound() {
  const router = useRouter();
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(ANIMATION_URL)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load Lottie animation", err));
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-4">
      {/* Animation Container */}
      <div className="w-full max-w-[400px] md:max-w-[500px]">
        {animationData ? (
          <Lottie animationData={animationData} loop={true} className="w-full h-full" />
        ) : (

          // Loading state placeholder with smooth pulse
          <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-50/50" />
        )}
      </div>
      
      {/* Content */}
      <div className="mt-8 flex flex-col items-center gap-8 text-center max-w-[600px]">
        <div className="flex flex-col gap-3">
          <h1 className="font-inter text-[32px] font-bold leading-[40px] text-[#0F172B] md:text-[48px] md:leading-[56px] tracking-tight">
            Page Not Found
          </h1>
          <p className="font-inter text-[16px] font-normal leading-[24px] text-[#64748B] md:text-[18px]">
            We couldn&apos;t find the page you were looking for. It might have been removed, renamed, or didn&apos;t exist in the first place.
          </p>
        </div>

        <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className={cn(BUTTON_STYLES.outline.md, "w-full sm:w-auto min-w-[160px] font-inter")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
          
          <Link
            href="/"
            className={cn(BUTTON_STYLES.primary.md, "w-full sm:w-auto min-w-[160px] font-inter")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
