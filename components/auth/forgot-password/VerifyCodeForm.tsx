"use client";

import React, { useState, useEffect } from "react";

import { toast } from "sonner";

import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";


interface Step2Props {
  email: string;
  onSubmit: (code: string) => void;
}

export function VerifyCodeForm({ email, onSubmit }: Step2Props) {
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    
return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    setIsResending(true);
    console.log("Resending code to", email);
    await new Promise((res) => setTimeout(res, 1500)); // Simulate API delay
    toast.success("A new verification code has been sent.");
    setCountdown(300); // Reset timer
    setIsResending(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}m: ${String(remainingSeconds).padStart(2, '0')}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 mt-4">
      <div className="flex flex-col items-center justify-center gap-2 max-w-[340px]">
        <h1 className={AUTH_TYPOGRAPHY.title}>Reset Password</h1>
        <p className={AUTH_TYPOGRAPHY.subtitle}>
            If an account exists for this email, you will receive an 4-digit code shortly with instructions. 
            If you didn&apos;t receive an email, please check the Spam folder.
        </p>
      </div>

      <InputOTP
        maxLength={4}
        value={code}
        onChange={(value) => {
          setCode(value);

          if (value.length === 4) {
            onSubmit(value);
          }
        }}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup className="gap-4">
          <InputOTPSlot index={0} className={AUTH_INPUT.otpSlot} />
          <InputOTPSlot index={1} className={AUTH_INPUT.otpSlot} />
          <InputOTPSlot index={2} className={AUTH_INPUT.otpSlot} />
          <InputOTPSlot index={3} className={AUTH_INPUT.otpSlot} />
        </InputOTPGroup>
      </InputOTP>

      <div className="w-full space-y-4">
        <Button
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className={cn(
            "w-full h-10 text-sm font-medium rounded-md transition-colors duration-200",
            countdown > 0 
                ? BUTTON_STYLES.secondary.disabled
                : BUTTON_STYLES.primary.full
          )}
        >
          {isResending ? "Sending..." : "Resend Code"}
        </Button>
        
        {countdown > 0 && (
          <p className="text-center">
            <span className={AUTH_TYPOGRAPHY.timerLabel}>Resend again: </span>
            <span className={AUTH_TYPOGRAPHY.timerText}>{formatTime(countdown)}</span>
          </p>
        )}
      </div>
    </div>
  );
}