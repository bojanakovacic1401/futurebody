import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { InsightsClient } from "@/components/insights/InsightsClient";
import { getCurrentUser } from "@/lib/auth/session";

export default async function InsightsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell>
      <InsightsClient />
    </AppShell>
  );
}