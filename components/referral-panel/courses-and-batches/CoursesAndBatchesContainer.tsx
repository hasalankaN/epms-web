"use client";

import React from "react";

import { BatchesTabContent } from "./BatchesTabContent";
import { CoursesTabContent } from "./CoursesTabContent";
import type { CoursesAndBatchesTabType } from "@/app/(main)/referral-panel/courses-and-batches/page";

interface CoursesAndBatchesContainerProps {
  activeTab: CoursesAndBatchesTabType;
}

export function CoursesAndBatchesContainer({ activeTab }: CoursesAndBatchesContainerProps) {
  return (
    <div className="space-y-4">
      {activeTab === "batches" ? <BatchesTabContent /> : <CoursesTabContent />}
    </div>
  );
}
