"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { HrOrganizationView } from "@/components/hr/organization/HrOrganizationView";

export default function HrOrganizationPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HrOrganizationView />
    </Suspense>
  );
}

