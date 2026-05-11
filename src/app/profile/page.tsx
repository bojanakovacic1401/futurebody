import Image from "next/image";
import { redirect } from "next/navigation";
import { Mail, ShieldCheck, UserCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { LogoutButton } from "@/components/auth/LogoutButton";
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
        <div className="mx-auto w-full max-w-[1500px] space-y-5">
          <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-slate-950/35 p-6">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,211,238,.12),transparent_42%)]" />

            <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold uppercase tracking-[0.18em] text-white">
                  Profile
                </h1>
                <p className="mt-2 text-slate-400">
                  Manage your FutureBody identity, avatar and secure session.
                </p>
              </div>

              <LogoutButton />
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
            <AvatarUploader />

            <div className="space-y-5">
              <HUDCard className="p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-cyan-300/30 bg-cyan-400/10">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserCircle className="text-cyan-300" size={38} />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Current User
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-white">
                      {user.name}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="text-cyan-300" size={20} />
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          Email
                        </div>
                        <div className="mt-1 text-sm text-white">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-emerald-300" size={20} />
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          Provider
                        </div>
                        <div className="mt-1 text-sm uppercase tracking-[0.14em] text-emerald-300">
                          {user.provider || "demo"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </HUDCard>

              <HUDCard className="p-6">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  What this page does
                </div>

                <div className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
                  <p>
                    This is where the user uploads a real face/photo and
                    generates a holographic FutureBody avatar.
                  </p>
                  <p>
                    Later we will save baseline, improved and risk avatars per
                    user.
                  </p>
                </div>
              </HUDCard>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}