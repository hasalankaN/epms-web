import { redirect } from "next/navigation";

import { getSession } from "@/lib/authentication";
import { ROLE_PANEL_MAP, type UserRole } from "@/types/roles";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    return redirect("/sign-in");
  }

  const role = session.user.role as UserRole;
  const panel = ROLE_PANEL_MAP[role] || "/admin-panel";

  return redirect(`${panel}/dashboard`);
}
