"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { motion } from "framer-motion";
import { ChevronLeft, Plus, Trash2, ChevronDown, ChevronUp, Edit2 } from "lucide-react";

import { useGetCourseById } from "@/hooks/api/courses/useGetCourseById";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AddVideoModal } from "@/components/lecturer-panel/batches/AddVideoModal";
import { AddMaterialModal } from "@/components/lecturer-panel/batches/AddMaterialModal";

// Types for Dynamic Structure
type MaterialType = "File" | "Link";
type MaterialFormat = "Youtube" | "PPTX" | "DOC" | "CSV" | "PDF";

interface Material {
  date: string;
  title: string;
  type: MaterialType;
  format: MaterialFormat;
}

interface Lesson {
  id: string;
  name: string;
  materials: Material[];
  isActive?: boolean;
  isDisabled?: boolean;
}

interface StructureSection {
  id: string;
  title: string;
  type: "month" | "week";
  items: (StructureSection | Lesson)[];
  isActive?: boolean;
}

// Mock Data following the 4-stage hierarchy (Month > Week > Lesson > Materials)
const MOCK_STRUCTURE: StructureSection[] = [
      {
        id: "week-1",
        title: "Week 01",
        type: "week",
        items: [
          {
            id: "lesson-1",
            name: "Lesson 01: Introduction to Marketing",
            materials: [
              { date: "20/01/2026", title: "Intro Video.mp4", type: "Link", format: "Youtube" }
            ]
          }
        ]
      },
      {
        id: "week-2",
        title: "Week 02",
        type: "week",
        isActive: true,
        items: [
          {
            id: "lesson-01",
            name: "Lesson 01: Market Research",
            materials: [
                { date: "20/01/2026", title: "Research Basics.pdf", type: "File", format: "PDF" }
            ]
          },
          {
            id: "lesson-02",
            name: "Lesson 02: Lesson Name",
            isActive: true,
            materials: [
              { date: "20/01/2026", title: "Lesson 2 Explanation.mp4", type: "Link", format: "Youtube" },
              { date: "20/01/2026", title: "Lecture note.ppts", type: "File", format: "PPTX" },
              { date: "20/01/2026", title: "Tute Question.doc", type: "File", format: "DOC" },
              { date: "20/01/2026", title: "Data.csv", type: "File", format: "CSV" },
              { date: "20/01/2026", title: "Tute answer.pdf", type: "File", format: "PDF" },
            ]
          },
          {
            id: "lesson-04",
            name: "Lesson 01: Market Research",
            materials: [
            ]
          }

        ]
      }
    ];

