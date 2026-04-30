"use client";

import React, { useState } from "react";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { Button } from "@/components/ui/button";
import type { Album } from "@/types/website-management";
import { ViewAlbumModal } from "./modals/ViewAlbumModal";

const DUMMY_ALBUMS: Album[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop",
    title: "Graduation 2023",
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1541339907198-e08756dea43f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop",
    title: "Event Night",
    images: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=400&h=400&fit=crop",
    title: "School Assembly",
    images: [
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1577891720206-8805b6db796f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1427501748790-84a8174495b5?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop",
    title: "Sports Meet",
    images: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop",
    title: "Classroom Activities",
    images: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1577891720206-8805b6db796f?w=400&h=400&fit=crop",
    title: "Science Fair",
    images: [
      "https://images.unsplash.com/photo-1577891720206-8805b6db796f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 7,
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop",
    title: "Library Sessions",
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 8,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    title: "Yoga & Wellness",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1510894347713-fc3ad6cb0322?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552196564-972b49ca2300?w=400&h=400&fit=crop",
    ]
  },
];

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
    }
  },
};

function GalleryItem({ album, onClick }: { album: Album; onClick: () => void }) {
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
            "w-[118px] h-[48px] rounded-[10px] bg-[#F1F5F9] text-[#0F172B] font-inter text-sm font-semibold shadow-none border-none hover:bg-white"
          )}
        >
          View Album
        </Button>
      </div>
    </motion.div>
  );
}

export function GalleryManagementTab() {
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
        {DUMMY_ALBUMS.map((album) => (
          <GalleryItem 
            key={album.id} 
            album={album} 
            onClick={() => handleViewAlbum(album)}
          />
        ))}
      </motion.div>

      <ViewAlbumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        album={selectedAlbum}
      />
    </div>
  );
}
