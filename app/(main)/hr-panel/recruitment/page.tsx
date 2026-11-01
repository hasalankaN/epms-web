"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { HrRecruitmentView } from "@/components/hr/recruitment/HrRecruitmentView";

export default function HrRecruitmentPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HrRecruitmentView />
    </Suspense>
  );
}

