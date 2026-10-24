import { Users, Shield, Building2, Activity, LucideIcon } from "lucide-react";

export interface StatItem {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    color: string;
}

export interface QuickActionItem {
    title: string;
    desc: string;
    href: string;
}

export const adminStats: StatItem[] = [
    {
        title: "Total Users",
        value: "248",
        change: "+12% this month",
        icon: Users,
        color: "from-blue-600 to-indigo-600",
    },
    {
        title: "Active Roles",
        value: "4",
        change: "Admin, HR, Sup, Emp",
        icon: Shield,
        color: "from-purple-600 to-violet-600",
    },
    {
        title: "Departments",
        value: "8",
        change: "All operational",
        icon: Building2,
        color: "from-emerald-600 to-teal-600",
    },
    {
        title: "Pending Requests",
        value: "05",
        change: "03 Leave, 02 Account",
        icon: Activity,
        color: "from-amber-600 to-orange-600",
    },
];

export const adminQuickActions: QuickActionItem[] = [
    {
        title: "Manage System Users",
        desc: "Create, invite, or adjust roles across departments",
        href: "/admin-panel/users",
    },
    {
        title: "Configure Roles & Privileges",
        desc: "Fine-tune access controls for HR, Supervisors, and Employees",
        href: "/admin-panel/departments",
    },
    {
        title: "Review System Audit Logs",
        desc: "Track security events and login sessions",
        href: "/admin-panel/audit-logs",
    },
];