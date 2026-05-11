"use client";

import React, { useState } from "react";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { Button } from "@/components/ui/button";
import type { Album } from "@/types/website-management";
import { ViewAlbumModal } from "./modals/ViewAlbumModal";
import { useGetAlbums } from "@/hooks/api/website/useGallery";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

function GalleryItem({
  album,
  onClick,
}: {
  album: Album;
  onClick: () => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="group relative flex h-[172px] w-[172px] shrink-0 items-center justify-center overflow-hidden rounded-lg shadow-sm"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-lightgray bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${album.imageUrl})` }}
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-center pb-6">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={cn(
            BUTTON_STYLES.secondary.md,
            "w-[118px] h-[48px] rounded-[10px] bg-[#F1F5F9] text-[#0F172B] font-inter text-sm font-semibold shadow-none border-none hover:bg-white",
          )}
        >
          View Album
        </Button>
      </div>
    </motion.div>
  );
}

export function GalleryManagementTab() {
  const { data: apiAlbums = [] } = useGetAlbums();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="grid grid-cols-[repeat(auto-fill,172px)] gap-6"
      >
        {apiAlbums.map((apiAlbum) => {
          const album: Album = {
            id: 0,
            imageUrl: apiAlbum.thumbnail_url ?? "",
            title: apiAlbum.name,
            images: (apiAlbum.images ?? []).map((img) => img.image_url),
          };

          return (
            <GalleryItem
              key={apiAlbum.id}
              album={album}
              onClick={() => handleViewAlbum(album)}
            />
          );
        })}
      </motion.div>

      <ViewAlbumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        album={selectedAlbum}
      />
    </div>
  );
}
