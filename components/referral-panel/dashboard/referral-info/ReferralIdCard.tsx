"use client";

import React, { useState } from "react";

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

interface ReferralIdCardProps {
  name?: string;
  refId?: string;
}

const shareOptions = [
  { name: "Whatsapp", iconClass: "whatsapp-logo", platform: "whatsapp" },
  { name: "Messenger", iconClass: "messenger-logo", platform: "messenger" },
  { name: "Telegram", iconClass: "telegram-logo", platform: "telegram" },
  { name: "Email", iconClass: "email-icon", platform: "email" },
  { name: "Text", iconClass: "message-icon", platform: "sms" },
];

export function ReferralIdCard({ name = "My Name", refId = "Ref#12345" }: ReferralIdCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  const handleShare = (platform: string) => {
    const message = encodeURIComponent(`Hey! Use my referral code ${refId} to sign up for Binzo!`);
    const url = encodeURIComponent(window.location.origin);
    
    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${message}`;
        break;
      case "messenger":
        // Messenger web intent (note: usually needs an appId, but this is a common fallback)
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
    <div className="mt-6 flex w-full flex-col items-start rounded-lg border border-[#E2E8F0] bg-[linear-gradient(315deg,_#FFCFEA_0.35%,_#F8FAFC_99.65%)] p-3 shadow-sm sm:inline-flex sm:w-auto">
      <h2 className="font-sans text-base font-semibold leading-6 text-[#1D293D]">
        {name}
      </h2>
      
      <div className="mt-1 flex items-center gap-[10px]">
        <span className="font-sans text-xs font-medium leading-4 text-[#62748E]">
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

                  // Optional: Add toast notification here
                }}
              />
            )}
          </motion.div>
          <Dialog>
            <DialogTrigger asChild>
              <Share2 className="h-4 w-4 cursor-pointer text-[#62748E] transition-colors hover:text-[#1D293D]" />
            </DialogTrigger>
            <DialogContent 
              className="sm:max-w-[480px] rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-[0_2px_4px_0_rgba(0,0,0,0.08),0_3px_10px_0_rgba(0,0,0,0.10)]" 
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
                    className="flex flex-col items-center gap-2 group cursor-pointer sm:flex-1"
                    onClick={() => handleShare(option.platform)}
                  >
                    <div className="flex flex-col items-center justify-center transition-all duration-200 group-hover:scale-110 group-active:scale-95">
                      <i className={`${option.iconClass} h-8 w-8 text-[#45556C]`} />
                      <span className="mt-1 text-[11px] font-sans font-medium text-[#45556C] transition-colors group-hover:text-[#1D293D] whitespace-nowrap">
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
      
      <p className="mt-2 font-sans text-xs font-normal leading-4 text-[#1D293D]">
        Share your code via WhatsApp, sms to earn attractive privileges
      </p>
    </div>
  );
}

