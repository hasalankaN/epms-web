"use client";

import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { HrAttendanceView } from "@/components/hr/attendance/HrAttendanceView";

export default function HrAttendancePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HrAttendanceView />
    </Suspense>
  );
}

