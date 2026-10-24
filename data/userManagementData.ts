import { UserRole } from "@/types/roles";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: "Active" | "Inactive";
  joinDate: string;
  avatarInitials: string;
  avatarColor: string;
}

export const MOCK_USERS: UserRecord[] = [
  {
    id: "usr-001",
    name: "Kamal Perera",
    email: "kamal.perera@epms.lk",
    role: "ADMIN",
    department: "IT",
    status: "Active",
    joinDate: "2022-01-15",
    avatarInitials: "KP",
    avatarColor: "from-indigo-500 to-purple-600",
  },
  {
    id: "usr-002",
    name: "Nirosha Fernando",
    email: "nirosha.f@epms.lk",
    role: "HR",
    department: "Human Resources",
    status: "Active",
    joinDate: "2021-06-01",
    avatarInitials: "NF",
    avatarColor: "from-pink-500 to-rose-600",
  },
  {
    id: "usr-003",
    name: "Ruwan Jayasuriya",
    email: "ruwan.j@epms.lk",
    role: "SUPERVISOR",
    department: "Engineering",
    status: "Active",
    joinDate: "2020-03-22",
    avatarInitials: "RJ",
    avatarColor: "from-emerald-500 to-teal-600",
  },
  {
    id: "usr-004",
    name: "Amali Silva",
    email: "amali.s@epms.lk",
    role: "EMPLOYEE",
    department: "Finance",
    status: "Active",
    joinDate: "2023-08-10",
    avatarInitials: "AS",
    avatarColor: "from-amber-500 to-orange-600",
  },
  {
    id: "usr-005",
    name: "Chaminda Ranatunga",
    email: "chaminda.r@epms.lk",
    role: "EMPLOYEE",
    department: "Engineering",
    status: "Inactive",
    joinDate: "2019-11-05",
    avatarInitials: "CR",
    avatarColor: "from-sky-500 to-blue-600",
  },
  {
    id: "usr-006",
    name: "Sanduni Wickramasinghe",
    email: "sanduni.w@epms.lk",
    role: "SUPERVISOR",
    department: "Operations",
    status: "Active",
    joinDate: "2021-02-14",
    avatarInitials: "SW",
    avatarColor: "from-violet-500 to-purple-600",
  },
  {
    id: "usr-007",
    name: "Tharaka Dissanayake",
    email: "tharaka.d@epms.lk",
    role: "EMPLOYEE",
    department: "Sales",
    status: "Active",
    joinDate: "2022-09-30",
    avatarInitials: "TD",
    avatarColor: "from-cyan-500 to-blue-600",
  },
  {
    id: "usr-008",
    name: "Ishara Mendis",
    email: "ishara.m@epms.lk",
    role: "HR",
    department: "Human Resources",
    status: "Inactive",
    joinDate: "2020-07-19",
    avatarInitials: "IM",
    avatarColor: "from-fuchsia-500 to-pink-600",
  },
  {
    id: "usr-009",
    name: "Pradeep Kumara",
    email: "pradeep.k@epms.lk",
    role: "EMPLOYEE",
    department: "Logistics",
    status: "Active",
    joinDate: "2023-01-04",
    avatarInitials: "PK",
    avatarColor: "from-lime-500 to-green-600",
  },
  {
    id: "usr-010",
    name: "Dilanka Senanayake",
    email: "dilanka.s@epms.lk",
    role: "EMPLOYEE",
    department: "Finance",
    status: "Active",
    joinDate: "2024-03-17",
    avatarInitials: "DS",
    avatarColor: "from-rose-500 to-red-600",
  },
  {
    id: "usr-011",
    name: "Malini Rathnayake",
    email: "malini.r@epms.lk",
    role: "SUPERVISOR",
    department: "Customer Support",
    status: "Active",
    joinDate: "2021-12-01",
    avatarInitials: "MR",
    avatarColor: "from-orange-500 to-amber-600",
  },
  {
    id: "usr-012",
    name: "Suresh Bandara",
    email: "suresh.b@epms.lk",
    role: "EMPLOYEE",
    department: "IT",
    status: "Inactive",
    joinDate: "2018-05-23",
    avatarInitials: "SB",
    avatarColor: "from-teal-500 to-emerald-600",
  },
];

export const ROLE_OPTIONS: { label: string; value: UserRole | "ALL" }[] = [
  { label: "All Roles", value: "ALL" },
  { label: "Admin", value: "ADMIN" },
  { label: "HR Manager", value: "HR" },
  { label: "Supervisor", value: "SUPERVISOR" },
  { label: "Employee", value: "EMPLOYEE" },
];

/* ─── Organisation lookup data (mock — replace with API calls later) ──── */

export interface OrgOption {
  value: string;  // UUID
  label: string;  // Display name
  subLabel?: string;
}

export const MOCK_DEPARTMENTS: OrgOption[] = [
  { value: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", label: "Information Technology", subLabel: "IT" },
  { value: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22", label: "Human Resources", subLabel: "HR" },
  { value: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33", label: "Finance & Accounting", subLabel: "Finance" },
  { value: "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44", label: "Engineering", subLabel: "Eng" },
  { value: "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55", label: "Sales & Marketing", subLabel: "Sales" },
  { value: "f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66", label: "Operations", subLabel: "Ops" },
  { value: "a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77", label: "Customer Support", subLabel: "CS" },
  { value: "b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88", label: "Logistics", subLabel: "Log" },
];

export const MOCK_POSITIONS: OrgOption[] = [
  { value: "p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", label: "Software Engineer", subLabel: "Engineering" },
  { value: "p1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22", label: "Senior Software Engineer", subLabel: "Engineering" },
  { value: "p2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33", label: "HR Manager", subLabel: "Human Resources" },
  { value: "p3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44", label: "HR Executive", subLabel: "Human Resources" },
  { value: "p4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55", label: "Finance Manager", subLabel: "Finance" },
  { value: "p5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66", label: "Accountant", subLabel: "Finance" },
  { value: "p6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77", label: "Sales Executive", subLabel: "Sales" },
  { value: "p7eebc99-9c0b-4ef8-bb6d-6bb9bd380a88", label: "Operations Coordinator", subLabel: "Operations" },
  { value: "p8eebc99-9c0b-4ef8-bb6d-6bb9bd380a99", label: "Team Lead", subLabel: "Engineering" },
  { value: "p9eebc99-9c0b-4ef8-bb6d-6bb9bd380aaa", label: "Customer Support Agent", subLabel: "Support" },
  { value: "paeebc99-9c0b-4ef8-bb6d-6bb9bd380abb", label: "Logistics Officer", subLabel: "Logistics" },
];

export const MOCK_SUPERVISORS: OrgOption[] = [
  { value: "usr-003", label: "Ruwan Jayasuriya", subLabel: "Engineering · Supervisor" },
  { value: "usr-006", label: "Sanduni Wickramasinghe", subLabel: "Operations · Supervisor" },
  { value: "usr-011", label: "Malini Rathnayake", subLabel: "Customer Support · Supervisor" },
  { value: "usr-001", label: "Kamal Perera", subLabel: "IT · Admin" },
];
