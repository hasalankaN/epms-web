"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { HrTrainingView } from "@/components/hr/training/HrTrainingView";

export default function HrTrainingPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HrTrainingView />
    </Suspense>
  );
}

