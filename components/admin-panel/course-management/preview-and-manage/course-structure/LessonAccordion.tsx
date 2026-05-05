"use client";

import React, { useState } from "react";

import { ChevronDown, Trash2 } from "lucide-react";

import type { Lesson } from "@/types/courseStructure";
import { cn } from "@/lib/utils";

import { CountBadge } from "./CountBadge";
import { LessonMaterialsTable } from "./LessonMaterialsTable";
import { AddVideoModal } from "../../modals/AddVideoModal";
import { AddMaterialModal } from "../../modals/AddMaterialModal";

interface LessonAccordionProps {
  lesson: Lesson;
  isExpanded?: boolean;
  onToggle?: () => void;
  onUpdate?: (updates: Partial<Lesson>) => void;
  onDelete?: () => void;
}

export function LessonAccordion({
  lesson,
  isExpanded = false,
  onToggle,
  onUpdate,
  onDelete,
}: LessonAccordionProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [isActive, setIsActive] = useState(lesson.isActive);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(lesson.title);
  
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any | null>(null);

  const handleToggle = () => {
    if (isEditing) return;
    setExpanded(!expanded);
    onToggle?.();
  };

  const handleActiveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newActive = !isActive;

    setIsActive(newActive);
    onUpdate?.({ isActive: newActive });
  };

  const handleEditMaterial = (id: string) => {
    const material = lesson.materials.find(m => m.id === id);

    if (!material) return;

    setEditingMaterial(material);

    if (material.format === "Youtube") {
      setIsVideoModalOpen(true);
    } else {
      setIsMaterialModalOpen(true);
    }
  };

  const handleSaveVideo = (data: { youtubeLink: string; title: string }) => {
    if (editingMaterial) {
      const updatedMaterials = lesson.materials.map(m => 
        m.id === editingMaterial.id 
          ? { ...m, title: data.title, url: data.youtubeLink }
          : m
      );

      onUpdate?.({ materials: updatedMaterials });
    } else {
      const newMaterial = {
        id: `m-${Date.now()}`,
        uploadedDate: new Date().toLocaleDateString("en-GB"),
        title: data.title,
        type: "Link" as const,
        format: "Youtube" as const,
        url: data.youtubeLink,
      };

      onUpdate?.({
        materials: [...lesson.materials, newMaterial],
        videoCount: lesson.videoCount + 1,
      });
    }

    setEditingMaterial(null);
  };

  const handleSaveMaterial = (data: { title: string; file: File | null; url: string }) => {
    if (editingMaterial) {
      const updatedMaterials = lesson.materials.map(m => 
        m.id === editingMaterial.id 
          ? { 
              ...m, 
              title: data.title, 
              url: data.url || m.url, 
              format: data.file?.name.split(".").pop()?.toUpperCase() as any || m.format 
            }
          : m
      );

      onUpdate?.({ materials: updatedMaterials });
    } else {
      const newMaterial = {
        id: `m-${Date.now()}`,
        uploadedDate: new Date().toLocaleDateString("en-GB"),
        title: data.title,
        type: "File" as const,
        format: data.file?.name.split(".").pop()?.toUpperCase() as any || "PDF",
        url: data.url,
      };

      onUpdate?.({
        materials: [...lesson.materials, newMaterial],
        materialCount: lesson.materialCount + 1,
      });
    }

    setEditingMaterial(null);
  };

  const handleTitleSubmit = () => {
    setIsEditing(false);

    if (tempTitle.trim() !== lesson.title) {
      onUpdate?.({ title: tempTitle });
    }
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div className="flex flex-col">
      {/* Header Card */}
      <div 
        className={cn(
          "flex flex-col gap-[10px] p-2 cursor-pointer rounded-lg border border-[#E7E5E4] transition-all",
          expanded ? "bg-[#F8FAFC]" : "bg-transparent"
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 w-full">
            {isEditing ? (
              <input
                autoFocus
                className="font-inter text-[14px] font-normal leading-[20px] text-[#0F172B] bg-white border border-[#0F172B] rounded px-1 w-full max-w-[300px] outline-none"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span 
                className="font-inter text-[14px] font-normal leading-[20px] text-[#0F172B] hover:bg-slate-100 rounded px-1 transition-colors"
                onClick={handleTitleClick}
              >
                {lesson.title}
              </span>
            )}
            
            <div className="flex items-center gap-2 ml-auto">
              {/* Simple Toggle Switch */}
              <button
                title={isActive ? "Deactivate Lesson" : "Activate Lesson"}
                onClick={handleActiveToggle}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors shrink-0",
                  isActive ? "bg-[#22C55E]" : "bg-[#E2E8F0]"
                )}
              >
                <span 
                  className={cn(
                    "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                    isActive ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>

              {/* Delete Button */}
              <button 
                title="Delete Lesson"
                className="h-7 w-7 flex items-center justify-center rounded text-red-500 hover:bg-red-50 transition-colors shrink-0"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <ChevronDown className={cn("h-5 w-5 text-[#64748B] transition-transform shrink-0", expanded && "rotate-180")} />
            </div>
          </div>
        </div>

        {/* Info Badges */}
        {(lesson.materialCount > 0 || lesson.videoCount > 0) && (
          <div className="flex items-center gap-2">
            {lesson.videoCount > 0 && (
              <CountBadge variant="videos" count={lesson.videoCount} />
            )}
            {lesson.materialCount > 0 && (
              <CountBadge variant="materials" count={lesson.materialCount} />
            )}
          </div>
        )}
      </div>

      {/* Expanded Content - Outside of the card border */}
      {expanded && (
        <div className="flex pl-4 sm:pl-[40px] pr-2 pb-3 pt-3">
          {/* Vertical Line */}
          <div className="w-[2px] bg-[#E2E8F0] shrink-0 mr-3 sm:mr-[24.5px]" />
          
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <LessonMaterialsTable 
              materials={lesson.materials} 
              onAddVideo={() => {
                setEditingMaterial(null);
                setIsVideoModalOpen(true);
              }}
              onAddMaterial={() => {
                setEditingMaterial(null);
                setIsMaterialModalOpen(true);
              }}
              onEditMaterial={handleEditMaterial}
              onDeleteMaterial={(id) => {
                const updatedMaterials = lesson.materials.filter(m => m.id !== id);

                onUpdate?.({ materials: updatedMaterials });
              }}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <AddVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setEditingMaterial(null);
        }}
        onSave={handleSaveVideo}
        initialData={editingMaterial?.format === "Youtube" ? {
          title: editingMaterial.title,
          youtubeLink: editingMaterial.url || ""
        } : null}
      />
      <AddMaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => {
          setIsMaterialModalOpen(false);
          setEditingMaterial(null);
        }}
        onSave={handleSaveMaterial}
        initialData={editingMaterial && editingMaterial.format !== "Youtube" ? {
          title: editingMaterial.title,
          url: editingMaterial.url || ""
        } : null}
      />
    </div>
  );
}

