import React from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  disableLink?: boolean;
  showText?: boolean;
  text?: string;
  size?: number;
}

const Logo = ({
  className,
  disableLink = false,
  showText = true,
  text = "Source Code",
  size = 32,
}: LogoProps) => {
  const logoContent = (
    <div className="flex items-center gap-2.5">
      <div
        className="relative shrink-0 overflow-hidden rounded-lg bg-white border border-neutral-200/80 shadow-xs"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Image
          src="/images/logo.jpg"
          alt="Logo"
          fill
          sizes={`${size}px`}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white font-sans">
          {text}
        </span>
      )}
    </div>
  );

  if (disableLink) {
    return (
      <div className={cn("inline-flex items-center", className)}>
        {logoContent}
      </div>
    );
  }

  return (
    <Link href="/" className={cn("inline-flex items-center", className)}>
      {logoContent}
    </Link>
  );
};

export default Logo;
