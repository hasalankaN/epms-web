"use client";

import React, { useState, useEffect } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

// import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { ForgotPasswordForm } from "@/components/auth/forgot-password/ForgotPasswordForm";
import { VerifyCodeForm } from "@/components/auth/forgot-password/VerifyCodeForm";
import { SetNewPasswordForm } from "@/components/auth/forgot-password/SetNewPasswordForm";

export default function ForgotPasswordPage() {
  // --- URL State Management ---
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const step = parseInt(searchParams.get("step") || "1", 10);

  // --- Component State ---
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    if (step === 2 && !email) {
      router.replace(`${pathname}?step=1`);
    } else if (step === 3 && !resetToken) {
      router.replace(`${pathname}?step=1`);
    }
  }, [step, email, resetToken, router, pathname]);


  // --- Handlers ---


  const handleEmailSubmit = async (submittedEmail: string) => {
    console.log("Requesting password reset for:", submittedEmail);
    setEmail(submittedEmail);
    router.push(`${pathname}?step=2`);
    toast.success(`A verification code has been sent to ${submittedEmail}`);
  };

  const handleCodeVerification = async (code: string) => {
    console.log("Verifying code:", code);
    setResetToken("dummy-verified-token");
    router.push(`${pathname}?step=3`);
    toast.success("Code verified successfully.");
  };

  const handlePasswordReset = async () => {
    console.log("Setting new password with token:", resetToken);
    toast.success("Password has been changed successfully!");
    router.push("/sign-in");
  };

  // --- Render Logic ---
  const renderStep = () => {
    switch (step) {
      case 1:
        return <ForgotPasswordForm onSubmit={handleEmailSubmit} />;
      case 2:
        return <VerifyCodeForm email={email} onSubmit={handleCodeVerification} />;
      case 3:
        return <SetNewPasswordForm onSubmit={handlePasswordReset} />;
      default:
        return <ForgotPasswordForm onSubmit={handleEmailSubmit} />;
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Back button removed as per design update 
      {step < 3 && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )} 
      */}
      {renderStep()}
    </div>
  );
}