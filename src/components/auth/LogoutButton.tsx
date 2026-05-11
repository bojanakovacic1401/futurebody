"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="hidden h-10 items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-4 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-400/15 md:flex"
    >
      <LogOut size={15} />
      Logout
    </button>
  );
}