"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { Search, MoreVertical } from "lucide-react";

import { format } from "date-fns";

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
import { AssignmentFilterModal } from "@/components/lecturer-panel/assignments/AssignmentFilterModal";
import { AddFeedbackModal } from "@/components/lecturer-panel/assignments/AddFeedbackModal";

import type { LecturerAssignmentItem } from "@/hooks/api/lecturers/useGetLecturerAssignments";
import { useGetLecturerAssignments } from "@/hooks/api/lecturers/useGetLecturerAssignments";
import type { LecturerSubmissionItem } from "@/hooks/api/lecturers/useGetLecturerSubmissions";
import { useGetLecturerSubmissions } from "@/hooks/api/lecturers/useGetLecturerSubmissions";

// Mock Data removed, relying on APIs

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
type ActionType = "view" | "download" | "feedback" | "edit";

function ActionCell({ 
  id, 
  onView, 
  onEdit,
  onFeedback,
  actions = ["view", "download", "feedback"]
}: { 
  id: string; 
  onView?: () => void; 
  onEdit?: () => void;
  onFeedback?: () => void;
  actions?: ActionType[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          id={`action_btn_${id}`}
          type="button"
          className="p-1 rounded hover:bg-[#F1F5F9] text-[#90A1B9] transition-colors outline-none h-7 w-7 flex items-center justify-center"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        sideOffset={4}
        className="w-[136px] min-w-[128px] p-1 bg-white border border-[#E5E7EB] rounded-[6px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
      >
        {actions.includes("view") && (
          <DropdownMenuItem 
            id={`view_assignment_${id}`}
            className="h-[30px] px-2 flex items-center rounded-[6px] cursor-pointer focus:bg-[#F1F5F9] transition-colors"
            onSelect={(e) => {
              e.preventDefault();
              onView?.();
            }}
          >
            <span className="text-[12px] font-normal leading-4 text-[#314158]">
              View
            </span>
          </DropdownMenuItem>
        )}
        {actions.includes("edit") && (
          <DropdownMenuItem 
            id={`edit_assignment_${id}`}
            className="h-[30px] px-2 flex items-center rounded-[6px] cursor-pointer focus:bg-[#F1F5F9] transition-colors"
            onSelect={(e) => {
              e.preventDefault();
              onEdit?.();
            }}
          >
            <span className="text-[12px] font-normal leading-4 text-[#314158]">
              Edit
            </span>
          </DropdownMenuItem>
        )}
        {actions.includes("download") && (
          <DropdownMenuItem 
            id={`download_assignment_${id}`}
            className="h-[30px] px-2 flex items-center rounded-[6px] cursor-pointer focus:bg-[#F1F5F9] transition-colors"
            onClick={() => { /* Handle download */ }}
          >
            <span className="text-[12px] font-normal leading-4 text-[#314158]">
              Download
            </span>
          </DropdownMenuItem>
        )}
        {actions.includes("feedback") && (
          <DropdownMenuItem 
            id={`feedback_assignment_${id}`}
            className="h-[30px] px-2 flex items-center rounded-[6px] cursor-pointer focus:bg-[#F1F5F9] transition-colors"
            onSelect={(e) => {
              e.preventDefault();
              onFeedback?.();
            }}
          >
            <span className="text-[12px] font-normal leading-4 text-[#314158]">
              Add Feedback
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Lesson Title Cell ─────────────────────────────────────────────────────────
function LessonTitleCell({ title }: { title: string }) {
  return <span className="flex items-center text-[12px] font-medium leading-[16px] text-[#45556C]">{title}</span>;
}

// ─── Shared Search + Filter Bar ────────────────────────────────────────────────
function SearchFilterBar({ 
  search, 
  onSearch, 
  showNew, 
  onNewAssignment,
  onFilterOpen
}: { 
  search: string; 
  onSearch: (v: string) => void; 
  showNew?: boolean; 
  onNewAssignment?: () => void;
  onFilterOpen?: () => void;
}) {
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
          onClick={onFilterOpen}
          className="flex items-center gap-2 h-9 px-4 rounded-[6px] border-[#E2E8F0] text-[13px] font-medium text-[#0F172B] hover:bg-[#F8FAFC]"
        >
          <i className="filter h-4 w-4 text-[#18181B]" />
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
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

  const [activeTab, setActiveTab] = useState("not-reviewed");

  const { data: notReviewedRes } = useGetLecturerSubmissions({ status: "PENDING", page, limit: 10, search });
  const { data: reviewedRes } = useGetLecturerSubmissions({ status: "REVIEWED", page, limit: 10, search });
  const { data: uploadedRes } = useGetLecturerAssignments({ page, limit: 10, search });

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setPage(1);
    setSearch("");
  };

  const handleView = (item?: any) => {
    if (item) {
      setSelectedAssessment({
        name: item.lesson_title || item.lessonTitle || "Assignment Name",
        lesson: item.lesson_title || "Lesson Name",
        category: item.type || "Category",
        description: "Lorem ipsum dolor sit amet consectetur. Elementum montes laoreet aliquam nibh adipiscing.",
        dueDate: item.due_date ? format(new Date(item.due_date), "EEEE, do MMMM, hh:mm a") : "Sunday, 30th November, 11:59 PM",
        timeRemaining: "3 Days , 1 hr , 40 minutes", // Math skipped for UI display
        lastModified: item.created_at || item.submitted_date || item.addedDate || format(new Date(), "yyyy/MM/dd")
      });
    }

    setViewModalOpen(true);
  };

  const handleFilterOpen = () => {
    setFilterModalOpen(true);
  };

  const handleFeedback = (item?: any) => {
    if (item) {
      setSelectedStudent({
        name: item.student_name || item.studentName || "Student Name",
        id: item.student_id ? `#${item.student_id}` : item.id ? `#${item.id}` : "#Student Id",
        submittedDate: item.submitted_date ? format(new Date(item.submitted_date), "yyyy.MM.dd") : item.addedDate || "2025.12.21",
        lessonTitle: item.lesson_title || item.lessonTitle || "Lesson Title",
        courseBatchName: item.course_name || item.batch_name || item.courseBatchName || "Course/Batch Name",
        avatar: item.student_avatar || item.avatar || "https://i.pravatar.cc/150?u=student"
      });
    }

    setFeedbackModalOpen(true);
  };

  // ─── Columns Definitions ───────────────────
  const notReviewedColumns: Column<LecturerSubmissionItem>[] = [
    { header: "Added Date", cell: (item) => item.submitted_date ? format(new Date(item.submitted_date), "yyyy/MM/dd") : "-", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Student Name", accessorKey: "student_name", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Type", accessorKey: "type", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Course/Batch Name", cell: (item) => item.course_name || item.batch_name || "-", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Lesson Title", cell: (item) => <LessonTitleCell title={item.lesson_title} />, className: "px-4" },
    { header: "Submitted File Type", cell: (item) => <FileTypeCell fileType={item.file_type || "Doc"} />, className: "px-4" },
    { header: "Action", cell: (item) => <ActionCell id={item.id} onView={() => handleView(item)} onFeedback={() => handleFeedback(item)} actions={["view", "download", "feedback"]} />, className: "px-4" },
  ];

  const reviewedColumns: Column<LecturerSubmissionItem>[] = [
    { header: "Added Date", cell: (item) => item.submitted_date ? format(new Date(item.submitted_date), "yyyy/MM/dd") : "-", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Student Name", accessorKey: "student_name", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Type", accessorKey: "type", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Course/Batch Name", cell: (item) => item.course_name || item.batch_name || "-", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Lesson Title", cell: (item) => <LessonTitleCell title={item.lesson_title} />, className: "px-4" },
    { header: "Feedback Submitted Date", cell: (item) => item.feedback_date ? format(new Date(item.feedback_date), "yyyy/MM/dd") : "-", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Action", cell: (item) => <ActionCell id={item.id} onView={() => handleFeedback(item)} actions={["view"]} />, className: "px-4" },
  ];

  const uploadedColumns: Column<LecturerAssignmentItem>[] = [
    { header: "Uploaded Date", cell: (item) => item.created_at ? format(new Date(item.created_at), "yyyy/MM/dd") : "-", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Due Date", cell: (item) => item.due_date ? format(new Date(item.due_date), "yyyy/MM/dd") : "-", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Type", accessorKey: "type", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Completion Rate", accessorKey: "completion_rate", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Course/Batch Name", cell: (item) => item.course_name || item.batch_name || "-", className: "px-4 text-[13px] text-[#45556C]" },
    { header: "Lesson Title", cell: (item) => <LessonTitleCell title={item.lesson_title} />, className: "px-4" },
    { header: "Action", cell: (item) => <ActionCell id={item.id} onView={() => handleView(item)} actions={["view", "edit"]} />, className: "px-4" },
  ];

  const tabTriggerClass = cn(
    "h-7 rounded-[4px] px-3 text-[12px] font-medium text-[#62748E] bg-transparent",
    "data-[state=active]:bg-white data-[state=active]:text-[#1D293D] data-[state=active]:font-medium",
    "data-[state=active]:shadow-[0px_1px_2px_rgba(16,24,40,0.05)]",
    "data-[state=active]:rounded-[4px] transition-all"
  );


  const getPaginationProps = (metaData?: { total_pages: number }) => ({
    variant: "simple" as const,
    currentPage: page,
    totalPages: metaData?.total_pages || 1,
    onPageChange: setPage,
    hideTotalCount: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-8"
    >
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
          <SearchFilterBar search={search} onSearch={setSearch} onFilterOpen={handleFilterOpen} />
          <DataTable
            data={notReviewedRes?.data || []}
            columns={notReviewedColumns}
            keyExtractor={(item) => item.id}
            showCheckboxes={false}
            tableContainerClassName=""
            pagination={getPaginationProps(notReviewedRes?.meta)}
          />
        </TabsContent>

        {/* ── Reviewed ── */}
        <TabsContent value="reviewed" className="mt-0">
          <SearchFilterBar search={search} onSearch={setSearch} onFilterOpen={handleFilterOpen} />
          <DataTable
            data={reviewedRes?.data || []}
            columns={reviewedColumns}
            keyExtractor={(item) => item.id}
            showCheckboxes={false}
            tableContainerClassName=""
            pagination={getPaginationProps(reviewedRes?.meta)}
          />
        </TabsContent>

        {/* ── Uploaded Assignment ── */}
        <TabsContent value="uploaded" className="mt-0">
          <SearchFilterBar search={search} onSearch={setSearch} showNew onNewAssignment={() => setIsModalOpen(true)} onFilterOpen={handleFilterOpen} />
          <DataTable
            data={uploadedRes?.data || []}
            columns={uploadedColumns}
            keyExtractor={(item) => item.id}
            showCheckboxes={false}
            tableContainerClassName=""
            pagination={getPaginationProps(uploadedRes?.meta)}
          />
        </TabsContent>
      </Tabs>

      <CreateAssignmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ViewAssessmentModal 
        isOpen={viewModalOpen} 
        onClose={() => {
          setViewModalOpen(false);
          setSelectedAssessment(null);
        }} 
        assessmentData={selectedAssessment}
      />

      <AssignmentFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={(filters) => console.log("Applied filters:", filters)}
      />

      <AddFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setSelectedStudent(null);
        }}
        studentData={selectedStudent}
      />
    </motion.div>
  );
}
