import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { OnboardingClient } from "@/components/onboarding/OnboardingClient";
import { getCurrentUser } from "@/lib/auth/session";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell>
      <OnboardingClient />
    </AppShell>
  );
}