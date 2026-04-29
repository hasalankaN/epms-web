"use client";

import React, { Suspense, useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { HorizontalScrollContainer } from "@/components/common/HorizontalScrollContainer";

import { BannerManagementTab } from "@/components/admin-panel/website-management/BannerManagementTab";
import { GalleryManagementTab } from "@/components/admin-panel/website-management/GalleryManagementTab";
import { TestimonialsTab } from "@/components/admin-panel/website-management/TestimonialsTab";
import { NewsPostersTab } from "@/components/admin-panel/website-management/NewsPostersTab";
import { TermsAndConditionsTab } from "@/components/admin-panel/website-management/TermsAndConditionsTab";
import { AddBannerModal } from "@/components/admin-panel/website-management/modals/AddBannerModal";
import { AddAlbumModal } from "@/components/admin-panel/website-management/modals/AddAlbumModal";

export type WebsiteManagementTabType =
  | "hero-banner"
  | "section-banners"
  | "gallery-management"
  | "testimonials"
  | "news-posters"
  | "terms-and-conditions";

const tabs = [
  { value: "hero-banner", label: "Hero Banner" },
  { value: "section-banners", label: "Section Banners" },
  { value: "gallery-management", label: "Gallery Management" },
  { value: "testimonials", label: "Testimonials" },
  { value: "news-posters", label: "News & Posters" },
  { value: "terms-and-conditions", label: "Terms and Conditions" },
] as const;

function WebsiteManagementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") as WebsiteManagementTabType;

  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "hero-banner";

  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [isAddAlbumOpen, setIsAddAlbumOpen] = useState(false);
  const [isAddTestimonialOpen, setIsAddTestimonialOpen] = useState(false);

  const handleTabChange = (tabValue: WebsiteManagementTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tabValue);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-3 p-4 md:p-6">
      {/* Header Section */}
      <div className="sticky top-0 z-20 -mx-4 bg-white px-4 pb-4 md:-mx-6 md:px-6">
        <div className="flex items-center justify-between gap-4 flex-nowrap pt-2">
          {/* Tabs */}
          <div className="flex-1 overflow-hidden py-2">
            <HorizontalScrollContainer>
              <div className="inline-flex items-center gap-[19px]">
                {tabs.map((tab, index) => (
                  <React.Fragment key={tab.value}>
                    <button
                      onClick={() => handleTabChange(tab.value)}
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap transition-colors",
                        "font-inter text-[14px] leading-[20px]",
                        activeTab === tab.value
                          ? "text-[#F6339A] font-medium"
                          : "text-[#45556C] font-normal hover:text-[#0F172B]"
                      )}
                    >
                      {tab.label}
                    </button>
                    {index < tabs.length - 1 && (
                      <div className="h-[20px] w-[1px] shrink-0 bg-[#E2E8F0]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </HorizontalScrollContainer>
          </div>

          {/* Add Banner Button */}
          {(activeTab === "hero-banner" || activeTab === "section-banners") && (
            <button
              onClick={() => setIsAddBannerOpen(true)}
              className={cn(
                BUTTON_STYLES.primary.md,
                "text-sm font-semibold text-white px-3 md:px-4 shrink-0"
              )}
            >
              <Plus className="h-5 w-5 md:hidden" />
              <span className="hidden md:inline">Create New Banner</span>
            </button>
          )}

          {/* Add Album Button */}
          {activeTab === "gallery-management" && (
            <button
              onClick={() => setIsAddAlbumOpen(true)}
              className={cn(
                BUTTON_STYLES.primary.md,
                "text-sm font-semibold text-white px-3 md:px-4 shrink-0"
              )}
            >
              <Plus className="h-5 w-5 md:hidden" />
              <span className="hidden md:inline">Create New Album</span>
            </button>
          )}

          {/* Add Testimonial Button */}
          {activeTab === "testimonials" && (
            <button
              onClick={() => setIsAddTestimonialOpen(true)}
              className={cn(
                BUTTON_STYLES.primary.md,
                "text-sm font-semibold text-white px-3 md:px-4 shrink-0"
              )}
            >
              <Plus className="h-5 w-5 md:hidden" />
              <span className="hidden md:inline">Create New Testimonial</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "hero-banner" && <BannerManagementTab />}
      {activeTab === "section-banners" && <BannerManagementTab />}
      {activeTab === "gallery-management" && <GalleryManagementTab />}
      {activeTab === "testimonials" && (
        <TestimonialsTab 
          isAddOpen={isAddTestimonialOpen} 
          onAddClose={() => setIsAddTestimonialOpen(false)} 
        />
      )}
      {activeTab === "news-posters" && <NewsPostersTab />}
      {activeTab === "terms-and-conditions" && <TermsAndConditionsTab />}

      {/* Modals */}
      <AddBannerModal
        isOpen={isAddBannerOpen}
        onClose={() => setIsAddBannerOpen(false)}
      />
      <AddAlbumModal
        isOpen={isAddAlbumOpen}
        onClose={() => setIsAddAlbumOpen(false)}
        onCreate={(name, thumbnail) => {
          console.log("Creating album:", { name, thumbnail });

          // Handle creation logic here
        }}
      />
    </div>
  );
}

export default function WebsiteManagementPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#94A3B8]">Loading...</div>}>
      <WebsiteManagementContent />
    </Suspense>
  );
}
