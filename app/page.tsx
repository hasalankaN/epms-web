import { redirect } from "next/navigation";

import { getSession } from "@/lib/authentication";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    return redirect("/sign-in");
  }

  const role = session.user.role.toLowerCase();

  return redirect(`/${role}-panel/dashboard`);
}
