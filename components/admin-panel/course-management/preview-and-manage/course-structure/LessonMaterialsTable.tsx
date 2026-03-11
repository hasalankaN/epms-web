"use client";

import React from "react";

import { Plus, Trash2, ExternalLink } from "lucide-react";

import type { LessonMaterial } from "@/types/courseStructure";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BUTTON_STYLES } from "@/lib/constants/theme";

interface LessonMaterialsTableProps {
  materials: LessonMaterial[];
  onAddVideo?: () => void;
  onAddMaterial?: () => void;
  onEditMaterial?: (id: string) => void;
  onDeleteMaterial?: (id: string) => void;
}

const formatIcons: Record<string, React.ReactNode> = {
  Youtube: <i className="youtube-logo h-5 w-5 text-[#45556C]" />,
  PPTX: <i className="file-ppt h-5 w-5 text-[#45556C]" />,
  DOC: <i className="file-doc h-5 w-5 text-[#45556C]" />,
  CSV: <i className="file-csv h-5 w-5 text-[#45556C]" />,
  PDF: <i className="file-pdf h-5 w-5 text-[#45556C]" />,
  MP4: <i className="video h-5 w-5 text-[#45556C]" />,
};

export function LessonMaterialsTable({
  materials,
  onAddVideo,
  onAddMaterial,
  onEditMaterial,
  onDeleteMaterial,
}: LessonMaterialsTableProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Header Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-inter text-[14px] font-medium leading-[20px] text-[#0F172B]">
          Lesson Materials
        </h3>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className={BUTTON_STYLES.ghost.sm}
            onClick={onAddVideo}
          >
            <Plus className="h-4 w-4" />
            <span className="inline sm:hidden">Video</span>
            <span className="hidden sm:inline">Add New Video</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={BUTTON_STYLES.ghost.sm}
            onClick={onAddMaterial}
          >
            <Plus className="h-4 w-4" />
            <span className="inline sm:hidden">Material</span>
            <span className="hidden sm:inline">Add New Material</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full table-fixed min-w-[600px]">
          <thead>
            <tr className="h-[36px] bg-[#FDF2F8]">
              <th className="w-[15%] px-4 py-2 text-left font-inter text-[14px] font-semibold leading-[20px] text-[#1D293D]">
                <div className="line-clamp-1">Uploaded Date</div>
              </th>
              <th className="w-[40%] px-4 py-2 text-left font-inter text-[14px] font-semibold leading-[20px] text-[#1D293D]">
                <div className="line-clamp-1">Title</div>
              </th>
              <th className="w-[15%] px-4 py-2 text-center font-inter text-[14px] font-semibold leading-[20px] text-[#1D293D]">
                <div className="line-clamp-1">Type</div>
              </th>
              <th className="w-[15%] px-4 py-2 text-center font-inter text-[14px] font-semibold leading-[20px] text-[#1D293D]">
                <div className="line-clamp-1">Format</div>
              </th>
              <th className="w-[15%] px-4 py-2 text-center font-inter text-[14px] font-semibold leading-[20px] text-[#1D293D]">
                <div className="line-clamp-1">Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr 
                key={material.id} 
                className="h-[44px] border-t border-[#E7E5E4] hover:bg-[#FFF9FC]"
              >
                <td className="px-4 py-2 font-inter text-[12px] font-medium leading-[16px] text-[#45556C]">
                  <div className="line-clamp-1">{material.uploadedDate}</div>
                </td>
                <td className="px-4 py-2 font-inter text-[12px] font-medium leading-[16px] text-[#45556C]">
                  <div className="line-clamp-1">{material.title}</div>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className={cn(
                    "inline-flex items-center gap-1 font-inter text-[12px] font-medium leading-[16px] justify-center w-full",
                    material.type === "Link" ? "text-[#45556C]" : "text-[#45556C]"
                  )}>
                    <span className="line-clamp-1">{material.type}</span>
                    {material.type === "Link" && <ExternalLink className="h-3 w-3 shrink-0" />}
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="inline-flex items-center gap-1.5 font-inter text-[12px] font-medium leading-[16px] text-[#45556C] justify-center w-full">
                    {formatIcons[material.format]}
                    <span className="line-clamp-1">{material.format}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      title="Edit Material"
                      className="h-8 w-8 flex items-center justify-center rounded-full bg-[#F1F5F9] text-black hover:bg-[#E2E8F0] transition-colors"
                      onClick={() => onEditMaterial?.(material.id)}
                    >
                      <i className="edit-icon h-[14px] w-[14px]" />
                    </button>
                    <button 
                      title="Delete Material"
                      className="h-8 w-8 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
                      onClick={() => onDeleteMaterial?.(material.id)}
                    >
                      <Trash2 className="h-[14px] w-[14px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

