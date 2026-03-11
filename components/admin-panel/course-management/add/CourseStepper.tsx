"use client";

import React from "react";

import { FormStepper } from "@/components/common/FormStepper";

interface CourseStepperProps {
  currentStep: number;
}

const COURSE_STEPS = [
  { id: 1, label: "General Details" },
  { id: 2, label: "Fee Details" },
  { id: 3, label: "Commission Details" },
];

export function CourseStepper({ currentStep }: CourseStepperProps) {
  return (
    <FormStepper 
      currentStep={currentStep} 
      steps={COURSE_STEPS}
      scrollContainerId="course-form-container"
    />
  );
}
