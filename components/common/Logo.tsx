import React from "react";

import Link from "next/link";

import { Users } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  disableLink?: boolean;
}

const Logo = ({ className, disableLink = false }: LogoProps) => {
  const logoContent = (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-xs">
        <Users className="h-4 w-4 stroke-[2]" />
      </div>
      <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white font-sans">
        EPMS
      </span>
    </div>
  );

  if (disableLink) {
    return <div className={cn("inline-flex items-center", className)}>{logoContent}</div>;
  }

  return (
    <Link href="/" className={cn("inline-flex items-center", className)}>
      {logoContent}
    </Link>
  );
};

export default Logo;