const CustomLinkIcon = ({ className }: { className?: string }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <mask id="path-1-inside-1_2350_562" fill="white">
            <path d="M11.875 2.5H0.625C0.45924 2.5 0.300269 2.56585 0.183058 2.68306C0.0658481 2.80027 0 2.95924 0 3.125V14.375C0 14.5408 0.0658481 14.6997 0.183058 14.8169C0.300269 14.9342 0.45924 15 0.625 15H11.875C12.0408 15 12.1997 14.9342 12.3169 14.8169C12.4342 14.6997 12.5 14.5408 12.5 14.375V3.125C12.5 2.95924 12.4342 2.80027 12.3169 2.68306C12.1997 2.56585 12.0408 2.5 11.875 2.5ZM11.25 13.75H1.25V3.75H11.25V13.75ZM15 0.625V11.875C15 12.0408 14.9342 12.1997 14.8169 12.3169C14.6997 12.4342 14.5408 12.5 14.375 12.5C14.2092 12.5 14.0503 12.4342 13.9331 12.3169C13.8158 12.1997 13.75 12.0408 13.75 11.875V1.25H3.125C2.95924 1.25 2.80027 1.18415 2.68306 1.06694C2.56585 0.949731 2.5 0.79076 2.5 0.625C2.5 0.45924 2.56585 0.300269 2.68306 0.183058C2.80027 0.0658481 2.95924 0 3.125 0H14.375C14.5408 0 14.6997 0.0658481 14.8169 0.183058C14.9342 0.300269 15 0.45924 15 0.625Z" />
        </mask>
        <path d="M11.875 2.5H0.625C0.45924 2.5 0.300269 2.56585 0.183058 2.68306C0.0658481 2.80027 0 2.95924 0 3.125V14.375C0 14.5408 0.0658481 14.6997 0.183058 14.8169C0.300269 14.9342 0.45924 15 0.625 15H11.875C12.0408 15 12.1997 14.9342 12.3169 14.8169C12.4342 14.6997 12.5 14.5408 12.5 14.375V3.125C12.5 2.95924 12.4342 2.80027 12.3169 2.68306C12.1997 2.56585 12.0408 2.5 11.875 2.5ZM11.25 13.75H1.25V3.75H11.25V13.75ZM15 0.625V11.875C15 12.0408 14.9342 12.1997 14.8169 12.3169C14.6997 12.4342 14.5408 12.5 14.375 12.5C14.2092 12.5 14.0503 12.4342 13.9331 12.3169C13.8158 12.1997 13.75 12.0408 13.75 11.875V1.25H3.125C2.95924 1.25 2.80027 1.18415 2.68306 1.06694C2.56585 0.949731 2.5 0.79076 2.5 0.625C2.5 0.45924 2.56585 0.300269 2.68306 0.183058C2.80027 0.0658481 2.95924 0 3.125 0H14.375C14.5408 0 14.6997 0.0658481 14.8169 0.183058C14.9342 0.300269 15 0.45924 15 0.625Z" fill="currentColor" />
    </svg>
);

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

  const [expandedIds, setExpandedIds] = useState<string[]>(["month-1", "week-2", "lesson-02"]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

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
                    <Button className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172B] font-semibold h-9 px-4 rounded-[6px] gap-2">
                        <Plus className="h-4 w-4" />
                        Add New
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    {MOCK_STRUCTURE.map(section => (
                        <RecursiveSection 
                            key={section.id} 
                            item={section} 
                            expandedIds={expandedIds} 
                            onToggle={toggleExpand} 
                            onOpenVideo={() => setIsVideoModalOpen(true)}
                            onOpenMaterial={() => setIsMaterialModalOpen(true)}
                        />
                    ))}
                </div>
            </div>
          </div>
      </motion.div>

      {/* Modals */}
      <AddVideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        onSave={(data) => console.log("Saving video:", data)}
      />
      <AddMaterialModal 
        isOpen={isMaterialModalOpen} 
        onClose={() => setIsMaterialModalOpen(false)} 
        onSave={(data) => console.log("Saving material:", data)}
      />
    </motion.div>
  );
}

