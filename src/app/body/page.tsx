import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BodyClient } from "@/components/body/BodyClient";
import { getCurrentUser } from "@/lib/auth/session";

export default async function BodyPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell>
      <BodyClient />
    </AppShell>
  );
}
