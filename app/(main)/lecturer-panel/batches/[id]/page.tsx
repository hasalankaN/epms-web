"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useParams } from "next/navigation";

import { motion } from "framer-motion";
import { ChevronLeft, Plus, Trash2, ChevronDown, ChevronUp, Copy, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddVideoModal } from "@/components/lecturer-panel/batches/AddVideoModal";
import { AddMaterialModal } from "@/components/lecturer-panel/batches/AddMaterialModal";
import { CreateTierModal } from "@/components/lecturer-panel/batches/CreateTierModal";
import { ScheduleClassModal } from "@/components/lecturer-panel/batches/ScheduleClassModal";

import { useGetBatchById } from "@/hooks/api/batches/useGetBatchById";
import type { TierNode } from "@/hooks/api/batches/useGetBatchTiers";
import { useGetBatchTiers } from "@/hooks/api/batches/useGetBatchTiers";
import { useCreateBatchTier } from "@/hooks/api/batches/useCreateBatchTier";
import type { Material as ApiMaterial } from "@/hooks/api/courses/useGetTierMaterials";
import { useGetTierMaterials } from "@/hooks/api/courses/useGetTierMaterials";
import { useCreateTierMaterial } from "@/hooks/api/courses/useCreateTierMaterial";
import { useDeleteMaterial } from "@/hooks/api/courses/useDeleteMaterial";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BatchDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: batch, isLoading, isError } = useGetBatchById(id);
  const { data: tiers, isLoading: isTiersLoading } = useGetBatchTiers(id);
  const createTierMutation = useCreateBatchTier(id);
  
  // States for Material Creation
  const [activeTierId, setActiveTierId] = useState<string | null>(null);
  const createMaterialMutation = useCreateTierMaterial(activeTierId || "");

  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
  // States for Tier Creation
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [activeParentTierId, setActiveParentTierId] = useState<string | null>(null);
  const [tierModalTitle, setTierModalTitle] = useState("Add New Semester");

  const toggle = (id: string) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAddTier = (parentId: string | null, level: number) => {
    setActiveParentTierId(parentId);
    setTierModalTitle(`Add New ${levelNames[level] || "Item"}`);
    setIsTierModalOpen(true);
  };

  const handleSaveTier = async (data: { title: string; description: string }) => {
    await createTierMutation.mutateAsync({
      batch_id: id,
      parent_tier_id: activeParentTierId,
      title: data.title,
      description: data.description
    });
    setIsTierModalOpen(false);
  };

  const handleSaveVideo = async (data: { title: string; url: string }) => {
    if (!activeTierId) return;
    await createMaterialMutation.mutateAsync({
      tier_id: activeTierId,
      material_type: "VIDEO",
      title: data.title,
      content_url: data.url
    });
    setIsVideoModalOpen(false);
  };

  const handleSaveMaterial = async (data: { title: string; url: string; fileName: string; format: string }) => {
    if (!activeTierId) return;
    await createMaterialMutation.mutateAsync({
      tier_id: activeTierId,
      material_type: "FILE",
      title: data.title,
      content_url: data.url,
      file_name: data.fileName,
      file_format: data.format
    });
    setIsMaterialModalOpen(false);
  };


  if (isLoading || isTiersLoading) {
    return (
      <div className="p-6 lg:p-10 space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-[240px] w-full rounded-[12px]" />
        <Skeleton className="h-[600px] w-full rounded-[12px]" />
      </div>
    );
  }

  if (isError || !batch) {
    return (
      <div className="p-6 lg:p-10 text-center py-20">
        <h2 className="text-xl font-bold text-red-500">Error loading batch details.</h2>
        <Link href="/lecturer-panel/batches" className="text-blue-500 underline mt-4 inline-block">Back to Batches</Link>
      </div>
    );
  }

  const hierarchy = batch.hierarchy;

  const levelNames = [
    hierarchy?.level_1_name || "Level 1",
    hierarchy?.level_2_name || "Level 2",
    hierarchy?.level_3_name || "Level 3",
    hierarchy?.level_4_name,
    hierarchy?.level_5_name,
  ].filter(Boolean) as string[];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 p-6 lg:p-10 bg-[#FBFBFE] min-h-screen"
    >
      {/* Back */}
      <motion.div variants={itemVariants}>
        <Link href="/lecturer-panel/batches" className="flex items-center gap-2 text-sm font-semibold text-[#0F172B] hover:opacity-80">
          <ChevronLeft className="h-5 w-5" />
          Back
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.div variants={itemVariants} className="relative w-full h-[240px] rounded-[12px] overflow-hidden">
        <Image
          src={batch.cover_image_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"}
          alt="Batch Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white">{batch.name}</h1>
          <span className="w-fit bg-[#E6F0FF] text-[#0B5CFF] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
            {batch.status}
          </span>
        </div>
      </motion.div>

      {/* Content Card */}
      <motion.div variants={itemVariants} className="bg-white rounded-[12px] border border-[#E2E8F0] p-8 shadow-sm">
        <div className="flex flex-col gap-8">

          {/* Short Description */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-medium text-[#90A1B9] uppercase tracking-wider">Short Description</span>
            <p className="text-sm text-[#45556C] leading-relaxed">
              {batch.description || "No description available for this batch."}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 border border-[#E2E8F0] rounded-[6px] p-6 bg-[#F8FAFC]">
            <MetaItem label="Level" value={batch.level || "Beginner"} />
            <MetaItem 
              label="Lecturer" 
              value={batch.lecturer_email?.split("@")[0] || "Mr. Ruwan"} 
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Ruwan"
            />
            <MetaItem label="Language" value={batch.language} />
            <MetaItem label="Certificates" value="Available {Free}, {UK}" />
            <MetaItem label="Lesson Duration" value={`${batch.lesson_duration}h`} />
            <MetaItem label="Category" value={batch.category} />
            <MetaItem label="Start Date" value={batch.start_date.split("-").join(".")} />
            <MetaItem label="End Date" value={batch.end_date.split("-").join(".")} />
          </div>

          {/* Curriculum Section (Dynamic Recursive Tiers) */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center">
              <Button 
                onClick={() => handleAddTier(null, 0)}
                className="flex items-center gap-2 bg-[#E60076] hover:bg-[#C50065] text-white font-semibold h-10 px-5 rounded-[6px]"
              >
                <Plus className="h-4 w-4" />
                Add New Semester
              </Button>
            </div>

            <div className="flex flex-col gap-8">
              {tiers?.filter(t => !t.parent_tier_id).map((tier, index, arr) => (
                <TierItem 
                  key={tier.id} 
                  tier={tier} 
                  level={1} 
                  maxTierCount={batch.tier_count}
                  levelNames={levelNames}
                  expandedIds={expandedIds}
                  onToggle={toggle}
                  onAddSubTier={handleAddTier}
                  onAddVideo={(tierId) => { setActiveTierId(tierId); setIsVideoModalOpen(true); }}
                  onAddMaterial={(tierId) => { setActiveTierId(tierId); setIsMaterialModalOpen(true); }}
                  onScheduleClass={(tierId) => { setActiveTierId(tierId); setIsScheduleModalOpen(true); }}
                  isLast={index === arr.length - 1}
                />
              ))}
              {(!tiers || tiers.length === 0) && !isTiersLoading && (
                <div className="text-center py-20 text-[#94A3B8] border-2 border-dashed border-[#E2E8F0] rounded-[12px] bg-[#F8FAFC]">
                  No tiers created yet for this batch.
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
        isLoading={createMaterialMutation.isPending}
      />
      <AddMaterialModal 
        isOpen={isMaterialModalOpen} 
        onClose={() => setIsMaterialModalOpen(false)} 
        onSave={handleSaveMaterial}
        isLoading={createMaterialMutation.isPending}
      />
      <ScheduleClassModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        tierId={activeTierId || ""}
        onSuccess={() => {
          // You can add a query invalidation here if needed, 
          // though the modal's hook already handles common ones.
        }}
      />
      <CreateTierModal
        isOpen={isTierModalOpen}
        onClose={() => setIsTierModalOpen(false)}
        onSave={handleSaveTier}
        title={tierModalTitle}
        isLoading={createTierMutation.isPending}
      />
    </motion.div>
  );
}

// ─── Recursive Tier Item ─────────────────────────────────────────────────────
interface TierItemProps {
  tier: TierNode;
  level: number;
  maxTierCount: number;
  levelNames: string[];
  expandedIds: string[];
  onToggle: (id: string) => void;
  onAddSubTier: (parentId: string | null, level: number) => void;
  onAddVideo: (tierId: string) => void;
  onAddMaterial: (tierId: string) => void;
  onScheduleClass: (tierId: string) => void;
  isLast?: boolean;
}

function TierItem({ tier, level, maxTierCount, levelNames, expandedIds, onToggle, onAddSubTier, onAddVideo, onAddMaterial, onScheduleClass, isLast }: TierItemProps) {
  const isExpanded = expandedIds.includes(tier.id);
  const isLeaf = level === maxTierCount;

  // For leaf nodes (lessons), we might want to fetch materials
  const { data: materials } = useGetTierMaterials(tier.id, isExpanded && isLeaf);

  if (level === 1) {
    // Level 1: Semester (Static Card Container)
    return (
      <div className="flex flex-col gap-6 p-6 rounded-[12px] border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-bold text-[#0F172B]">{tier.title}</span>
          <button 
            className="flex items-center gap-1.5 text-[14px] font-semibold text-[#0F172B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px] px-4 h-9 hover:bg-[#F1F5F9] transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {tier.children.map((child, index) => (
            <TierItem 
              key={child.id} 
              tier={child} 
              level={level + 1} 
              maxTierCount={maxTierCount} 
              levelNames={levelNames}
              expandedIds={expandedIds} 
              onToggle={onToggle}
              onAddSubTier={onAddSubTier}
              onAddVideo={onAddVideo}
              onAddMaterial={onAddMaterial}
              onScheduleClass={onScheduleClass}
              isLast={index === tier.children.length - 1}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isLeaf) {
    // Leaf Level: Lesson
    const videoCount = materials?.filter(m => m.material_type === "VIDEO" || m.material_type === "LINK").length || 0;
    const materialCount = (materials?.length || 0) - videoCount;

    return (
      <div className={cn("flex flex-col gap-4", isLast && "mr-3")}>
        <div
          className={cn(
            "rounded-[8px] border px-4 h-[68px] flex items-center cursor-pointer transition-all",
            isExpanded ? "border-[#FCCEE8] bg-[#FDF2F8]" : "border-[#E7E5E4] bg-transparent"
          )}
          onClick={() => onToggle(tier.id)}
        >
          <div className="flex flex-col flex-1 gap-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#0F172B]">{tier.title}</span>
              <div className="flex items-center gap-3">
                <div className={cn("w-[36px] h-[20px] rounded-full relative transition-colors p-[2px] flex items-center", tier.is_enabled ? "bg-[#16A34A] justify-end" : "bg-[#E2E8F0] justify-start")}>
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
                {isExpanded ? <ChevronUp className="h-5 w-5 text-[#0F172B]" /> : <ChevronDown className="h-5 w-5 text-[#0F172B]" />}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {videoCount > 0 && <span className="px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">{videoCount} Videos</span>}
              {materialCount > 0 && <span className="px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">{materialCount} Materials</span>}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className={cn(
            "ml-6 border-[#E2E8F0] pl-6 py-2 flex flex-col gap-6",
            isLast ? "border-l-2" : "border-l-2 border-b-2 border-r-2 rounded-b-[12px] pb-6"
          )}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#45556C]">Lesson Materials</span>
              <div className="flex items-center gap-8 text-[12px] font-bold text-[#E60076]">
                <button onClick={() => onAddVideo(tier.id)} className="flex items-center gap-2 hover:opacity-80 transition-all"><Plus className="h-4 w-4" /> Add New Video</button>
                <button onClick={() => onAddMaterial(tier.id)} className="flex items-center gap-2 hover:opacity-80 transition-all"><Plus className="h-4 w-4" /> Add New Material</button>
                <button onClick={() => onScheduleClass(tier.id)} className="flex items-center gap-2 hover:opacity-80 transition-all"><Plus className="h-4 w-4" /> Schedule Class</button>
              </div>
            </div>
            {materials && materials.length > 0 && (
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
                    {materials.map((m) => <MaterialRow key={m.id} material={m} />)}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", isLast && "mr-3")}>
      <div
        className={cn(
          "rounded-[10px] border px-4 h-[72px] flex items-center justify-between cursor-pointer transition-all shadow-sm shrink-0",
          isExpanded ? "border-[#90A1B9] border-[1.5px] bg-[#F1F5F9]" : "border-[#E2E8F0] bg-[#F8FAFC]"
        )}
        onClick={() => onToggle(tier.id)}
      >
        <div className="flex flex-col">
          <span className={cn("text-[14px] text-[#0F172B]", isExpanded ? "font-semibold" : "font-medium")}>
            {tier.title}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">
              <i className="book-open-text h-4 w-4 text-[#62748E]" />
              <span>{tier.children.length} {levelNames[level] || "Item"}s</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Trash2 className="h-5 w-5 text-[#FB2C36]" onClick={(e) => e.stopPropagation()} />
          {isExpanded ? <ChevronUp className="h-5 w-5 text-[#0F172B]" /> : <ChevronDown className="h-5 w-5 text-[#0F172B]" />}
        </div>
      </div>

      {isExpanded && (
        <div className={cn(
          "ml-6 flex flex-col gap-4 border-[#E2E8F0] pl-6",
          isLast ? "border-l-2" : "border-l-2 border-b-2 border-r-2 rounded-b-[12px] pb-6"
        )}>
          {tier.children.map((child, index) => (
            <TierItem 
              key={child.id} 
              tier={child} 
              level={level + 1} 
              maxTierCount={maxTierCount} 
              levelNames={levelNames}
              expandedIds={expandedIds} 
              onToggle={onToggle}
              onAddSubTier={onAddSubTier}
              onAddVideo={onAddVideo}
              onAddMaterial={onAddMaterial}
              onScheduleClass={onScheduleClass}
              isLast={index === tier.children.length - 1}
            />
          ))}
          {/* Add New Button at bottom right of children list */}
          <div className="flex justify-end mt-2 mr-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-[#FCCEE8] bg-[#FFF1F8] hover:bg-[#FDF2F8] text-[#E60076] font-semibold h-9 px-4 rounded-[8px]"
            >
              <Plus className="h-4 w-4" /> Add New
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Material Row ─────────────────────────────────────────────────────────────
function MaterialRow({ material }: { material: ApiMaterial }) {
  const deleteMutation = useDeleteMaterial();

  const handleCopyLink = (url: string | null) => {
    if (!url) {
      toast.error("No link available");
      
return;
    }

    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleDownload = (url: string | null, fileName: string | null) => {
    if (!url) {
      toast.error("No file URL available");
      
return;
    }

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const icons: Record<string, React.JSX.Element> = {
    VIDEO: <i className="youtube-logo h-5 w-5 text-[#45556C]" />,
    LINK: <i className="youtube-logo h-5 w-5 text-[#45556C]" />,
    FILE: <i className="file-doc h-5 w-5 text-[#45556C]" />,
    DEFAULT: <i className="file-doc h-5 w-5 text-[#45556C]" />,
  };

  const isVideoOrLink = material.material_type === "VIDEO" || material.material_type === "LINK";
  const isFile = material.material_type === "FILE";
  const format = material.file_format || (material.material_type === "VIDEO" ? "Youtube" : material.material_type);

  return (
    <tr className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
      <td className="px-6 py-4 text-[13px] text-[#45556C]">{new Date(material.created_at).toLocaleDateString()}</td>
      <td className="px-6 py-4 text-[13px] font-medium text-[#0F172B]">{material.title}</td>
      <td className="px-6 py-4 text-[13px] text-[#45556C]">
        {isVideoOrLink ? (
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#0F172B]">Link</span>
            <button 
              onClick={() => handleCopyLink(material.content_url)}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <Copy className="h-3.5 w-3.5 text-[#45556C]" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {material.material_type}
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-[12px] font-semibold text-[#0F172B]">
        <div className="flex items-center gap-2">
          {icons[material.material_type] || icons.DEFAULT} {format}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-3">
          {isFile && (
            <button 
              onClick={() => handleDownload(material.content_url, material.file_name)}
              className="text-[#0B5CFF] p-2 bg-[#F8FAFC] rounded-full hover:bg-blue-50 transition-colors"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#F1F5F9] transition-colors">
            <i className="edit-icon h-[10.94px] w-[10.94px] text-[#18181B]" />
          </button>
          <button 
            onClick={() => { if(confirm("Are you sure?")) deleteMutation.mutate(material.id); }}
            className="text-[#FB2C36] p-2 bg-[#F1F5F9] rounded-full  transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Meta Item ────────────────────────────────────────────────────────────────
function MetaItem({ label, value, avatar }: { label: string; value: string; avatar?: string }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[120px]">
      <span className="text-[11px] font-medium text-[#90A1B9] uppercase">{label}</span>
      <div className="flex items-center gap-2">
        {avatar && (
          <div className="relative h-6 w-6 rounded-full overflow-hidden shrink-0">
            <Image src={avatar} alt="" fill className="object-cover" />
          </div>
        )}
        <span className="text-[14px] font-semibold text-[#0F172B]">{value}</span>
      </div>
    </div>
  );
}
