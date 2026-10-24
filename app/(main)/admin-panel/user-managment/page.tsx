import React from "react";
import { UserManagementTable } from "@/components/admin/UserManagment/UserManagementTable";

export default function UserManagementPage() {
  return (
    <div className="p-6 space-y-6">
      <UserManagementTable />
    </div>
  );
}
