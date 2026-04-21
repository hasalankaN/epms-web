"use client";

import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateLecturerProfile } from "@/hooks/api/lecturers/useUpdateLecturerProfile";
import type { LecturerOwnProfile } from "@/hooks/api/lecturers/useGetLecturerProfile";

interface AssignedItem {
  name: string;
  category: string;
}

interface AccountDetailsSectionProps {
  initialData?: LecturerOwnProfile;
  session?: any;
  assignedCourses: AssignedItem[];
  assignedBatches: AssignedItem[];
  isLoadingAssignments?: boolean;
}

export function AccountDetailsSection({ 
  initialData, 
  session, 
  assignedCourses, 
  assignedBatches,
  isLoadingAssignments
}: AccountDetailsSectionProps) {
  const [gender, setGender] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const { mutate: updateProfile, isPending } = useUpdateLecturerProfile();

  useEffect(() => {
    if (initialData && mobileNumber === "" && whatsappNumber === "") {
      setGender(initialData.gender);
      setMobileNumber(initialData.mobileNumber?.replace(/^(\+94|94|0)/, "") || "");
      setWhatsappNumber(initialData.whatsappNumber?.replace(/^(\+94|94|0)/, "") || "");
    }
  }, [initialData, mobileNumber, whatsappNumber]);

  const handleSave = () => {
    const cleanMobile = mobileNumber.replace(/\D/g, "").replace(/^(94|0)/, "");
    const cleanWhatsapp = whatsappNumber.replace(/\D/g, "").replace(/^(94|0)/, "");

    const payload = {
      mobileNumber: `+94${cleanMobile}`,
      whatsappNumber: `+94${cleanWhatsapp}`,
      profileImageUrl: initialData?.profileImageUrl || "",
    };

    console.log("Sending to Profile Update API:", payload);
    updateProfile(payload);
  };

  return (
    <div className="mt-0 space-y-10">
      <div className="max-w-[1000px]">
        <h3 className="text-[16px] font-bold text-[#1D293D] mb-5">General Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-[#1D293D]">First Name <span className="text-pink-600">*</span></Label>
            <Input disabled defaultValue={initialData?.firstName || ""} className="h-10 rounded-[8px] border-[#E2E8F0] bg-[#F8FAFC] cursor-not-allowed" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-[#1D293D]">Last Name <span className="text-pink-600">*</span></Label>
            <Input disabled defaultValue={initialData?.lastName || ""} className="h-10 rounded-[8px] border-[#E2E8F0] bg-[#F8FAFC] cursor-not-allowed" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-[#1D293D]">NIC <span className="text-pink-600">*</span></Label>
            <Input disabled defaultValue={initialData?.nic || ""} className="h-10 rounded-[8px] border-[#E2E8F0] bg-[#F8FAFC] cursor-not-allowed" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-[#1D293D]">Email <span className="text-pink-600">*</span></Label>
            <Input disabled defaultValue={initialData?.email || session?.user?.email || ""} className="h-10 rounded-[8px] border-[#E2E8F0] bg-[#F8FAFC] cursor-not-allowed" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-[#1D293D]">Phone Number <span className="text-pink-600">*</span></Label>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-2.5 h-10 border border-[#E2E8F0] rounded-[8px] bg-white min-w-[85px]">
                <img src="https://flagcdn.com/w20/lk.png" alt="LK" className="w-4 h-3" />
                <span className="text-[13px] font-medium">+94</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </div>
              <Input 
                value={mobileNumber} 
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="70 XXX XXXX"
                className="h-10 rounded-[8px] border-[#E2E8F0] flex-1" 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-[#1D293D]">Whatsapp Number <span className="text-pink-600">*</span></Label>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-2.5 h-10 border border-[#E2E8F0] rounded-[8px] bg-white min-w-[85px]">
                <img src="https://flagcdn.com/w20/lk.png" alt="LK" className="w-4 h-3" />
                <span className="text-[13px] font-medium">+94</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </div>
              <Input 
                value={whatsappNumber} 
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="70 XXX XXXX"
                className="h-10 rounded-[8px] border-[#E2E8F0] flex-1" 
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-3 pt-2">
            <Label className="text-[13px] font-semibold text-[#1D293D]">Gender <span className="text-pink-600">*</span></Label>
            <div className="flex items-center gap-[40px] h-5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="gender"
                  value="MALE" 
                  disabled
                  checked={gender === "MALE"} 
                  className="sr-only" 
                />
                <div className={cn(
                  "flex items-center justify-center w-4 h-4 rounded-full border border-[#0F172B] shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-all",
                  gender === "MALE" ? "bg-white" : "bg-transparent opacity-50"
                )}>
                  {gender === "MALE" && <div className="w-2 h-2 rounded-full bg-[#0F172B]" />}
                </div>
                <span className="text-[14px] leading-5 font-normal text-[#314158] font-[Inter]">Male</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="gender"
                  value="FEMALE" 
                  disabled
                  checked={gender === "FEMALE"} 
                  className="sr-only" 
                />
                <div className={cn(
                  "flex items-center justify-center w-4 h-4 rounded-full border border-[#0F172B] shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-all",
                  gender === "FEMALE" ? "bg-white" : "bg-transparent opacity-50"
                )}>
                  {gender === "FEMALE" && <div className="w-2 h-2 rounded-full bg-[#0F172B]" />}
                </div>
                <span className="text-[14px] leading-5 font-normal text-[#314158] font-[Inter]">Female</span>
              </label>
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <Button 
              onClick={handleSave}
              disabled={isPending}
              className="bg-[#E60076] hover:bg-[#C50065] text-white px-10 h-11 rounded-[8px] font-bold text-[13px] shadow-sm disabled:opacity-70"
            >
              {isPending ? "Saving..." : "Save Details"}
            </Button>
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-[#F1F5F9]" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div>
          <h3 className="text-[16px] font-bold text-[#1D293D] mb-5">Assigned Course</h3>
          <div className="space-y-4">
            {isLoadingAssignments ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[150px] bg-slate-100" />
                  <Skeleton className="h-3 w-[100px] bg-slate-50" />
                </div>
              ))
            ) : assignedCourses.length > 0 ? (
              assignedCourses.map((item, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-semibold text-[#1D293D]">{item.name}</span>
                  <span className="text-[12px] text-slate-400">{item.category}</span>
                </div>
              ))
            ) : (
              <span className="text-[13px] text-slate-400 italic">No assigned courses found.</span>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-[#1D293D] mb-5">Assigned Batch</h3>
          <div className="space-y-4">
            {isLoadingAssignments ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[150px] bg-slate-100" />
                  <Skeleton className="h-3 w-[100px] bg-slate-50" />
                </div>
              ))
            ) : assignedBatches.length > 0 ? (
              assignedBatches.map((item, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-semibold text-[#1D293D]">{item.name}</span>
                  <span className="text-[12px] text-slate-400">{item.category}</span>
                </div>
              ))
            ) : (
              <span className="text-[13px] text-slate-400 italic">No assigned batches found.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
