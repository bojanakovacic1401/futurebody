"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.message || "Register failed.");
        return;
      }

      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020712] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,.16),transparent_48%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <section className="w-full max-w-xl rounded-[32px] border border-cyan-300/15 bg-slate-950/60 p-8 shadow-[0_0_45px_rgba(8,145,178,.18)] backdrop-blur">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10">
              <Image
                src="/assets/logo-b.png"
                alt="FutureBody"
                width={52}
                height={52}
                className="h-12 w-12 object-contain"
              />
            </div>

            <h1 className="text-4xl font-semibold text-white">
              Create Account
            </h1>
            <p className="mt-3 text-slate-400">
              Start building your FutureBody baseline.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Full name
              </span>

              <div className="flex h-14 items-center rounded-xl border border-cyan-300/15 bg-slate-950/60 px-4">
                <User className="mr-3 text-slate-500" size={20} />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Email address
              </span>

              <div className="flex h-14 items-center rounded-xl border border-cyan-300/15 bg-slate-950/60 px-4">
                <Mail className="mr-3 text-slate-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Password
              </span>

              <div className="flex h-14 items-center rounded-xl border border-cyan-300/15 bg-slate-950/60 px-4">
                <Lock className="mr-3 text-slate-500" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create password"
                  className="w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </label>

            {error ? (
              <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex h-16 w-full items-center justify-center gap-3 rounded-xl border border-cyan-300/40 bg-cyan-400/20 text-lg font-semibold text-white shadow-[0_0_28px_rgba(34,211,238,.3)] transition hover:bg-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
              <ArrowRight size={22} />
            </button>
          </form>

          <div className="mt-8 text-center text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-300 hover:text-cyan-200">
              Log in
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}