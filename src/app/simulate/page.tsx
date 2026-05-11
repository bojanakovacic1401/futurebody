import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SimulationClient } from "@/components/simulate/SimulationClient";
import { getCurrentUser } from "@/lib/auth/session";

export default async function SimulatePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell>
      <main className="w-full overflow-x-hidden px-4 py-5 md:px-6">
        <SimulationClient />
      </main>
    </AppShell>
  );
}