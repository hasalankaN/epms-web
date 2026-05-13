"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { motion } from "framer-motion";
import { ChevronLeft, Plus, Trash2, ChevronDown, ChevronUp, Copy } from "lucide-react";

import { toast } from "sonner";

import { useGetCourseById } from "@/hooks/api/courses/useGetCourseById";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AddVideoModal } from "@/components/lecturer-panel/batches/AddVideoModal";
import { AddMaterialModal } from "@/components/lecturer-panel/batches/AddMaterialModal";
import { AddTierModal } from "@/components/lecturer-panel/courses/AddTierModal";
import { useCreateTier } from "@/hooks/api/courses/useCreateTier";
import { useGetCourseTiers } from "@/hooks/api/courses/useGetCourseTiers";
import type { TierNode } from "@/hooks/api/courses/useGetCourseTiers";
import { useCreateMaterial } from "@/hooks/api/courses/useCreateMaterial";
import { useDeleteTier } from "@/hooks/api/courses/useDeleteTier";
import { useGetTierMaterials } from "@/hooks/api/courses/useGetTierMaterials";
import type { Material } from "@/hooks/api/courses/useGetTierMaterials";
import { useDeleteMaterial } from "@/hooks/api/courses/useDeleteMaterial";
import { useUpdateTier } from "@/hooks/api/courses/useUpdateTier";
import { Switch } from "@/components/ui/Switch";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useGetCourseById(id);
  const courseDetail = data;
  const generalDetails = courseDetail?.general_details;

  const [expandedIds, setExpandedIds] = useState<string[]>(["week-2", "lesson-02"]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [activeParentTier, setActiveParentTier] = useState<{ id: string | null; title: string | null } | null>(null);
  const [activeTierForContent, setActiveTierForContent] = useState<string | null>(null);

  const { data: realStructure, isLoading: isLoadingStructure } = useGetCourseTiers(id);

  const { mutate: createTier, isPending: isCreatingTier } = useCreateTier();
  const { mutate: createMaterial, isPending: isCreatingMaterial } = useCreateMaterial();

  const handleOpenAddTier = (parentId: string | null = null, parentTitle: string | null = null) => {
    setActiveParentTier({ id: parentId, title: parentTitle });
    setIsTierModalOpen(true);
  };

  const handleSaveTier = (data: { title: string; description: string }) => {
    createTier({
      course_id: id,
      parent_tier_id: activeParentTier?.id || null,
      title: data.title,
      description: data.description,
    }, {
      onSuccess: () => setIsTierModalOpen(false)
    });
  };

  const handleOpenAddVideo = (tierId: string) => {
    setActiveTierForContent(tierId);
    setIsVideoModalOpen(true);
  };

  const handleOpenAddMaterial = (tierId: string) => {
    setActiveTierForContent(tierId);
    setIsMaterialModalOpen(true);
  };

  const handleSaveVideo = (data: { title: string; url: string }) => {
    if (!activeTierForContent) return;
    createMaterial({
      tier_id: activeTierForContent,
      material_type: "VIDEO",
      title: data.title,
      content_url: data.url,
    }, {
      onSuccess: () => setIsVideoModalOpen(false)
    });
  };

  const handleSaveMaterial = (data: { title: string; url: string; fileName: string; format: string }) => {
    if (!activeTierForContent) return;
    createMaterial({
      tier_id: activeTierForContent,
      material_type: "FILE",
      title: data.title,
      content_url: data.url,
      file_name: data.fileName,
      file_format: data.format
    }, {
      onSuccess: () => setIsMaterialModalOpen(false)
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 lg:p-10 bg-[#FBFBFE] min-h-screen">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-[240px] w-full rounded-[12px]" />
          <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-8 space-y-8">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-16" />)}
              </div>
          </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 p-6 lg:p-10 bg-[#FBFBFE] min-h-screen"
    >
      {/* Back Button */}
      <motion.div variants={itemVariants}>
        <Link href="/lecturer-panel/courses" className="flex items-center gap-2 text-sm font-semibold text-[#0F172B] hover:opacity-80">
          <ChevronLeft className="h-5 w-5" />
          Back
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative w-full h-[240px] rounded-[12px] overflow-hidden">
        <Image 
          src={generalDetails?.cover_image_url || "https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200"} 
          alt="Course Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white">{generalDetails?.name || "Course Details"}</h1>
          <span className={cn(
              "w-fit text-[10px] font-bold px-3 py-1 rounded-full uppercase",
              courseDetail?.status === "ACTIVE" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF9C3] text-[#CA8A04]"
          )}>
            {courseDetail?.status || "Ongoing"}
          </span>
        </div>
      </motion.div>


      {/* Content Card Area */}
      <motion.div variants={itemVariants} className="bg-white rounded-[12px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="flex flex-col gap-8">
            {/* Description Area */}
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-medium text-[#90A1B9] uppercase tracking-wider">Short Description</span>
                <div 
                    className="tiptap text-sm text-[#45556C] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: generalDetails?.short_description || "No short description provided." }}
                />
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 border border-[#E2E8F0] rounded-[6px] p-6 bg-[#F8FAFC]">
                <MetaItem label="Level" value={generalDetails?.level || "N/A"} />
                <MetaItem 
                    label="Lecturer" 
                    value={generalDetails?.lecturer?.full_name || generalDetails?.lecturer?.email || "N/A"} 
                />
                <MetaItem label="Language" value={generalDetails?.language || "N/A"} />
                <MetaItem 
                    label="Certificates" 
                    value={generalDetails?.certificates?.map(c => `{${c.name}}`).join(", ") || "None"} 
                />
                <MetaItem label="Lesson Duration" value={`${generalDetails?.lesson_duration_hours || 0}h`} />
                <MetaItem label="Hierarchy Type" value={generalDetails?.hierarchy_type || "N/A"} />
                <MetaItem label="Start Date" value={generalDetails?.start_date || "N/A"} />
                <MetaItem label="End Date" value={generalDetails?.end_date || "N/A"} />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mt-4">
                {/* Video Intro */}
                <div className="flex flex-col gap-3 w-full lg:w-[460px] shrink-0">
                    <span className="text-sm font-semibold text-[#0F172B]">
                        Course Introduction Video <span className="text-red-500">*</span>
                    </span>
                    <div className="relative aspect-video bg-black rounded-[8px] overflow-hidden shadow-lg border border-[#E2E8F0]">
                        {generalDetails?.intro_video_url ? (
                            <video 
                                src={generalDetails.intro_video_url} 
                                controls 
                                className="w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-xs">
                                No intro video available
                            </div>
                        )}
                    </div>
                </div>

                {/* Long Description */}
                <div className="flex flex-1 flex-col gap-3">
                    <span className="text-[10px] font-medium text-[#90A1B9] uppercase tracking-wider">Long Description</span>
                    <div 
                        className="tiptap text-sm text-[#45556C] leading-[1.8] text-justify"
                        dangerouslySetInnerHTML={{ __html: generalDetails?.long_description || "No long description provided." }}
                    />
                </div>
            </div>

            {/* Course Structure */}
            <div className="flex flex-col gap-6 mt-12">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#0F172B]">Course Structure</h3>
                    <Button 
                        onClick={() => handleOpenAddTier(null, null)}
                        className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172B] font-semibold h-9 px-4 rounded-[6px] gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add New
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    {isLoadingStructure ? (
                        <div className="flex flex-col gap-4">
                            <Skeleton className="h-[72px] w-full rounded-[10px]" />
                            <Skeleton className="h-[72px] w-full rounded-[10px]" />
                        </div>
                    ) : realStructure && realStructure.length > 0 ? (
                        realStructure.map(node => (
                            <RecursiveSection 
                                key={node.id} 
                                item={node} 
                                expandedIds={expandedIds} 
                                onToggle={toggleExpand} 
                                onOpenVideo={handleOpenAddVideo}
                                onOpenMaterial={handleOpenAddMaterial}
                                onOpenAddSubTier={handleOpenAddTier}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#E2E8F0] rounded-[12px] bg-slate-50/50">
                            <p className="text-sm text-[#64748B] mb-2">No course structure defined yet.</p>
                            <Button 
                                variant="outline" 
                                onClick={() => handleOpenAddTier(null, null)}
                                className="text-[#E60076] border-[#E60076] hover:bg-[#FDF2F8]"
                            >
                                Get Started by Adding a Section
                            </Button>
                        </div>
                    )}
                </div>
            </div>
          </div>
      </motion.div>

      {/* Modals */}
      <AddVideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        onSave={handleSaveVideo}
        isLoading={isCreatingMaterial}
      />
      <AddMaterialModal 
        isOpen={isMaterialModalOpen} 
        onClose={() => setIsMaterialModalOpen(false)} 
        onSave={handleSaveMaterial}
        isLoading={isCreatingMaterial}
      />
      <AddTierModal 
        isOpen={isTierModalOpen}
        onClose={() => setIsTierModalOpen(false)}
        onSave={handleSaveTier}
        isLoading={isCreatingTier}
        parentTitle={activeParentTier?.title}
      />
    </motion.div>
  );
}

function RecursiveSection({ 
    item, 
    expandedIds, 
    onToggle,
    onOpenVideo,
    onOpenMaterial,
    onOpenAddSubTier
}: { 
    item: TierNode; 
    expandedIds: string[]; 
    onToggle: (id: string) => void;
    onOpenVideo: (id: string) => void;
    onOpenMaterial: (id: string) => void;
    onOpenAddSubTier: (parentId: string, parentTitle: string) => void;
}) {
    const { mutate: deleteTier, isPending: isDeleting } = useDeleteTier();
    const isExpanded = expandedIds.includes(item.id);
    
    // Backend strictly allows materials only at level 3. 
    // Tiers at level 1 and 2 are sections that can contain sub-tiers.
    const isSection = item.level < 3;

    // Call hook at top level, but enabled only for lessons (level 3)
    const { data: materials = [], isLoading: isLoadingMaterials } = useGetTierMaterials(
        item.id,
        !isSection && isExpanded
    );

    const { mutate: updateTier } = useUpdateTier();

    if (!isSection) {
        const lesson = item;
        const videoCount = materials.filter(m => m.material_type === "VIDEO").length;
        const materialCount = materials.length - videoCount;

        return (
            <div className="flex flex-col gap-4">
                <div className={cn(
                    "rounded-[8px] border px-4 h-[68px] flex items-center transition-all cursor-pointer",
                    isExpanded ? "border-[#FCCEE8] bg-[#FDF2F8]" : "border-[#E7E5E4] bg-transparent"
                )} onClick={() => onToggle(lesson.id)}>
                    <div className="flex items-center gap-4 w-full">

                        {/* Main Info Group (Name + Switch + Chevron) */}
                        <div className="flex flex-col flex-1 gap-1">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-[#0F172B]">{lesson.title}</span>
                                    {lesson.description && (
                                        <span className="text-xs text-[#64748B] font-normal border-l border-[#E2E8F0] pl-2 line-clamp-1 max-w-[300px]">
                                            {lesson.description}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {/* Show switch ONLY if it's the last level (Level 3) */}
                                    {item.level === 3 && (
                                        <Switch 
                                            checked={lesson.is_enabled} 
                                            onCheckedChange={(checked: boolean) => {
                                                updateTier({ id: lesson.id, payload: { is_enabled: checked } });
                                            }}
                                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                        />
                                    )}

                                    {/* Chevron */}
                                    {isExpanded ? (
                                        <ChevronUp className="h-5 w-5 text-[#0F172B]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#0F172B]" />
                                    )}
                                </div>
                            </div>

                            {/* Badges Container */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">
                                    <i className="video h-4 w-4 text-[#62748E]" />
                                    <span>Video {videoCount.toString().padStart(2, '0')}</span>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">
                                    <i className="books h-4 w-4 text-[#62748E]" />
                                    <span>Materials {materialCount.toString().padStart(2, '0')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            disabled={isDeleting}
                            onClick={(e) => { 
                                e.stopPropagation();

                                if (confirm(`Are you sure you want to delete this lesson: "${lesson.title}"?`)) {
                                    deleteTier(lesson.id);
                                }
                            }}
                            className="p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Trash2 className="h-5 w-5 text-[#FB2C36]" />
                        </button>
                    </div>
                </div>
                {isExpanded && (
                    <div className="ml-6 border-x border-b border-[#E2E8F0] rounded-b-[12px] p-6 bg-white/50 mt-[-1px] flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-[#45556C]">Lesson Materials</span>
                            <div className="flex items-center gap-6 text-[12px] font-bold text-[#E60076]">
                                <button onClick={() => onOpenVideo(item.id)} className="flex items-center gap-2 hover:opacity-80">
                                    <Plus className="h-4 w-4" /> Add New Video
                                </button>
                                <button onClick={() => onOpenMaterial(item.id)} className="flex items-center gap-2 hover:opacity-80">
                                    <Plus className="h-4 w-4" /> Add New Material
                                </button>
                            </div>
                        </div>
                        {isLoadingMaterials ? (
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : materials.length > 0 ? (
                            <div className="overflow-hidden rounded-[8px] border border-[#E2E8F0]">
                                <table className="w-full text-left">
                                    <thead className="bg-[#FFF1F8] text-[12px] font-bold text-[#0F172B]">
                                        <tr>
                                            <th className="px-6 py-3">Uploaded Date</th>
                                            <th className="px-6 py-3">Title</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Format</th>
                                            <th className="px-6 py-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {materials.map((m, idx) => <MaterialRow key={idx} material={m} />)}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-sm text-[#90A1B9] italic text-center py-4 bg-slate-50 rounded-lg">
                                No materials added to this lesson yet.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    const section = item;
    const itemsCount = section.children?.length || 0;

    return (
        <div className="flex flex-col gap-4">
            <div className={cn(
                "rounded-[10px] border px-4 h-[72px] flex items-center transition-all cursor-pointer shadow-sm shrink-0",
                isExpanded ? "border-[#90A1B9] border-[1.5px] bg-[#F1F5F9]" : "border-[#E2E8F0] bg-[#F8FAFC]"
            )} onClick={() => onToggle(section.id)}>
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "text-[14px] text-[#0F172B]",
                                isExpanded ? "font-semibold" : "font-medium"
                            )}>
                                {section.title}
                            </span>
                            {section.description && (
                                <span className="text-xs text-[#64748B] font-normal border-l border-[#E2E8F0] pl-2 line-clamp-1 max-w-[400px]">
                                    {section.description}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">
                                 <i className="book-open-text h-4 w-4 text-[#62748E]" />
                                <span>Lessons {itemsCount.toString().padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            disabled={isDeleting}
                            onClick={(e) => { 
                                e.stopPropagation();

                                if (confirm(`Are you sure you want to delete "${section.title}" and all its contents?`)) {
                                    deleteTier(section.id);
                                }
                            }}
                            className="p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Trash2 
                                className="h-5 w-5 text-[#FB2C36]" 
                            />
                        </button>
                        {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-[#0F172B]" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-[#0F172B]" />
                        )}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="ml-6 flex flex-col gap-4 border-x border-b border-[#E2E8F0] rounded-b-[12px] p-5 bg-white/50 mt-[-1px] shadow-sm">
                    {section.children?.map(subItem => (
                        <RecursiveSection 
                            key={subItem.id} 
                            item={subItem} 
                            expandedIds={expandedIds} 
                            onToggle={onToggle} 
                            onOpenVideo={onOpenVideo} 
                            onOpenMaterial={onOpenMaterial} 
                            onOpenAddSubTier={onOpenAddSubTier} 
                        />
                    ))}
                    {/* Only show "Add New" sub-tier button if level is less than 3 */}
                    {item.level < 3 && (
                        <div className="flex justify-end pt-2">
                            <button 
                                onClick={() => onOpenAddSubTier(item.id, item.title)}
                                className="flex items-center justify-center gap-2 w-[122px] h-[40px] bg-[#FDF2F8] border border-[#FCCEE8] shadow-sm rounded-[6px] transition-all hover:opacity-80 mt-2"
                            >
                                <Plus className="h-5 w-5 text-[#0F172B]" />
                                <span className="text-sm font-semibold text-[#0F172B]">Add New</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

function MaterialRow({ material }: { material: Material }) {
    const { mutate: deleteMaterial, isPending: isDeleting } = useDeleteMaterial();

    const icons: Record<string, React.ReactNode> = {
        VIDEO: <i className="youtube-logo h-5 w-5 text-[#45556C]" />,
        FILE: <i className="file-text h-5 w-5 text-[#45556C]" />,
        LINK: <i className="link h-5 w-5 text-[#45556C]" />,
        ZOOM: <i className="video h-5 w-5 text-[#45556C]" />,
    };

    const formatIcons: Record<string, React.ReactNode> = {
        PDF: <i className="file-pdf h-5 w-5 text-[#45556C]" />,
        PPTX: <i className="file-ppt h-5 w-5 text-[#45556C]" />,
        DOC: <i className="file-doc h-5 w-5 text-[#45556C]" />,
        CSV: <i className="file-csv h-5 w-5 text-[#45556C]" />,
        Youtube: <i className="youtube-logo h-5 w-5 text-[#45556C]" />,
    };

    const formattedDate = material.created_at
        ? new Date(material.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
          }).replace(/\//g, "/")
        : "-";

    return (
        <tr className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
            <td className="px-6 py-4 text-[13px] text-[#45556C]">{formattedDate}</td>
            <td className="px-6 py-4 text-[13px] font-medium text-[#0F172B]">{material.title}</td>
            <td className="px-6 py-4 text-[13px] text-[#45556C]">
                <div className="flex items-center gap-2">
                    {material.material_type === "VIDEO" ? "Link" : material.material_type} 
                    {(material.material_type === "LINK" || material.material_type === "VIDEO") && (
                        <button 
                            onClick={() => {
                                if (material.content_url) {
                                    navigator.clipboard.writeText(material.content_url);
                                    toast.success("Link copied to clipboard!");
                                }
                            }}
                            className="hover:opacity-70 transition-opacity"
                        >
                            <Copy className="h-4 w-4 text-[#64748B]" />
                        </button>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 text-[12px] font-semibold text-[#0F172B]">
                <div className="flex items-center gap-2">
                    {formatIcons[material.file_format || ""] || icons[material.material_type]} 
                    {material.file_format || (material.material_type === "VIDEO" ? "YouTube" : "Web")}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#F1F5F9] transition-colors">
                        <i className="edit-icon h-[10.94px] w-[10.94px] text-[#18181B]" />
                    </button>
                    <button 
                        disabled={isDeleting}
                        onClick={() => {
                            if (confirm(`Are you sure you want to delete "${material.title}"?`)) {
                                deleteMaterial(material.id);
                            }
                        }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#F1F5F9] transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="w-3.5 h-3.5 text-[#FB2C36]" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function MetaItem({ label, value, avatar }: { label: string; value: string; avatar?: string }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[120px]">
      <span className="text-[11px] font-medium text-[#90A1B9] uppercase">{label}</span>
      <div className="flex items-center gap-2">
        {avatar && <div className="relative h-6 w-6 rounded-full overflow-hidden shrink-0"><Image src={avatar} alt="" fill className="object-cover" /></div>}
        <span className="text-[14px] font-semibold text-[#0F172B]">{value}</span>
      </div>
    </div>
  );
}
