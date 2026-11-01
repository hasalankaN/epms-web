"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { HrProductionView } from "@/components/hr/production/HrProductionView";

export default function HrProductionPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HrProductionView />
    </Suspense>
  );
}

