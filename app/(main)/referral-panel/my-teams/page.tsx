"use client";

import React, { useState, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import type { ReferralAgentDataType } from "@/types/referral";
import { MyTeamsTableToolbar } from "@/components/referral-panel/my-teams/MyTeamsTableToolbar";
import { MyTeamsTable } from "@/components/referral-panel/my-teams/MyTeamsTable";
import { AddEditTeamMemberModal } from "@/components/referral-panel/my-teams/modals/AddEditTeamMemberModal";

// ===== MOCK DATA BASED ON IMAGE =====
const mockTeamMembers: ReferralAgentDataType[] = [
  {
    id: "member-1",
    regDate: "2026/01/21",
    idNo: "#000001",
    name: "Amali Perera",
    district: "Colombo",
    phone: "+9470 492 2345",
    whatsApp: "+9470 492 2345",
    email: "amali@example.com",
    commissions: "XXXX.00",
    status: "ACTIVE",
    isTeamLeader: false,
    noOfStudents: 20, 
    noOfProducts: 15, 
  },
  {
    id: "member-2",
    regDate: "2026/01/21",
    idNo: "#12345",
    name: "Amali Perera",
    district: "Colombo",
    phone: "+9470 492 2345",
    whatsApp: "+9470 492 2345",
    email: "amali.leader@example.com",
    commissions: "XXXX.00",
    status: "ACTIVE",
    isTeamLeader: true,
    noOfStudents: 150, 
    noOfProducts: 120, 
  },
  {
    id: "member-3",
    regDate: "2026/01/21",
    idNo: "#000001",
    name: "Amali Perera",
    district: "Colombo",
    phone: "+9470 492 2345",
    whatsApp: "+9470 492 2345",
    email: "amali.inactive@example.com",
    commissions: "XXXX.00",
    status: "INACTIVE",
    isTeamLeader: false,
    noOfStudents: 10, 
    noOfProducts: 8, 
  },
];

export default function MyTeamsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [data] = useState<ReferralAgentDataType[]>(mockTeamMembers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ===== HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleAddMember = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleSearch = useCallback((value: string) => {
    console.log("Search value:", value);
  }, []);

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Toolbar */}
      <MyTeamsTableToolbar
        onAddMember={handleAddMember}
        onSearch={handleSearch}
      />

      {/* Main Data Table */}
      <MyTeamsTable
        data={data}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={data.length}
      />

      {/* Add Member Modal */}
      <AddEditTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(values) => console.log("Adding member:", values)}
      />
    </div>
  );
}
