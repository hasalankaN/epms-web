"use client";

import React, { useState } from "react";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import { Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { Button } from "@/components/ui/button";
import type { NewsPoster } from "@/types/website-management";
import { ViewAlbumModal } from "./modals/ViewAlbumModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { AddEditNewsPosterModal } from "./modals/AddEditNewsPosterModal";

const DUMMY_NEWS: NewsPoster[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop",
    title: "Monthly Newsletter",
    date: "2024.10.15",
    content: "Welcome to our October newsletter! This month we cover the new campus initiatives and student achievements.",
    images: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=400&fit=crop",
    title: "Annual Fest 2024",
    date: "2024.09.20",
    content: "Get ready for the biggest event of the year! The Annual Fest 2024 will feature live music, food stalls, and art exhibitions.",
    images: [
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1585829365234-784c05562d2a?w=400&h=400&fit=crop",
    title: "Sports Meet Poster",
    date: "2024.08.12",
    content: "Join us for the Inter-school Sports Meet! Competitions in football, basketball, and track & field starting next week.",
    images: [
      "https://images.unsplash.com/photo-1585829365234-784c05562d2a?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1503551723145-6c040742065b?w=400&h=400&fit=crop",
    title: "Tech Expo 2024",
    date: "2024.07.05",
    content: "Discover the latest innovations at Tech Expo 2024. Student projects on robotics, AI, and sustainable energy will be on display.",
    images: [
      "https://images.unsplash.com/photo-1503551723145-6c040742065b?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=400&fit=crop",
    title: "Exam Final Schedule",
    date: "2024.06.18",
    content: "The final exam schedule for the fall semester is now available. Please check the bulletin board for individual subject timings.",
    images: [
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=400&fit=crop",
    ]
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1454165833767-027ffea70c1d?w=400&h=400&fit=crop",
    title: "AI Workshop",
    date: "2024.05.22",
    content: "A hands-on workshop on Artificial Intelligence for beginners. Learn the basics of machine learning and data science.",
    images: [
      "https://images.unsplash.com/photo-1454165833767-027ffea70c1d?w=400&h=400&fit=crop",
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

function NewsPosterItem({ 
  item, 
  onClick,
  onDelete 
}: { 
  item: NewsPoster; 
  onClick: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="group relative flex h-[140px] w-full sm:max-w-[218px] cursor-pointer flex-col justify-end overflow-hidden rounded-md p-2.5 shadow-sm transition-all"
    >
      {/* Background Image with Gradient */}
      <div 
        className="absolute inset-0 bg-lightgray bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
        style={{ 
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 42.14%, rgba(0, 0, 0, 0.70) 96.66%), url(${item.imageUrl})` 
        }}
      />
      
      {/* Detail Section */}
      <div className="relative z-10 flex flex-col items-start gap-[2px]">
        <h3 className="font-inter text-[16px] font-medium leading-[24px] text-white overflow-hidden text-ellipsis whitespace-nowrap w-full">
          {item.title}
        </h3>
        <span className="font-inter text-[12px] font-normal leading-[16px] text-white">
          {item.date}
        </span>
      </div>

      {/* Hover Overlay (View Button) */}
      <div className="absolute inset-0 z-20 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={cn(
            BUTTON_STYLES.secondary.md,
            "w-[110px] h-[40px] rounded-[8px] bg-white text-[#0F172B] font-inter text-sm font-semibold shadow-md border-none hover:bg-slate-50"
          )}
        >
          View News
        </Button>
      </div>

      {/* Delete Action (Top Right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="absolute right-2 top-2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white opacity-0 transition-opacity duration-300 hover:bg-slate-50 group-hover:opacity-100 shadow-sm"
      >
        <Trash2 className="h-4 w-4 text-[#FB2C36]" />
      </button>
    </motion.div>
  );
}

interface NewsPostersTabProps {
  isAddOpen: boolean;
  onAddClose: () => void;
}

export function NewsPostersTab({ onAddClose }: NewsPostersTabProps) {
  const [selectedItem, setSelectedItem] = useState<NewsPoster | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const handleEditItem = (item: NewsPoster) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting item:", itemToDelete);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleSave = (data: any) => {
    console.log("Saving news/poster:", data);
    setIsEditModalOpen(false);
    onAddClose();
    setSelectedItem(null);
  };

  return (
    <div className="w-full">
      <motion.div 
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,218px)] gap-6"
      >
        {DUMMY_NEWS.map((item) => (
          <NewsPosterItem 
            key={item.id} 
            item={item} 
            onClick={() => handleEditItem(item)}
            onDelete={handleDeleteClick}
          />
        ))}
      </motion.div>

      <ViewAlbumModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        album={selectedItem}
      />

      {/* Edit Modal (Page handles Add now) */}
      <AddEditNewsPosterModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        initialData={selectedItem}
        onSave={handleSave}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete News/Poster"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Confirm Delete"
      />
    </div>
  );
}
