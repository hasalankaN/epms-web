import React, { useState, useEffect } from "react";

import { GripVertical, Trash2 } from "lucide-react";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { AddEditTestimonialModal } from "./modals/AddEditTestimonialModal";
import {
  useGetTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useToggleTestimonialVisibility,
  useReorderTestimonials,
  type Testimonial as ApiTestimonial,
} from "@/hooks/api/website/useTestimonials";

interface Testimonial {
  id: string;
  text: string;
  studentName: string;
  studentInitials: string;
  isHidden?: boolean;
}

function toLocalTestimonial(t: ApiTestimonial): Testimonial {
  return {
    id: t.id,
    text: t.content,
    studentName: t.student_name,
    studentInitials: t.student_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
    isHidden: !t.is_visible,
  };
}

const avatarColors = [
  "#10B981", // Green
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
];

const getAvatarColor = (name: string) => {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

interface TestimonialsTabProps {
  isAddOpen: boolean;
  onAddClose: () => void;
}

export function TestimonialsTab({
  isAddOpen,
  onAddClose,
}: TestimonialsTabProps) {
  const { data: apiTestimonials = [] } = useGetTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const toggleVisibility = useToggleTestimonialVisibility();
  const reorderTestimonials = useReorderTestimonials();

  // Local order (optimistic for drag-drop)
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Sync ordered IDs when API data loads
  useEffect(() => {
    if (apiTestimonials.length) {
      setOrderedIds(apiTestimonials.map((t) => t.id));
    }
  }, [apiTestimonials]);

  const testimonials: Testimonial[] = orderedIds
    .map((id) => apiTestimonials.find((t) => t.id === id))
    .filter(Boolean)
    .map((t) => toLocalTestimonial(t as ApiTestimonial));

  // Modal State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);

  const [testimonialToEdit, setTestimonialToEdit] =
    useState<Testimonial | null>(null);

  // Deletion State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(
    null,
  );

  // Visibility State
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);

  const [testimonialToHide, setTestimonialToHide] = useState<string | null>(
    null,
  );

  // Handle outside trigger for adding
  useEffect(() => {
    if (isAddOpen) {
      setTestimonialToEdit(null);
      setIsAddEditModalOpen(true);
    }
  }, [isAddOpen]);

  const handleAddEditClose = () => {
    setIsAddEditModalOpen(false);
    setTestimonialToEdit(null);
    onAddClose();
  };

  const handleAddEditSubmit = (data: {
    studentName: string;
    content: string;
  }) => {
    if (testimonialToEdit) {
      updateTestimonial.mutate(
        {
          id: testimonialToEdit.id,
          studentName: data.studentName,
          content: data.content,
        },
        { onSuccess: handleAddEditClose },
      );
    } else {
      createTestimonial.mutate(
        { studentName: data.studentName, content: data.content },
        { onSuccess: handleAddEditClose },
      );
    }
  };

  const handleEditClick = (testimonial: Testimonial) => {
    setTestimonialToEdit(testimonial);
    setIsAddEditModalOpen(true);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    setOrderedIds((prev) => {
      const oldIndex = prev.indexOf(draggedId);
      const newIndex = prev.indexOf(targetId);
      const newOrder = [...prev];
      const [moved] = newOrder.splice(oldIndex, 1);

      newOrder.splice(newIndex, 0, moved);
      reorderTestimonials.mutate(
        newOrder.map((id, i) => ({ id, sortOrder: i })),
      );

      return newOrder;
    });
    setDraggedId(null);
  };

  const handleDeleteClick = (id: string) => {
    setTestimonialToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (testimonialToDelete) {
      deleteTestimonial.mutate(testimonialToDelete, {
        onSuccess: () => {
          setTestimonialToDelete(null);
          setIsDeleteModalOpen(false);
        },
      });
    }
  };

  const handleVisibilityToggle = (id: string, isCurrentlyHidden: boolean) => {
    if (isCurrentlyHidden) {
      toggleVisibility.mutate(id);
    } else {
      setTestimonialToHide(id);
      setIsHideModalOpen(true);
    }
  };

  const confirmHide = () => {
    if (testimonialToHide) {
      toggleVisibility.mutate(testimonialToHide, {
        onSuccess: () => {
          setTestimonialToHide(null);
          setIsHideModalOpen(false);
        },
      });
    }
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
        className="flex w-full flex-col items-stretch gap-4"
      >
        {testimonials.map((testimonial) => (
          <motion.div key={testimonial.id} variants={itemVariants}>
            <div
              className="flex w-full items-center gap-2"
              draggable
              onDragStart={(e) => handleDragStart(e, testimonial.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, testimonial.id)}
              onDragEnd={() => setDraggedId(null)}
            >
              {/* Drag Handle */}
              <div className="flex cursor-grab items-center justify-center text-[#90A1B9] hover:text-[#0F172B]">
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Card */}
              <div
                className={cn(
                  "flex flex-1 flex-col items-start p-3 rounded-lg border border-[#E2E8F0] bg-white transition-shadow gap-6",
                  draggedId === testimonial.id
                    ? "opacity-50 shadow-md"
                    : "shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
                  testimonial.isHidden && "opacity-75 bg-slate-50",
                )}
              >
                {/* Header Actions */}
                <div className="flex w-full items-center justify-end gap-2 self-stretch">
                  <button
                    onClick={() =>
                      handleVisibilityToggle(
                        testimonial.id,
                        !!testimonial.isHidden,
                      )
                    }
                    className="flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-[#0F172B] hover:bg-slate-50 transition-colors"
                  >
                    <i
                      className={cn(
                        "h-5 w-5",
                        testimonial.isHidden ? "eye-icon" : "eye-slash-icon",
                      )}
                    />
                    <span className="font-inter text-sm font-semibold leading-5">
                      {testimonial.isHidden ? "Show" : "Hide"}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(testimonial.id)}
                    className="flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-[#0F172B] hover:bg-slate-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="font-inter text-sm font-semibold leading-5">
                      Delete
                    </span>
                  </button>
                  <button
                    onClick={() => handleEditClick(testimonial)}
                    className="flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-[#0F172B] hover:bg-slate-50 transition-colors"
                  >
                    <i className="edit-icon h-4 w-4" />
                    <span className="font-inter text-sm font-semibold leading-5">
                      Edit
                    </span>
                  </button>
                </div>

                {/* Testimonial Content */}
                <div className="flex flex-col gap-4 w-full">
                  <p className="text-[#666] font-['Open_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
                    {testimonial.text}
                  </p>

                  {/* Student Info */}
                  <div className="flex w-full max-w-[270px] items-center gap-2 rounded-md">
                    <div
                      className="flex h-8 w-8 min-h-[32px] min-w-[32px] items-center justify-center rounded-full text-white"
                      style={{
                        backgroundColor: getAvatarColor(
                          testimonial.studentName,
                        ),
                      }}
                    >
                      <span className="font-inter text-[12px] font-medium leading-none tracking-wider">
                        {testimonial.studentInitials}
                      </span>
                    </div>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap font-['Open_Sans',sans-serif] text-[16px] font-semibold leading-[16px] text-[#1A1A1A]">
                      {testimonial.studentName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Confirm Delete"
      />

      <DeleteConfirmationModal
        isOpen={isHideModalOpen}
        onClose={() => setIsHideModalOpen(false)}
        onConfirm={confirmHide}
        title="Hide Testimonial"
        description="Are you sure you want to hide this testimonial?"
        confirmText="Yes, Hide"
        cancelText="Go Back"
      />

      <AddEditTestimonialModal
        isOpen={isAddEditModalOpen}
        onClose={handleAddEditClose}
        onSubmit={handleAddEditSubmit}
        initialData={
          testimonialToEdit
            ? {
                studentName: testimonialToEdit.studentName,
                content: testimonialToEdit.text,
              }
            : null
        }
      />
    </>
  );
}
