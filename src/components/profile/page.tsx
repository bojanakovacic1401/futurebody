import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { HUDCard } from "@/components/ui/HUDCard";
import { getCurrentUser } from "@/lib/auth/session";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell>
      <main className="w-full overflow-x-hidden px-4 py-5 md:px-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-5">
          <section className="rounded-[28px] border border-cyan-300/15 bg-slate-950/35 p-6">
            <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
              Profile
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your FutureBody identity, avatar and session.
            </p>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <AvatarUploader />

            <HUDCard className="p-6">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Current User
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Name
                  </div>
                  <div className="mt-1 text-xl text-white">{user.name}</div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Email
                  </div>
                  <div className="mt-1 text-xl text-white">{user.email}</div>
                </div>

                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="mt-4 h-12 w-full rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-sm font-bold uppercase tracking-[0.16em] text-cyan-200"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </HUDCard>
          </div>
        </div>
      </main>
    </AppShell>
  );
}