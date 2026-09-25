"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthBrandPanel from "@/components/AuthBrandPanel";
import BrandMark from "@/components/BrandMark";
import { API_URL, getErrorMessage } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Enter your username and password to continue.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data: unknown = await response.json();

      if (!response.ok || !data || typeof data !== "object") {
        setError(getErrorMessage(data, "We could not sign you in. Try again."));
        return;
      }

      const result = data as { user_id?: number; username?: string };
      if (typeof result.user_id !== "number" || typeof result.username !== "string") {
        setError("The sign-in response was incomplete. Try again.");
        return;
      }

      localStorage.setItem("user_id", String(result.user_id));
      localStorage.setItem("username", result.username);
      router.push("/MainMenu");
    } catch {
      setError("The secure service is unavailable. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f7faf8] lg:flex-row">
      <AuthBrandPanel />
      <main className="soft-grid relative flex min-w-0 flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="absolute left-0 top-0 hidden h-36 w-36 rounded-br-full bg-[#dff3e9]/65 lg:block" aria-hidden="true" />
        <section className="enter-up relative w-full max-w-[28rem]">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link href="/Login" className="flex items-center gap-3">
              <BrandMark size="sm" />
              <span className="font-semibold tracking-[-0.025em] text-[#102522]">MaskVault</span>
            </Link>
            <span className="rounded-full bg-[#dff3e9] px-3 py-1.5 text-xs font-semibold text-[#083a31]">Production</span>
          </div>

          <p className="eyebrow">Authorized access</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-[#102522] sm:text-5xl">Sign in securely.</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-[#667a75]">
            Use your account to access privacy-protected banking data.
          </p>
          <p className="mt-1 text-sm leading-6 text-[#667a75]">เข้าสู่ระบบเพื่อเข้าถึงข้อมูลที่ได้รับการปกป้อง</p>

          <form className="mt-9 space-y-5" onSubmit={handleSubmit} noValidate>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#102522]">Username</span>
              <div className="field-shell">
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Your username"
                  className="h-13 w-full rounded-[0.85rem] bg-transparent px-4 text-base text-[#102522] outline-none placeholder:text-[#8a9b96]"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#102522]">Password</span>
              <div className="field-shell flex items-center pr-2">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-13 min-w-0 flex-1 rounded-[0.85rem] bg-transparent px-4 text-base text-[#102522] outline-none placeholder:text-[#8a9b96]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[#147a60] transition hover:bg-[#f1f7f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147a60]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error && (
              <p role="alert" className="rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm leading-6 text-[#b93838]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-13 w-full items-center justify-center rounded-2xl bg-[#083a31] px-5 text-base font-semibold text-white transition hover:bg-[#0d5546] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147a60] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-7 border-t border-[#dbe7e1] pt-6 text-sm leading-6 text-[#667a75]">
            <p>
              Need an account?{" "}
              <Link href="/SignUp" className="font-semibold text-[#147a60] underline-offset-4 hover:underline">
                Create one securely
              </Link>
            </p>
            <p className="mt-4 text-xs leading-5 text-[#7c8d88]">
              Authorized users only. Access and policy changes are logged for security review.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
