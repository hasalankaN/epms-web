"use client";

import React from "react";

import { FormStepper } from "@/components/common/FormStepper";

interface BatchStepperProps {
  currentStep: number;
}

const BATCH_STEPS = [
  { id: 1, label: "General Details" },
  { id: 2, label: "Fee Details" },
  { id: 3, label: "Commission Details" },
];

export function BatchStepper({ currentStep }: BatchStepperProps) {
  return (
    <FormStepper 
      currentStep={currentStep} 
      steps={BATCH_STEPS}
      scrollContainerId="batch-form-container"
    />
  );
}
