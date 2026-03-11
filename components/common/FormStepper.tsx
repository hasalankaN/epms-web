"use client";

import React, { useEffect, useState, useRef } from "react";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StepConfig {
  id: number;
  label: string;
}

interface FormStepperProps {
  currentStep: number;
  steps: StepConfig[];
  scrollContainerId?: string;
}

export function FormStepper({ currentStep, steps, scrollContainerId = "form-container" }: FormStepperProps) {
  const currentStepData = steps.find((s) => s.id === currentStep);
  const totalSteps = steps.length;
  const [isCompressed, setIsCompressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const formContainer = document.getElementById(scrollContainerId);
      const mainContainer = document.querySelector('main .overflow-auto, main.overflow-auto');
      
      const containerScrollY = formContainer?.scrollTop || mainContainer?.scrollTop || window.scrollY;
      
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Debounce the state change
      timeoutRef.current = setTimeout(() => {
        if (containerScrollY > 100) {
          setIsCompressed(true);
        } else if (containerScrollY < 20) {
          setIsCompressed(false);
        }
      }, 50);
    };

    // Listen to window scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Listen to the form container
    const formContainer = document.getElementById(scrollContainerId);

    if (formContainer) {
      formContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Also listen to the main scrollable container
    const mainContainer = document.querySelector('main .overflow-auto, main.overflow-auto');

    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      window.removeEventListener('scroll', handleScroll);

      if (formContainer) {
        formContainer.removeEventListener('scroll', handleScroll);
      }

      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollContainerId]);

  useEffect(() => {
    if (!document.getElementById('form-stepper-animations')) {
      const styleSheet = document.createElement("style");

      styleSheet.id = 'form-stepper-animations';
      styleSheet.textContent = `
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
            filter: brightness(1);
          }
          50% {
            opacity: 0.9;
            filter: brightness(1.1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes pulse-ring {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
          }
        }

        @keyframes expand-width {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Container with fixed height based on state */}
      <div 
        className={cn(
          "relative w-full transition-all duration-500 ease-in-out",
          isCompressed ? "h-12" : "h-auto"
        )}
        style={{ minHeight: isCompressed ? '48px' : undefined }}
      >
        {/* Compressed View (shown when scrolling) */}
        <div 
          className={cn(
            "absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 md:px-6 transition-all duration-500 ease-in-out",
            isCompressed 
              ? "opacity-100 transform translate-y-0 z-10" 
              : "opacity-0 pointer-events-none transform -translate-y-1 z-0"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#90A1B9]">
              Step {currentStep}/{totalSteps}
            </span>
            <span className="text-sm font-semibold text-[#1D293D]">
              {currentStepData?.label}
            </span>
          </div>
          
          {/* Compressed Progress Bar */}
          <div className="flex gap-1.5 w-24">
            {steps.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div 
                  key={step.id}
                  className="h-1 flex-1 rounded-full bg-[#E2E8F0] overflow-hidden"
                >
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500 ease-out",
                      isCompleted && "w-full bg-[#F6339A]",
                      isActive && "w-full",
                      !isActive && !isCompleted && "w-0"
                    )}
                    style={isActive ? {
                      background: "linear-gradient(90deg, #EC4899 0%, #F472B6 50%, #FBCFE8 100%)"
                    } : undefined}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Full View (hidden when scrolling) */}
        <div className={cn(
          "transition-all duration-500 ease-in-out",
          isCompressed 
            ? "opacity-0 pointer-events-none transform translate-y-1" 
            : "opacity-100 transform translate-y-0"
        )}>
        {/* Mobile View: Standard Linear Progress */}
        <div className="flex flex-col gap-3 px-4 pb-8 pt-2 md:hidden">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
             <span 
               key={`mobile-step-${currentStep}`}
               className="text-xs font-semibold uppercase tracking-wider text-[#90A1B9] transition-all duration-500 ease-in-out animate-in fade-in"
             >
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <h3 
            key={`mobile-label-${currentStep}`}
            className="text-sm font-semibold text-[#1D293D] transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-right-3"
          >
            {currentStepData?.label}
          </h3>
        </div>
        
        {/* Mobile Segmented Progress Bar */}
        <div className="flex w-full gap-2">
            {steps.map((step) => {
               const isActive = step.id === currentStep;
               const isCompleted = step.id < currentStep;

               return (
                   <div 
                      key={step.id}
                      className="h-1.5 flex-1 rounded-full bg-[#E2E8F0] overflow-hidden relative"
                   >
                     <div
                       key={`fill-${step.id}-${currentStep}`}
                       className={cn(
                         "h-full rounded-full origin-left",
                         isCompleted && "w-full bg-[#F6339A]",
                         isActive && "w-full shadow-lg",
                         !isActive && !isCompleted && "w-0"
                       )}
                       style={isActive ? {
                         background: "linear-gradient(90deg, #EC4899 0%, #F472B6 50%, #FBCFE8 100%)",
                         animation: "expand-width 0.7s ease-out forwards"
                       } : undefined}
                     />
                   </div>
               );
            })}
        </div>
      </div>

      {/* Desktop View: Detailed Stepper */}
      <div className="hidden w-full overflow-x-auto pb-8 md:flex md:justify-start lg:justify-center">
        <div className="flex min-w-max items-center">
            {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isLast = index === steps.length - 1;

            return (
                <div
                key={step.id}
                className={cn(
                    "relative flex flex-col items-start justify-center gap-4 px-6 py-4",
                    "w-[278.75px]" 
                )}
                >
                {/* Desktop Progress Bar */}
                {!isLast && (
                    <div className="absolute right-[10.75px] top-[27px] h-[3px] w-[200px] rounded-[2px] bg-[#E2E8F0] overflow-hidden">
                      <div
                        key={`desktop-fill-${step.id}-${currentStep}`}
                        className={cn(
                          "h-full rounded-[2px] origin-left",
                          isCompleted && "w-full bg-[#F6339A]",
                          isActive && "w-full",
                          !isActive && !isCompleted && "w-0"
                        )}
                        style={isActive ? {
                          background: "linear-gradient(90deg, #EC4899 0%, #F472B6 50%, #FBCFE8 100%)",
                          animation: "expand-width 0.7s ease-out forwards"
                        } : undefined}
                      />
                    </div>
                )}

                <div className="relative z-10 flex items-center gap-4">
                    {/* Circle Indicator */}
                    <div
                    className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-500 ease-out transform",
                        isActive && "scale-110 shadow-lg",
                        isCompleted && "scale-100",
                        isActive
                        ? "border-[#EC4899]"
                        : isCompleted
                            ? "border-[#EC4899] bg-[#EC4899]"
                            : "border-[#E2E8F0] bg-[#E2E8F0]"
                    )}
                    >
                    {isActive && (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#EC4899] animate-in zoom-in duration-500" />
                    )}
                    {isCompleted && <Check className="h-3.5 w-3.5 text-white animate-in zoom-in duration-300" strokeWidth={3} />}
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-1 items-start">
                    <span className={cn(
                      "font-inter text-xs font-normal leading-4 text-[#90A1B9] transition-all duration-500 ease-out",
                      isActive && "font-semibold"
                    )}>
                    STEP {step.id}
                    </span>
                    <span className={cn(
                      "font-inter text-sm font-medium leading-5 text-[#1D293D] transition-all duration-500 ease-out",
                      isActive && "font-semibold scale-105 transform"
                    )}>
                    {step.label}
                    </span>
                </div>
                </div>
            );
            })}
        </div>
      </div>
      </div>
      </div>

      {/* Separator */}
      <div className="h-[1px] w-full bg-[#E2E8F0]" />
    </div>
  );
}
