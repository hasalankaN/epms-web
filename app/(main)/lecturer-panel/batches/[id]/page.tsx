"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ChevronLeft, Plus, Trash2, ChevronDown, ChevronUp, Edit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddVideoModal } from "@/components/lecturer-panel/batches/AddVideoModal";
import { AddMaterialModal } from "@/components/lecturer-panel/batches/AddMaterialModal";

// ─── Types ───────────────────────────────────────────────────────────────────
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
}

interface Week {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Semester {
  id: string;
  title: string;
  weeks: Week[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_STRUCTURE: Semester[] = [
  {
    id: "semester-1",
    title: "Semester 1",
    weeks: [
      {
        id: "s1-week-1",
        title: "Week 1",
        lessons: [
          { id: "s1-w1-l1", name: "Lesson 01: Introduction", materials: [{ date: "20/01/2026", title: "Intro Video.mp4", type: "Link", format: "Youtube" }] },
        ],
      },
    ],
  },
  {
    id: "semester-2",
    title: "Semester 2",
    weeks: [
      {
        id: "s2-week-1",
        title: "Week 1",
        lessons: [
          { id: "s2-w1-l1", name: "Lesson 01: Market Research", materials: [{ date: "20/01/2026", title: "Research Basics.pdf", type: "File", format: "PDF" }] },
        ],
      },
      {
        id: "s2-week-2",
        title: "Week 2",
        lessons: [
          {
            id: "s2-w2-l1",
            name: "Lessons 01: Lesson Name",
            isActive: true,
            materials: [
              { date: "20/01/2026", title: "Lesson 1 Explanation.mp4", type: "Link", format: "Youtube" },
              { date: "20/01/2026", title: "Lecture note.ppts", type: "File", format: "PPTX" },
            ],
          },
          {
            id: "s2-w2-l2",
            name: "Lessons 02: Lesson Name",
            isActive: true,
            materials: [
              { date: "20/01/2026", title: "Lesson 2 Explanation.mp4", type: "Link", format: "Youtube" },
              { date: "20/01/2026", title: "Lecture note.ppts", type: "File", format: "PPTX" },
              { date: "20/01/2026", title: "Tute Question.doc", type: "File", format: "DOC" },
              { date: "20/01/2026", title: "Data.csv", type: "File", format: "CSV" },
              { date: "20/01/2026", title: "Tute answer.pdf", type: "File", format: "PDF" },
            ],
          },
          {
            id: "s2-w2-l3",
            name: "Lessons 03: Lesson Name",
            isActive: false,
            materials: [{ date: "20/01/2026", title: "Notes.pdf", type: "File", format: "PDF" }],
          },
        ],
      },
      {
        id: "s2-week-3",
        title: "Week 3",
        lessons: [
          { id: "s2-w3-l1", name: "Lesson 01: Deep Dive", materials: [{ date: "20/01/2026", title: "Deep Dive.mp4", type: "Link", format: "Youtube" }] },
        ],
      },
      {
        id: "s2-week-4",
        title: "Week 4",
        lessons: [
          { id: "s2-w4-l1", name: "Lesson 01: Summary", materials: [{ date: "20/01/2026", title: "Summary.pdf", type: "File", format: "PDF" }] },
        ],
      },
    ],
  },
];

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
  const [expandedSemesters, setExpandedSemesters] = useState<string[]>(["semester-2"]);
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>(["s2-week-2"]);
  const [expandedLessons, setExpandedLessons] = useState<string[]>(["s2-w2-l2"]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  const toggle = (id: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(id) ? list.filter(i => i !== id) : [...list, id]);
  };

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
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"
          alt="Batch Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white">Batch Name</h1>
          <span className="w-fit bg-[#E6F0FF] text-[#0B5CFF] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
            Ongoing
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
              Lorem ipsum dolor sit amet consectetur. Quis tortor porttitor eget senectus. Non turpis duis ac proin turpis gravida.
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 border border-[#E2E8F0] rounded-[6px] p-6 bg-[#F8FAFC]">
            <MetaItem label="Level" value="Beginner" />
            <MetaItem label="Lecturer" value="Mr. Ruwan" avatar="https://i.pravatar.cc/150?u=ruwan" />
            <MetaItem label="Language" value="English" />
            <MetaItem label="Certificates" value="Available {Free}, {UK}" />
            <MetaItem label="Lesson Duration" value="2h" />
            <MetaItem label="Category" value="Online" />
            <MetaItem label="Start Date" value="2025.12.23" />
            <MetaItem label="End Date" value="2026.02.20" />
          </div>

          {/* Add New Semester Button */}
          <div>
            <Button className="flex items-center gap-2 bg-[#E60076] hover:bg-[#C50065] text-white font-semibold h-10 px-5 rounded-[6px]">
              <Plus className="h-4 w-4" />
              Add New Semester
            </Button>
          </div>

          {/* Semesters */}
          <div className="flex flex-col gap-4">
            {MOCK_STRUCTURE.map(semester => {
              const isSemExpanded = expandedSemesters.includes(semester.id);

              return (
                <div key={semester.id} className="flex flex-col gap-4">
                  {/* Semester Header */}
                  <div
                    className={cn(
                      "rounded-[10px] border px-4 h-[56px] flex items-center justify-between cursor-pointer transition-all shadow-sm",
                      isSemExpanded ? "border-[#90A1B9] border-[1.5px] bg-[#F1F5F9]" : "border-[#E2E8F0] bg-[#F8FAFC]"
                    )}
                    onClick={() => toggle(semester.id, expandedSemesters, setExpandedSemesters)}
                  >
                    <span className={cn("text-[15px] text-[#0F172B]", isSemExpanded ? "font-semibold" : "font-medium")}>
                      {semester.title}
                    </span>
                    <div className="flex items-center gap-3">
                      {isSemExpanded && (
                        <button
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0F172B] bg-white border border-[#E2E8F0] rounded-[6px] px-3 h-8 hover:bg-[#F1F5F9] shadow-sm"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add New
                        </button>
                      )}
                      {isSemExpanded ? <ChevronUp className="h-5 w-5 text-[#0F172B]" /> : <ChevronDown className="h-5 w-5 text-[#0F172B]" />}
                    </div>
                  </div>

                  {/* Weeks */}
                  {isSemExpanded && (
                    <div className="ml-6 flex flex-col gap-4 border-l-2 border-[#E2E8F0]/30 pl-4">
                      {semester.weeks.map(week => {
                        const isWeekExpanded = expandedWeeks.includes(week.id);

                        return (
                          <div key={week.id} className="flex flex-col gap-4">
                            {/* Week Header */}
                            <div
                              className={cn(
                                "rounded-[10px] border px-4 h-[72px] flex items-center justify-between cursor-pointer transition-all shadow-sm shrink-0",
                                isWeekExpanded ? "border-[#90A1B9] border-[1.5px] bg-[#F1F5F9]" : "border-[#E2E8F0] bg-[#F8FAFC]"
                              )}
                              onClick={() => toggle(week.id, expandedWeeks, setExpandedWeeks)}
                            >
                              <div className="flex flex-col">
                                <span className={cn("text-[14px] text-[#0F172B]", isWeekExpanded ? "font-semibold" : "font-medium")}>
                                  {week.title}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">
                                    <i className="book-open-text h-4 w-4 text-[#62748E]" />
                                    <span>{week.lessons.length.toString().padStart(2, "0")} Lessons</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Trash2
                                  className="h-5 w-5 text-[#FB2C36]"
                                  onClick={e => e.stopPropagation()}
                                />
                                {isWeekExpanded ? <ChevronUp className="h-5 w-5 text-[#0F172B]" /> : <ChevronDown className="h-5 w-5 text-[#0F172B]" />}
                              </div>
                            </div>

                            {/* Lessons */}
                            {isWeekExpanded && (
                              <div className="ml-6 flex flex-col gap-4 border-l-2 border-[#E2E8F0]/30 pl-4">
                                {week.lessons.map(lesson => {
                                  const isLessonExpanded = expandedLessons.includes(lesson.id);
                                  const videoCount = lesson.materials.filter(m => m.format === "Youtube").length;
                                  const materialCount = lesson.materials.length - videoCount;

                                  return (
                                    <div key={lesson.id} className="flex flex-col gap-4">
                                      {/* Lesson Row */}
                                      <div
                                        className={cn(
                                          "rounded-[8px] border px-4 h-[68px] flex items-center cursor-pointer transition-all",
                                          isLessonExpanded ? "border-[#FCCEE8] bg-[#FDF2F8]" : "border-[#E7E5E4] bg-transparent"
                                        )}
                                        onClick={() => toggle(lesson.id, expandedLessons, setExpandedLessons)}
                                      >
                                        <div className="flex flex-col flex-1 gap-1">
                                          <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-[#0F172B]">{lesson.name}</span>
                                            <div className="flex items-center gap-3">
                                              {/* Toggle Switch */}
                                              <div
                                                className={cn(
                                                  "w-[36px] h-[20px] rounded-full relative transition-colors p-[2px] flex items-center",
                                                  lesson.isActive ? "bg-[#16A34A] justify-end" : "bg-[#E2E8F0] justify-start"
                                                )}
                                                onClick={e => e.stopPropagation()}
                                              >
                                                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                              </div>
                                              {isLessonExpanded ? <ChevronUp className="h-5 w-5 text-[#0F172B]" /> : <ChevronDown className="h-5 w-5 text-[#0F172B]" />}
                                            </div>
                                          </div>
                                          {/* Badges */}
                                          <div className="flex items-center gap-2">
                                            {videoCount > 0 && (
                                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">
                                                <span>{videoCount.toString().padStart(2, "0")} Videos</span>
                                              </div>
                                            )}
                                            {materialCount > 0 && (
                                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#62748E]">
                                                <span>{materialCount.toString().padStart(2, "0")} Materials</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Lesson Expanded: Materials */}
                                      {isLessonExpanded && (
                                        <div className="ml-6 border-l-2 border-[#E2E8F0] pl-6 py-2 flex flex-col gap-6">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#45556C]">Lesson Materials</span>
                                            <div className="flex items-center gap-6 text-[12px] font-bold text-[#E60076]">
                                              <button 
                                                onClick={() => setIsVideoModalOpen(true)}
                                                className="flex items-center gap-2 hover:opacity-80"
                                              >
                                                <Plus className="h-4 w-4" /> Add New Video
                                              </button>
                                              <button 
                                                onClick={() => setIsMaterialModalOpen(true)}
                                                className="flex items-center gap-2 hover:opacity-80"
                                              >
                                                <Plus className="h-4 w-4" /> Add New Material
                                              </button>
                                              <button className="flex items-center gap-2 hover:opacity-80">
                                                <Plus className="h-4 w-4" /> Schedule Class
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
                                                  {lesson.materials.map((m, idx) => (
                                                    <MaterialRow key={idx} material={m} />
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}

                                {/* Add New (inside week) */}
                                <div className="flex justify-end">
                                  <button
                                    onClick={e => e.stopPropagation()}
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
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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

// ─── Material Row ─────────────────────────────────────────────────────────────
function MaterialRow({ material }: { material: Material }) {
  const icons: Record<string, React.JSX.Element> = {
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
        <div className="flex items-center gap-2">
          {material.type}
          {material.type === "Link" && (
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0F172B]">
              <path d="M11.875 2.5H0.625C0.459 2.5 0.3 2.566 0.183 2.683C0.066 2.8 0 2.959 0 3.125V14.375C0 14.541 0.066 14.7 0.183 14.817C0.3 14.934 0.459 15 0.625 15H11.875C12.041 15 12.2 14.934 12.317 14.817C12.434 14.7 12.5 14.541 12.5 14.375V3.125C12.5 2.959 12.434 2.8 12.317 2.683C12.2 2.566 12.041 2.5 11.875 2.5ZM11.25 13.75H1.25V3.75H11.25V13.75ZM15 0.625V11.875C15 12.041 14.934 12.2 14.817 12.317C14.7 12.434 14.541 12.5 14.375 12.5C14.209 12.5 14.05 12.434 13.933 12.317C13.816 12.2 13.75 12.041 13.75 11.875V1.25H3.125C2.959 1.25 2.8 1.184 2.683 1.067C2.566 0.95 2.5 0.791 2.5 0.625C2.5 0.459 2.566 0.3 2.683 0.183C2.8 0.066 2.959 0 3.125 0H14.375C14.541 0 14.7 0.066 14.817 0.183C14.934 0.3 15 0.459 15 0.625Z" fill="currentColor" />
            </svg>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-[12px] font-semibold text-[#0F172B]">
        <div className="flex items-center gap-2">{icons[material.format]} {material.format}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-3">
          <button className="text-[#90A1B9] hover:text-[#0B5CFF] p-1.5 bg-[#F8FAFC] rounded-full">
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button className="text-[#90A1B9] hover:text-red-500 p-1.5 bg-[#F8FAFC] rounded-full">
            <Trash2 className="h-3.5 w-3.5" />
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
