"use client";

import { Info, ArrowRight } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SettingsSectionProps {
  email?: string;
}

export function SettingsSection({ email = "user@gmail.com" }: SettingsSectionProps) {
  return (
    <div className="max-w-[800px]">
      <h3 className="text-[16px] font-bold text-[#1D293D] mb-5">Reset Password</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-[13px] font-semibold text-[#1D293D]">Logging Email <span className="text-pink-600">*</span></Label>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
          
          <p className="text-[12px] text-slate-500 bg-[#F8FAFC] p-3 rounded-[6px] border border-[#F1F5F9] leading-relaxed">
            We have sent a 4-digit code to your registered email for logging in.
          </p>

          <Input 
            placeholder="user@gmail.com" 
            defaultValue={email}
            className="h-11 rounded-[8px] border-[#E2E8F0] mt-3" 
          />
        </div>

        <Button className="bg-[#E60076] hover:bg-[#C50065] text-white px-6 h-11 rounded-[8px] font-bold text-[13px] flex items-center gap-2 group">
          Go to Next Step
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
