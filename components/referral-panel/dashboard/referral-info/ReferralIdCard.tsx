"use client";

import React, { useState } from "react";

import Image from "next/image";

import { Check, Copy, Share2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  itemVariants,
  motion,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { RequestAmountModal } from "./modals/RequestAmountModal";

interface ReferralIdCardProps {
  name?: string;
  refId?: string;
  avatarUrl?: string;
  isLeader?: boolean;
  balance?: string;
}

const shareOptions = [
  { name: "Whatsapp", iconClass: "whatsapp-logo", platform: "whatsapp" },
  { name: "Messenger", iconClass: "messenger-logo", platform: "messenger" },
  { name: "Telegram", iconClass: "telegram-logo", platform: "telegram" },
  { name: "Email", iconClass: "email-icon", platform: "email" },
  { name: "Text", iconClass: "message-icon", platform: "sms" },
];

export function ReferralIdCard({
  name = "Amali Perera",
  refId = "Ref#12345",
  avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  isLeader = true,
  balance = "LKR 10,000.00",
}: ReferralIdCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleShare = (platform: string) => {
    const message = encodeURIComponent(`Hey! Use my referral code ${refId} to sign up for Binzo!`);
    const url = encodeURIComponent(window.location.origin);

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${message}`;
        break;
      case "messenger":
        shareUrl = `fb-messenger://share/?link=${url}&app_id=`;

        if (!/Android|iPhone|iPad/i.test(navigator.userAgent)) {
          shareUrl = `https://www.facebook.com/dialog/send?link=${url}&app_id=123456789&redirect_uri=${url}`;
        }

        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${message}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=Join me on Binzo&body=${message}`;
        break;
      case "sms":
        shareUrl = `sms:?body=${message}`;
        break;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <div className="flex h-auto min-h-[120px] w-full flex-col items-center justify-between gap-4 rounded-[20px] bg-[#FEDFC9] p-3 sm:h-[120px] sm:flex-row sm:gap-0">
      {/* Left Section: Details */}
      <div className="flex w-full flex-row items-center gap-3 sm:w-auto sm:gap-4">
        {/* Avatar */}
        <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full border-2 border-[#EC4899] bg-white sm:h-[88px] sm:w-[88px]">
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* Desktop-only Separator */}
        <div className="hidden h-[48px] w-[1px] bg-[#62748E] sm:block" />

        {/* Info Block */}
        <div className="flex flex-1 flex-col justify-center gap-1 sm:gap-3">
          <div className="flex flex-col items-start gap-1">
            <h2 className="font-sans text-[16px] font-semibold leading-tight text-[#020618] sm:text-[20px] sm:leading-8">
              {name}
            </h2>
            <div className="flex flex-wrap items-center gap-[6px]">
              {isLeader && (
                <div className="flex items-center gap-1 rounded-[32px] bg-black px-2 py-[2px] shadow-sm sm:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(16,24,40,0.1)]">
                  <span className="font-sans text-[10px] font-medium leading-tight text-white sm:text-[12px] sm:leading-4">
                    Team Leader
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 rounded-[32px] bg-[#16A34A] px-2 py-[2px] shadow-sm sm:shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
                <span className="font-sans text-[10px] font-medium leading-tight text-white sm:text-[12px] sm:leading-4">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* ID Row */}
          <div className="flex items-center gap-[10px]">
            <span className="font-sans text-[12px] font-medium leading-4 text-[#62748E] sm:text-[14px]">
              {refId}
            </span>
            <div className="flex items-center gap-[10px]">
              <motion.div
                initial={false}
                animate={{ scale: isCopied ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-pink-500" />
                ) : (
                  <Copy
                    className="h-4 w-4 cursor-pointer text-[#62748E] transition-colors hover:text-[#1D293D]"
                    onClick={() => {
                      navigator.clipboard.writeText(refId);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                  />
                )}
              </motion.div>
              <Dialog>
                <DialogTrigger asChild>
                  <Share2 className="h-4 w-4 cursor-pointer text-[#62748E] transition-colors hover:text-[#1D293D]" />
                </DialogTrigger>
                <DialogContent
                  className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-lg sm:max-w-[480px]"
                  animateChildren
                  closeClass="hidden"
                >
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-center font-sans text-sm font-medium text-[#0F172B]">
                      Share With
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-nowrap sm:items-center sm:justify-between sm:gap-2">
                    {shareOptions.map((option) => (
                      <motion.div
                        key={option.name}
                        variants={itemVariants}
                        className="group flex cursor-pointer flex-col items-center gap-2 sm:flex-1"
                        onClick={() => handleShare(option.platform)}
                      >
                        <div className="flex flex-col items-center justify-center transition-all duration-200 group-hover:scale-110 group-active:scale-95">
                          <i className={`${option.iconClass} h-8 w-8 text-[#45556C]`} />
                          <span className="mt-1 whitespace-nowrap font-sans text-[11px] font-medium text-[#45556C] transition-colors group-hover:text-[#1D293D]">
                            {option.name}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Payments */}
      <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:items-end sm:px-4">
        <div className="flex flex-1 flex-col items-start gap-[4px] rounded-lg bg-white p-3 shadow-sm sm:flex-none sm:min-w-[180px]">
          <span className="w-full text-center font-sans text-[10px] font-normal leading-tight text-[#45556C] sm:text-[12px] sm:leading-none">
            Available Balance Payments
          </span>
          <span className="w-full text-center font-sans text-[16px] font-bold leading-none text-black sm:text-[18px] sm:leading-none">
            {balance}
          </span>
        </div>
        <button 
          onClick={() => setIsRequestModalOpen(true)}
          className={cn(BUTTON_STYLES.primary.md, "h-[44px] flex-1 px-4 text-sm font-medium text-white shadow-sm transition-all active:scale-95 sm:h-[50px] sm:flex-none sm:px-6")}
        >
          Request
        </button>
        <RequestAmountModal 
          isOpen={isRequestModalOpen} 
          onClose={() => setIsRequestModalOpen(false)} 
        />
      </div>
    </div>
  );
}

