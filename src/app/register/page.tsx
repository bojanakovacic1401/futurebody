"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { FloatingScanParticles, OrbitalAvatarHalo } from "@/components/fx/FutureBodyFx";

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
        body: JSON.stringify({ name, email, password }),
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
    <main className="relative min-h-screen overflow-hidden bg-[#020712] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,.16),transparent_48%)]" />
      <FloatingScanParticles count={90} className="opacity-70" />

      <div className="relative z-10 grid min-h-screen grid-cols-1 gap-8 px-6 py-10 xl:grid-cols-[1fr_560px] xl:px-12">
        <section className="relative hidden overflow-hidden rounded-[32px] border border-cyan-300/10 bg-slate-950/20 p-10 xl:block">
          <FloatingScanParticles count={70} className="opacity-80" />
          <OrbitalAvatarHalo className="z-[2]" />

          <div className="relative z-20 flex items-center gap-4">
            <Image
              src="/assets/logo-b.png"
              alt="FutureBody"
              width={54}
              height={54}
              className="h-12 w-12 object-contain drop-shadow-[0_0_16px_rgba(34,211,238,.85)]"
            />
            <div className="text-4xl font-semibold tracking-wide text-white">
              FutureBody
            </div>
          </div>

          <div className="relative z-20 mt-32 max-w-2xl">
            <div className="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/5 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Build your baseline
            </div>

            <h1 className="text-6xl font-light leading-tight tracking-wide text-white">
              Create your
              <br />
              <span className="font-semibold text-cyan-300">FutureBody ID</span>
            </h1>

            <p className="mt-8 max-w-xl text-xl leading-9 text-slate-300">
              Start with secure authentication, then connect your lifestyle
              inputs to a live health simulation.
            </p>
          </div>

          <div className="absolute bottom-10 left-10 right-10 z-20 grid gap-4 md:grid-cols-3">
            {["Secure profile", "Live inputs", "AI avatar"].map((item) => (
              <div key={item} className="rounded-2xl border border-cyan-300/10 bg-slate-950/60 p-5 text-sm font-bold uppercase tracking-[0.14em] text-cyan-300">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-xl rounded-[32px] border border-cyan-300/15 bg-slate-950/60 p-8 shadow-[0_0_45px_rgba(8,145,178,.18)] backdrop-blur">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10">
                <Image src="/assets/logo-b.png" alt="FutureBody" width={52} height={52} className="h-12 w-12 object-contain" />
              </div>

              <h1 className="text-4xl font-semibold text-white">Create Account</h1>
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

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-cyan-300/10" />
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                or continue with
              </span>
              <div className="h-px flex-1 bg-cyan-300/10" />
            </div>

            <a
              href="/api/auth/google"
              className="flex h-14 w-full items-center justify-center rounded-xl border border-cyan-300/15 bg-slate-950/50 text-white transition hover:border-cyan-300/35 hover:bg-cyan-400/5"
            >
              Continue with Google
            </a>

            <div className="mt-8 text-center text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-300 hover:text-cyan-200">
                Log in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
