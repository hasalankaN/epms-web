"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckSquare,
  Star,
  Edit,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { SupervisorEditMemberModal } from "./SupervisorEditMemberModal";
import { toast } from "sonner";

export interface TeamMemberRow {
  id: string;
  name: string;
  code: string;
  position: string;
  contact: string;
  address: string;
  qualification: string;
  todayStatus: "PRESENT" | "LATE" | "ABSENT" | "ON_LEAVE";
  openTasks: number;
  lastRating: number;
  avatarUrl?: string;
}

const mockTeamMembers: TeamMemberRow[] = [
  {
    id: "emp-1042",
    name: "Nuwan Perera",
    code: "EMP-1042",
    position: "Senior Software Engineer",
    contact: "+94 77 123 4567",
    address: "45/2 Lake Drive, Rajagiriya",
    qualification: "B.Sc in Computing (Hons), AWS SAA",
    todayStatus: "PRESENT",
    openTasks: 3,
    lastRating: 4.8,
  },
  {
    id: "emp-1015",
    name: "Dilani Wickramasinghe",
    code: "EMP-1015",
    position: "Software Engineer",
    contact: "+94 77 234 5678",
    address: "18 Temple Road, Maharagama",
    qualification: "B.Sc in Software Engineering",
    todayStatus: "PRESENT",
    openTasks: 2,
    lastRating: 4.5,
  },
  {
    id: "emp-1022",
    name: "Kasun Jayasuriya",
    code: "EMP-1022",
    position: "Quality Assurance Engineer",
    contact: "+94 71 888 2233",
    address: "34 Galle Road, Dehiwala",
    qualification: "ISTQB Certified Tester",
    todayStatus: "LATE",
    openTasks: 1,
    lastRating: 4.2,
  },
  {
    id: "emp-1033",
    name: "Saman Kumara",
    code: "EMP-1033",
    position: "Associate DevOps Engineer",
    contact: "+94 77 345 6789",
    address: "56 Station Road, Moratuwa",
    qualification: "RHCSA, Kubernetes CKA",
    todayStatus: "ABSENT",
    openTasks: 4,
    lastRating: 3.9,
  },
  {
    id: "emp-1050",
    name: "Ishara Senanayake",
    code: "EMP-1050",
    position: "Frontend Developer",
    contact: "+94 77 456 7890",
    address: "78 Kandy Road, Kelaniya",
    qualification: "B.Sc IT (Special), UI/UX Specialist",
    todayStatus: "ON_LEAVE",
    openTasks: 0,
    lastRating: 4.6,
  },
];

export function SupervisorTeamView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [members, setMembers] = useState<TeamMemberRow[]>(mockTeamMembers);

  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<TeamMemberRow | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMemberRow | null>(null);

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.position.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || m.todayStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteMember = () => {
    if (!memberToDelete) return;
    setMembers(members.filter((m) => m.id !== memberToDelete.id));
    toast.success(`Removed ${memberToDelete.name} from supervisor direct reports.`);
    setMemberToDelete(null);
  };

  const columns: Column<TeamMemberRow>[] = [
    {
      header: "Team Member",
      cell: (item) => (
        <div
          onClick={() => router.push(`/supervisor-panel/team/${item.id}`)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <Avatar className="h-9 w-9 border border-pink-200">
            <AvatarFallback className="bg-pink-100 text-pink-700 font-bold text-xs">
              {item.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#E60076] transition-colors">
              {item.name}
            </p>
            <p className="text-[11px] text-slate-400">{item.code}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Position",
      cell: (item) => <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.position}</span>,
    },
    {
      header: "Contact Phone",
      cell: (item) => <span className="text-xs text-slate-500">{item.contact}</span>,
    },
    {
      header: "Today's Status",
      cell: (item) => <StatusBadge status={item.todayStatus} />,
    },
    {
      header: "Open Tasks",
      cell: (item) => (
        <span className="font-bold text-xs text-slate-900 dark:text-white">
          {item.openTasks} ticket{item.openTasks === 1 ? "" : "s"}
        </span>
      ),
    },
    {
      header: "Appraisal Rating",
      cell: (item) => (
        <div className="flex items-center gap-1 font-bold text-xs text-amber-500">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{item.lastRating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/supervisor-panel/team/${item.id}`)}
            className="h-7 text-xs px-2 text-[#E60076] hover:bg-pink-50"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedMemberForEdit(item)}
            className="h-7 text-xs px-2"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMemberToDelete(item)}
            className="h-7 text-xs px-2 text-rose-600 hover:bg-rose-50"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search member by name, code, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {["ALL", "PRESENT", "LATE", "ABSENT", "ON_LEAVE"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                statusFilter === st
                  ? "bg-[#E60076] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All Team" : st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
        <DataTable
          data={filtered}
          columns={columns}
          keyExtractor={(item) => item.id}
        />
      </div>

      <SupervisorEditMemberModal
        isOpen={!!selectedMemberForEdit}
        onClose={() => setSelectedMemberForEdit(null)}
        member={selectedMemberForEdit}
      />

      <DeleteConfirmationModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleDeleteMember}
        title="Remove Employee from Team"
        description={`Are you sure you want to remove ${memberToDelete?.name} (${memberToDelete?.code}) from your direct supervisory team? This unassigns your supervisory relationship.`}
        confirmText="Confirm Remove"
      />
    </div>
  );
}

