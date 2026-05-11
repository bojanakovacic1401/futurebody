"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { ArrowRight, Eye, Lock, Mail } from "lucide-react";

const assets = {
  logo: "/assets/logo-b.png",
  body: "/assets/body-hologram.png",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const googleError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(
    googleError ? "Google login failed. Check OAuth setup." : ""
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      router.push("/dashboard");
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_44%_46%,rgba(14,165,233,.16),transparent_45%)]" />

      <div className="relative z-10 grid min-h-screen grid-cols-1 gap-8 px-6 py-8 xl:grid-cols-[1.45fr_.9fr] xl:px-12">
        <section className="relative hidden min-h-[820px] overflow-hidden rounded-[32px] border border-cyan-300/10 bg-slate-950/20 p-10 xl:block">
          <div className="absolute left-10 top-8 flex items-center gap-4">
            <Image
              src={assets.logo}
              alt="FutureBody"
              width={54}
              height={54}
              className="h-12 w-12 object-contain drop-shadow-[0_0_16px_rgba(34,211,238,.85)]"
            />
            <div className="text-4xl font-semibold tracking-wide text-white">
              FutureBody
            </div>
          </div>

          <div className="absolute left-10 top-52 z-20 max-w-xl">
            <div className="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/5 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
              AI-powered health simulation
            </div>

            <h1 className="text-6xl font-light leading-tight tracking-wide text-white">
              See Your
              <br />
              <span className="font-semibold text-cyan-300">
                Future Health
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-xl leading-9 text-slate-300">
              FutureBody uses lifestyle data, health inputs and AI simulation
              to visualize your future health trajectory.
            </p>
          </div>

          <div className="absolute bottom-12 left-10 z-30 grid w-[520px] gap-4">
            {[
              ["Future Timeline", "Visualize how your health evolves."],
              ["Body Systems", "Understand 8 core body systems."],
              ["Intervention Simulator", "Test changes before you make them."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-cyan-300/10 bg-slate-950/60 p-5 backdrop-blur-sm"
              >
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">
                  {title}
                </div>
                <p className="mt-2 text-sm text-slate-400">{text}</p>
              </div>
            ))}
          </div>

          <div className="absolute inset-y-0 left-[47%] right-[-8%] z-10 flex items-center justify-center">
            <Image
              src={assets.body}
              alt="Holographic body"
              width={1000}
              height={1300}
              priority
              className="h-[820px] w-auto object-contain drop-shadow-[0_0_70px_rgba(34,211,238,.95)]"
            />
          </div>

          <div className="absolute left-[42%] top-1/2 h-[460px] w-[460px] -translate-y-1/2 rounded-full border border-cyan-300/10" />
          <div className="absolute left-[48%] top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full border border-cyan-300/10" />
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-xl rounded-[32px] border border-cyan-300/15 bg-slate-950/55 p-8 shadow-[0_0_45px_rgba(8,145,178,.16)] backdrop-blur">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10">
                <Image
                  src={assets.logo}
                  alt="FutureBody"
                  width={52}
                  height={52}
                  className="h-12 w-12 object-contain"
                />
              </div>

              <h2 className="text-4xl font-semibold text-white">
                Welcome Back
              </h2>
              <p className="mt-3 text-slate-400">
                Log in to continue your health journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                    placeholder="you@example.com"
                    autoComplete="email"
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
                    className="w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <Eye className="ml-3 text-slate-500" size={20} />
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
                {loading ? "Logging in..." : "Log In"}
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
  New to FutureBody?{" "}
  <a href="/register" className="text-cyan-300 hover:text-cyan-200">
    Create an account
  </a>
</div>
          </div>
        </section>
      </div>
    </main>
  );
}