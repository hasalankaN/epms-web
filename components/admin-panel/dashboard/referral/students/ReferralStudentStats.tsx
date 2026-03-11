"use client";

import React from "react";

import { StudentListCard } from "./StudentListCard";

// Dummy data for students
const dummyStudentsWithPrice = [
  { id: "1", name: "Student Name", location: "Location Details", students: 22, products: 10, price: "LKR 7,000" },
  { id: "2", name: "Student Name", location: "Location Details", students: 22, products: 10, price: "LKR 7,000" },
  { id: "3", name: "Student Name", location: "Location Details", students: 22, products: 10, price: "LKR 7,000" },
  { id: "4", name: "Student Name", location: "Location Details", students: 22, products: 10, price: "LKR 7,000" },
  { id: "5", name: "Student Name", location: "Location Details", students: 22, products: 10, price: "LKR 7,000" },
];

const dummyStudentsWithButton = [
  { id: "1", name: "Student Name", location: "Location Details", students: 22, products: 10 },
  { id: "2", name: "Student Name", location: "Location Details", students: 22, products: 10 },
  { id: "3", name: "Student Name", location: "Location Details", students: 22, products: 10 },
  { id: "4", name: "Student Name", location: "Location Details", students: 22, products: 10 },
  { id: "5", name: "Student Name", location: "Location Details", students: 22, products: 10 },
];

export function ReferralStudentStats() {
  const handleViewProfile = (studentId: string) => {
    console.log("View profile for student:", studentId);
  };

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      <StudentListCard
        title="Recently Referral Student"
        students={dummyStudentsWithPrice}
      />
      <StudentListCard
        title="Recently Referred Student"
        students={dummyStudentsWithButton}
        showButton
        buttonLabel="View Profile"
        onButtonClick={handleViewProfile}
      />
    </div>
  );
}
