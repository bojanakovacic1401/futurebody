import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TimelineClient } from "@/components/timeline/TimelineClient";
import { getCurrentUser } from "@/lib/auth/session";

export default async function TimelinePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell>
      <main className="w-full overflow-x-hidden px-4 py-5 md:px-6">
        <TimelineClient />
      </main>
    </AppShell>
  );
}