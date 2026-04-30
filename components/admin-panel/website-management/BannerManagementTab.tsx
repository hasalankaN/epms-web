"use client";

import React, { useState } from "react";

import { motion } from "framer-motion";

import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import type { BannerItem } from "@/types/website-management";
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
// Dummy Data
// =============================================

const DUMMY_BANNERS: BannerItem[] = [
  {
    id: 1,
    title: "",
    subTitle: "",
    paragraph: "",
    enableButtons: true,
    numberOfButtons: 1,
    button1Text: "",
    button1Link: "",
    button2Text: "",
    button2Link: "",
    desktopImage: null,
    mobileImage: null,
  },
  {
    id: 2,
    title: "Lorem Ipsum",
    subTitle: "Lorem Ipsum dollor",
    paragraph:
      "Lorem ipsum dolor sit amet consectetur. Elementum montes laoreet aliquam nibh adipiscing. Nec consequat venenatis nulla cras proin orci.",
    enableButtons: true,
    numberOfButtons: 2,
    button1Text: "Lorem Ipsum",
    button1Link: "gufugvfeFBIFBW/.LUI635497",
    button2Text: "Lorem Ipsum",
    button2Link: "gufugvfeFBIFBW/.LUI635497",
    desktopImage: null,
    mobileImage: null,
  },
  {
    id: 3,
    title: "",
    subTitle: "",
    paragraph: "",
    enableButtons: true,
    numberOfButtons: 1,
    button1Text: "",
    button1Link: "",
    button2Text: "",
    button2Link: "",
    desktopImage: null,
    mobileImage: null,
  },
];

// =============================================
// Banner Management Tab
// =============================================

export function BannerManagementTab() {
  const [banners, setBanners] = useState<BannerItem[]>(DUMMY_BANNERS);
  const [expandedId, setExpandedId] = useState<number | null>(null); // All banners collapsed by default
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openDeleteModal = (id: number) => {
    setBannerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (bannerToDelete !== null) {
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete));
      if (expandedId === bannerToDelete) setExpandedId(null);
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
        {banners.map((banner, index) => (
          <BannerAccordionItem
            key={banner.id}
            banner={banner}
            index={index}
            isExpanded={expandedId === banner.id}
            onToggle={() => handleToggle(banner.id)}
            onDelete={() => openDeleteModal(banner.id)}
          />
        ))}
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
