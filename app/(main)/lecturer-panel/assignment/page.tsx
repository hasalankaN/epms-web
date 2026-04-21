"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MoreVertical } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { CreateAssignmentModal } from "@/components/lecturer-panel/assignments/CreateAssignmentModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ViewAssessmentModal } from "@/components/lecturer-panel/assignments/ViewAssessmentModal";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NotReviewedItem {
  id: string;
  addedDate: string;
  studentName: string;
  type: string;
  courseBatchName: string;
  lessonTitle: string;
  submittedFileType: "PDF" | "Doc" | "PPTX" | "CSV";
}

interface ReviewedItem {
  id: string;
  addedDate: string;
  studentName: string;
  type: string;
  courseBatchName: string;
  lessonTitle: string;
  feedbackSubmittedDate: string;
}

interface UploadedAssignmentItem {
  id: string;
  uploadedDate: string;
  dueDate: string;
  type: string;
  completionRate: string;
  courseBatchName: string;
  lessonTitle: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const NOT_REVIEWED_DATA: NotReviewedItem[] = [
  { id: "1", addedDate: "2026/01/21", studentName: "name", type: "Course", courseBatchName: "Name", lessonTitle: "Lorem ipsum", submittedFileType: "PDF" },
  { id: "2", addedDate: "2026/01/21", studentName: "name", type: "Course", courseBatchName: "Name", lessonTitle: "Lorem ipsum", submittedFileType: "PDF" },
  { id: "3", addedDate: "2026/01/21", studentName: "name", type: "Course", courseBatchName: "Name", lessonTitle: "Lorem ipsum", submittedFileType: "PDF" },
  { id: "4", addedDate: "2026/01/21", studentName: "name", type: "Course", courseBatchName: "Name", lessonTitle: "Lorem ipsum", submittedFileType: "Doc" },
];

const REVIEWED_DATA: ReviewedItem[] = [
  { id: "1", addedDate: "2026/01/21", studentName: "name", type: "Course", courseBatchName: "Name", lessonTitle: "Lorem ipsum", feedbackSubmittedDate: "2026/03/21" },
  { id: "2", addedDate: "2026/01/21", studentName: "name", type: "Course", courseBatchName: "Name", lessonTitle: "Lorem ipsum", feedbackSubmittedDate: "2026/03/21" },
  { id: "3", addedDate: "2026/01/21", studentName: "name", type: "Course", courseBatchName: "Name", lessonTitle: "Lorem ipsum", feedbackSubmittedDate: "2026/03/21" },
  { id: "4", addedDate: "2026/01/21", studentName: "name", type: "Course", courseBatchName: "Name", lessonTitle: "Lorem ipsum", feedbackSubmittedDate: "2026/03/21" },
];

const UPLOADED_DATA: UploadedAssignmentItem[] = [
  { id: "1", uploadedDate: "2026/01/21", dueDate: "2026/02/21", type: "Course", completionRate: "35%", courseBatchName: "Name", lessonTitle: "Lorem ipsum" },
];

// ─── File Type Cell ────────────────────────────────────────────────────────────
function FileTypeCell({ fileType }: { fileType: string }) {
  const isPdf = fileType === "PDF";

  return (
    <div className="flex items-center gap-2 text-[13px] text-[#45556C]">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <path d="M14 2H6C5.47 2 4.96 2.21 4.59 2.59C4.21 2.96 4 3.47 4 4V20C4 20.53 4.21 21.04 4.59 21.41C4.96 21.79 5.47 22 6 22H18C18.53 22 19.04 21.79 19.41 21.41C19.79 21.04 20 20.53 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        {isPdf ? (
          <path d="M9 15H9.01M9 18H15M9 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        ) : (
          <path d="M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        )}
      </svg>
      {fileType}
    </div>
  );
}

// ─── Action Menu Cell ──────────────────────────────────────────────────────────
function ActionCell({ id, onView }: { id: string; onView: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          type="button"
          className="p-1 rounded hover:bg-[#F1F5F9] text-[#90A1B9] transition-colors outline-none"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[136px] min-w-[128px] p-1 bg-white border-[#E5E7EB] rounded-[6px] shadow-lg"
      >
        <DropdownMenuItem 
          id={`view_assignment_${id}`}
          className="h-[30px] px-2 flex items-center gap-2 text-[12px] text-[#314158] font-normal rounded-[6px] hover:bg-slate-100 transition-colors cursor-pointer focus:bg-slate-100 focus:outline-none"
          onSelect={(e) => {
            e.preventDefault();
            onView();
          }}
        >
          View
        </DropdownMenuItem>
        <DropdownMenuItem 
          id={`edit_assignment_${id}`}
          className="h-[30px] px-2 flex items-center gap-2 text-[12px] text-[#314158] font-normal rounded-[6px] hover:bg-slate-100 transition-colors cursor-pointer focus:bg-slate-100 focus:outline-none"
          onClick={() => { /* Handle edit */ }}
        >
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Lesson Title Cell ─────────────────────────────────────────────────────────
function LessonTitleCell({ title }: { title: string }) {
  return <span className="flex items-center text-[12px] font-medium leading-[16px] text-[#45556C]">{title}</span>;
}

// ─── Shared Search + Filter Bar ────────────────────────────────────────────────
function SearchFilterBar({ search, onSearch, showNew, onNewAssignment }: { search: string; onSearch: (v: string) => void; showNew?: boolean; onNewAssignment?: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 gap-4 border-b border-[#E2E8F0]">
      <div className="relative flex items-center">
        <Search className="absolute left-[12px] h-[20px] w-[20px] text-[#1D293D]" />
        <input
          id="assignment_search"
          type="text"
          placeholder="Search by Student name, Course or Batch name"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="h-[40px] w-[430px] rounded-[6px] border border-[#E2E8F0] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] bg-white pl-[40px] pr-[12px] py-[8px] text-[14px] leading-[20px] text-[#0F172B] placeholder:italic placeholder:text-[#90A1B9] focus:outline-none focus:ring-2 focus:ring-[#E60076]/20 focus:border-[#E60076]"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button
          id="filter_option_btn"
          variant="outline"
          className="flex items-center gap-2 h-9 px-4 rounded-[6px] border-[#E2E8F0] text-[13px] font-medium text-[#0F172B] hover:bg-[#F8FAFC]"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#62748E]" />
          Filter Option
        </Button>
        {showNew && (
          <Button
            id="new_assignment_btn"
            onClick={onNewAssignment}
            className="h-9 px-4 rounded-[6px] bg-[#E60076] hover:bg-[#C50065] text-white font-semibold text-[13px]"
          >
            New Assignment
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AssignmentPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const handleView = () => {
    setViewModalOpen(true);
  };

  // ─── Columns Definitions (Moved inside to access handleView) ───────────────────
  const notReviewedColumns: Column<NotReviewedItem>[] = [
    { header: "Added Date", accessorKey: "addedDate", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Student Name", accessorKey: "studentName", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Type", accessorKey: "type", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Course/Batch Name", accessorKey: "courseBatchName", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Lesson Title", cell: (item) => <LessonTitleCell title={item.lessonTitle} />, className: "px-4" },
    { header: "Submitted File Type", cell: (item) => <FileTypeCell fileType={item.submittedFileType} />, className: "px-4" },
    { header: "Action", cell: (item) => <ActionCell id={item.id} onView={() => handleView()} />, className: "px-4" },
  ];

  const reviewedColumns: Column<ReviewedItem>[] = [
    { header: "Added Date", accessorKey: "addedDate", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Student Name", accessorKey: "studentName", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Type", accessorKey: "type", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Course/Batch Name", accessorKey: "courseBatchName", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Lesson Title", cell: (item) => <LessonTitleCell title={item.lessonTitle} />, className: "px-4" },
    { header: "Feedback Submitted Date", accessorKey: "feedbackSubmittedDate", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Action", cell: (item) => <ActionCell id={item.id} onView={() => handleView()} />, className: "px-4" },
  ];

  const uploadedColumns: Column<UploadedAssignmentItem>[] = [
    { header: "Uploaded Date", accessorKey: "uploadedDate", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Due Date", accessorKey: "dueDate", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Type", accessorKey: "type", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Completion Rate", accessorKey: "completionRate", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Course/Batch Name", accessorKey: "courseBatchName", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Lesson Title", cell: (item) => <LessonTitleCell title={item.lessonTitle} />, className: "px-4" },
    { header: "Action", cell: (item) => <ActionCell id={item.id} onView={() => handleView()} />, className: "px-4" },
  ];

  const tabTriggerClass = cn(
    "h-7 rounded-[4px] px-3 text-[12px] font-medium text-[#62748E] bg-transparent",
    "data-[state=active]:bg-white data-[state=active]:text-[#1D293D] data-[state=active]:font-medium",
    "data-[state=active]:shadow-[0px_1px_2px_rgba(16,24,40,0.05)]",
    "data-[state=active]:rounded-[4px] transition-all"
  );


  const paginationProps = {
    variant: "simple" as const,
    currentPage: page,
    totalPages: 10,
    onPageChange: setPage,
    hideTotalCount: true,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-8"
    >
      <Tabs defaultValue="not-reviewed" className="w-full">
        {/* Tab Bar */}
        <div className="bg-white rounded-t-[12px]">
          <TabsList className="h-9 w-[492px] justify-start rounded-[6px] bg-[#F1F5F9] p-1 gap-0">
            <TabsTrigger id="tab_not_reviewed" value="not-reviewed" className={cn(tabTriggerClass, "w-[164px]")}>
              Not Reviewed
            </TabsTrigger>
            <TabsTrigger id="tab_reviewed" value="reviewed" className={cn(tabTriggerClass, "w-[164px]")}>
              Reviewed
            </TabsTrigger>
            <TabsTrigger id="tab_uploaded" value="uploaded" className={cn(tabTriggerClass, "w-[164px]")}>
              Uploaded Assignment
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── Not Reviewed ── */}
        <TabsContent value="not-reviewed" className="mt-0">
          <SearchFilterBar search={search} onSearch={setSearch} />
          <DataTable
            data={NOT_REVIEWED_DATA}
            columns={notReviewedColumns}
            keyExtractor={(item) => item.id}
            showCheckboxes={false}
            tableContainerClassName=""
            pagination={paginationProps}
          />
        </TabsContent>

        {/* ── Reviewed ── */}
        <TabsContent value="reviewed" className="mt-0">
          <SearchFilterBar search={search} onSearch={setSearch} />
          <DataTable
            data={REVIEWED_DATA}
            columns={reviewedColumns}
            keyExtractor={(item) => item.id}
            showCheckboxes={false}
            tableContainerClassName=""
            pagination={paginationProps}
          />
        </TabsContent>

        {/* ── Uploaded Assignment ── */}
        <TabsContent value="uploaded" className="mt-0">
          <SearchFilterBar search={search} onSearch={setSearch} showNew onNewAssignment={() => setIsModalOpen(true)} />
          <DataTable
            data={UPLOADED_DATA}
            columns={uploadedColumns}
            keyExtractor={(item) => item.id}
            showCheckboxes={false}
            tableContainerClassName=""
            pagination={paginationProps}
          />
        </TabsContent>
      </Tabs>

      <CreateAssignmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ViewAssessmentModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
      />
    </motion.div>
  );
}