function RecursiveSection({ 
    item, 
    expandedIds, 
    onToggle,
    onOpenVideo,
    onOpenMaterial
}: { 
    item: StructureSection | Lesson; 
    expandedIds: string[]; 
    onToggle: (id: string) => void;
    onOpenVideo: () => void;
    onOpenMaterial: () => void;
}) {
    const isExpanded = expandedIds.includes(item.id);
    const isLesson = !('type' in item) || (item as any).type === undefined;

    if (isLesson) {
        const lesson = item as Lesson;
        const videoCount = lesson.materials.filter(m => m.format === "Youtube").length;
        const materialCount = lesson.materials.length - videoCount;

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
                                <span className="text-sm font-medium text-[#0F172B]">{lesson.name}</span>
                                
                                <div className="flex items-center gap-3">
                                    {/* Switch */}
                                    <div className={cn(
                                        "w-[36px] h-[20px] rounded-full relative transition-colors p-[2px] flex items-center",
                                        lesson.isActive ? "bg-[#16A34A] justify-end" : "bg-[#E2E8F0] justify-start"
                                    )}>
                                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>

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
                                {videoCount > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">
                                        <i className="video h-4 w-4 text-[#62748E]" />
                                        <span>Video {videoCount.toString().padStart(2, '0')}</span>
                                    </div>
                                )}
                                {materialCount > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">
                                        <i className="books h-4 w-4 text-[#62748E]" />
                                        <span>Materials {materialCount.toString().padStart(2, '0')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {isExpanded && (
                    <div className="ml-6 border-l-2 border-[#E2E8F0] pl-6 py-2 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-[#45556C]">Lesson Materials</span>
                            <div className="flex items-center gap-6 text-[12px] font-bold text-[#E60076]">
                                <button 
                                    onClick={onOpenVideo}
                                    className="flex items-center gap-2 hover:opacity-80"
                                >
                                    <Plus className="h-4 w-4" /> Add New Video
                                </button>
                                <button 
                                    onClick={onOpenMaterial}
                                    className="flex items-center gap-2 hover:opacity-80"
                                >
                                    <Plus className="h-4 w-4" /> Add New Material
                                </button>
                            </div>
                        </div>
                        {lesson.materials.length > 0 && (
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
                                        {lesson.materials.map((m, idx) => <MaterialRow key={idx} material={m} />)}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    const section = item as StructureSection;
    const itemsCount = section.items.length;

    return (
        <div className="flex flex-col gap-4">
            <div className={cn(
                "rounded-[10px] border px-4 h-[72px] flex items-center transition-all cursor-pointer shadow-sm shrink-0",
                isExpanded ? "border-[#90A1B9] border-[1.5px] bg-[#F1F5F9]" : "border-[#E2E8F0] bg-[#F8FAFC]"
            )} onClick={() => onToggle(section.id)}>
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                        <span className={cn(
                            "text-[14px] text-[#0F172B]",
                            isExpanded ? "font-semibold" : "font-medium"
                        )}>
                            {section.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">
                                 <i className="book-open-text h-4 w-4 text-[#62748E]" />
                                <span>Lessons {itemsCount.toString().padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Trash2 
                            className={cn(
                                "h-5 w-5 transition-colors",
                                isExpanded ? "text-[#FB2C36]" : "text-[#FB2C36] hover:text-[#FB2C36]"
                            )} 
                            onClick={(e) => { e.stopPropagation(); }}
                        />
                        {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-[#0F172B]" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-[#0F172B]" />
                        )}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="ml-6 flex flex-col gap-4 border-l-2 border-[#E2E8F0]/30 pl-4">
                    {section.items.map(subItem => (
                        <RecursiveSection 
                            key={subItem.id} 
                            item={subItem} 
                            expandedIds={expandedIds} 
                            onToggle={onToggle} 
                            onOpenVideo={onOpenVideo}
                            onOpenMaterial={onOpenMaterial}
                        />
                    ))}
                    <div className="flex justify-end">
                        <button 
                            onClick={(e) => { e.stopPropagation(); }}
                            className="flex items-center justify-center gap-2 w-[122px] h-[40px] bg-[#FDF2F8] border border-[#FCCEE8] shadow-sm rounded-[6px] transition-all hover:opacity-80 mt-2"
                        >
                            <Plus className="h-5 w-5 text-[#0F172B]" />
                            <span className="text-sm font-semibold text-[#0F172B]">Add New</span>
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

function MaterialRow({ material }: { material: Material }) {
    const icons = {
        Youtube: <i className="youtube-logo h-5 w-5 text-[#45556C]" />,
        PPTX: <i className="file-ppt h-5 w-5 text-[#45556C]" />,
        DOC: <i className="file-doc h-5 w-5 text-[#45556C]" />,
        CSV: <i className="file-csv h-5 w-5 text-[#45556C]" />,
        PDF: <i className="file-pdf h-5 w-5 text-[#45556C]" />,
    };

    return (
        <tr className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
            <td className="px-6 py-4 text-[13px] text-[#45556C]">{material.date}</td>
            <td className="px-6 py-4 text-[13px] font-medium text-[#0F172B]">{material.title}</td>
            <td className="px-6 py-4 text-[13px] text-[#45556C]">
                <div className="flex items-center gap-2">{material.type} {material.type === "Link" && <CustomLinkIcon className="h-3.5 w-3.5 text-[#0F172B]" />}</div>
            </td>
            <td className="px-6 py-4 text-[12px] font-semibold text-[#0F172B]">
                <div className="flex items-center gap-2">{icons[material.format]} {material.format}</div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                    <button className="text-[#90A1B9] hover:text-[#0B5CFF] p-1.5 bg-[#F8FAFC] rounded-full"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button className="text-[#90A1B9] hover:text-red-500 p-1.5 bg-[#F8FAFC] rounded-full"><Trash2 className="h-3.5 w-3.5" /></button>
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
