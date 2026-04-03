import { redirect } from "next/navigation";

import { getSession } from "@/lib/authentication";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    return redirect("/sign-in");
  }

  let rolePrefix = session.user.role.toLowerCase();
  
  if (rolePrefix === "referral_agent") {
    rolePrefix = "referral";
  }

  return redirect(`/${rolePrefix}-panel/dashboard`);
}
