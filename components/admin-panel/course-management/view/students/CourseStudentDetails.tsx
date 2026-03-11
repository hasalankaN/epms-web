"use client";

import React, { useState, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import type { StudentDataType } from "@/types/student";

import { CourseStudentToolbar } from "./CourseStudentToolbar";
import { CourseStudentTable } from "./CourseStudentTable";

// ===== MOCK DATA =====
const mockStudents: StudentDataType[] = Array.from({ length: 50 }, (_, i) => ({
  id: `student-${i + 1}`,
  enrollDate: "2026/01/21",
  studentId: `#${String(i + 1).padStart(6, "0")}`,
  name: "Dilshan Perera",
  gender: "Male",
  enrollType: i % 2 === 0 ? "Direct" : "Referral",
  certificateType: "Free / UK",
  certificateStatus: i % 3 === 0 ? "Issued" : "Not Issued",
  paymentType: i % 2 === 0 ? "Complete" : "Installment",
  paymentStatus: i % 2 === 0 ? "Paid" : "Pending",
  status: (["Active", "Inactive", "Dropped"] as const)[i % 3],
}));

export function CourseStudentDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("studentPage");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [data] = useState<StudentDataType[]>(mockStudents);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // ===== HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("studentPage", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <CourseStudentToolbar />

      {/* Student Table */}
      <CourseStudentTable
        data={data}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        courseId="course-01"
        courseName="Marketing Course"
      />
    </div>
  );
}
