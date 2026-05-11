"use client";

import React, { useState } from "react";

import { motion } from "framer-motion";

import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { useGetBanners, useDeleteBanner } from "@/hooks/api/website/useBanners";

import { BannerAccordionItem } from "./views/BannerManagement/BannerAccordionItem";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// =============================================
// Banner Management Tab
// =============================================

export function BannerManagementTab() {
  const { data: apiBanners = [] } = useGetBanners();
  const deleteBanner = useDeleteBanner();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openDeleteModal = (id: string) => {
    setBannerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (bannerToDelete !== null) {
      deleteBanner.mutate(bannerToDelete, {
        onSuccess: () => {
          if (expandedId === bannerToDelete) setExpandedId(null);
        },
      });
    }

    setIsDeleteModalOpen(false);
    setBannerToDelete(null);
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="flex flex-col items-end gap-4 w-full"
      >
        {apiBanners.map((apiBanner, index) => {
          const bannerItem = {
            id: index,
            bannerId: apiBanner.id,
            title: apiBanner.title ?? "",
            subTitle: apiBanner.sub_title ?? "",
            paragraph: apiBanner.paragraph ?? "",
            enableButtons: apiBanner.enable_buttons,
            numberOfButtons: (apiBanner.number_of_buttons === 2 ? 2 : 1) as
              | 1
              | 2,
            button1Text: apiBanner.button1_text ?? "",
            button1Link: apiBanner.button1_link ?? "",
            button2Text: apiBanner.button2_text ?? "",
            button2Link: apiBanner.button2_link ?? "",
            desktopImage: null,
            mobileImage: null,
          };

          return (
            <BannerAccordionItem
              key={apiBanner.id}
              banner={bannerItem}
              index={index}
              isExpanded={expandedId === apiBanner.id}
              onToggle={() => handleToggle(apiBanner.id)}
              onDelete={() => openDeleteModal(apiBanner.id)}
            />
          );
        })}
      </motion.div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this banner? This action cannot be undone."
        confirmText="Confirm Delete"
      />
    </>
  );
}
