import React from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  disableLink?: boolean;
}

const Logo = ({ className, disableLink = false }: LogoProps) => {
  const logoContent = (
    <>
      <Image
        src="/desktop-logo.svg"
        alt="Binzo Logo"
        width={32}
        height={32}
        className="h-8 w-8 shrink-0"
      />
      <div className="flex flex-col justify-center overflow-hidden">
        <span
          className="truncate whitespace-nowrap text-base font-semibold leading-6 text-slate-950 dark:text-slate-50"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Binzo Institute
        </span>
        <span
          className="truncate whitespace-nowrap text-xs font-light leading-4 text-slate-400"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          v1.1.0
        </span>
      </div>
    </>
  );

  if (disableLink) {
    return <div className={cn("flex items-center gap-3", className)}>{logoContent}</div>;
  }

  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      {logoContent}
    </Link>
  );
};

export default Logo;
