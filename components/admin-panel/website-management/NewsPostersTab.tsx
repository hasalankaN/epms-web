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
import {
  useGetNewsPosts,
  useCreateNewsPost,
  useUpdateNewsPost,
  useDeleteNewsPost,
} from "@/hooks/api/website/useNewsPosts";

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

function NewsPosterItem({
  item,
  onClick,
  onDelete,
}: {
  item: NewsPoster;
  onClick: () => void;
  onDelete: () => void;
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
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 42.14%, rgba(0, 0, 0, 0.70) 96.66%), url(${item.imageUrl})`,
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
            "w-[110px] h-[40px] rounded-[8px] bg-white text-[#0F172B] font-inter text-sm font-semibold shadow-md border-none hover:bg-slate-50",
          )}
        >
          View News
        </Button>
      </div>

      {/* Delete Action (Top Right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
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
  const { data: apiPosts = [] } = useGetNewsPosts();
  const createNewsPost = useCreateNewsPost();
  const updateNewsPost = useUpdateNewsPost();
  const deleteNewsPost = useDeleteNewsPost();

  const [selectedItem, setSelectedItem] = useState<NewsPoster | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditItem = (item: NewsPoster, postId: string) => {
    setSelectedItem(item);
    setSelectedPostId(postId);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteNewsPost.mutate(itemToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        },
      });
    }
  };

  const handleSave = (data: any) => {
    const payload = {
      title: data.title,
      content: data.content,
      thumbnailUrl: data.thumbnailUrl,
      imageUrls: data.gallery?.filter(Boolean) ?? [],
    };

    if (selectedPostId) {
      updateNewsPost.mutate(
        { id: selectedPostId, ...payload },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            onAddClose();
            setSelectedItem(null);
            setSelectedPostId(null);
          },
        },
      );
    } else {
      createNewsPost.mutate(payload, {
        onSuccess: () => {
          setIsEditModalOpen(false);
          onAddClose();
        },
      });
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,218px)] gap-6"
      >
        {apiPosts.map((post) => {
          const item: NewsPoster = {
            id: 0,
            imageUrl: post.thumbnail_url ?? "",
            title: post.title,
            date: post.published_at
              ? new Date(post.published_at).toLocaleDateString("en-CA")
              : new Date(post.created_at).toLocaleDateString("en-CA"),
            content: post.content ?? "",
            images: post.images.map((img) => img.image_url),
          };

          return (
            <NewsPosterItem
              key={post.id}
              item={item}
              onClick={() => handleEditItem(item, post.id)}
              onDelete={() => handleDeleteClick(post.id)}
            />
          );
        })}
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
          setSelectedPostId(null);
        }}
        initialData={selectedItem}
        onSave={handleSave}
        isSubmitting={createNewsPost.isPending || updateNewsPost.isPending}
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
