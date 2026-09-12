"use client";

import Link from "next/link";
import AuthBrandPanel from "@/components/AuthBrandPanel";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#F0FDFD]">
      {/* Left Brand Panel */}
      <AuthBrandPanel />

      {/* Right Form Panel */}
      <main className="flex flex-1 items-center justify-center px-6 py-12 lg:py-0">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-normal text-black tracking-tight">
              Welcome
            </h1>
            <p className="mt-2 text-base sm:text-lg text-gray-500 font-normal">
              Log-In with Email
            </p>
          </div>

          {/* Form */}
          <form
            className="mt-10 sm:mt-14 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="border-b border-gray-400 pb-1">
              <input
                id="login-username"
                type="text"
                placeholder="Username / Email"
                className="w-full bg-transparent py-1.5 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:placeholder-transparent"
              />
            </div>

            <div className="border-b border-gray-400 pb-1">
              <input
                id="login-password"
                type="password"
                placeholder="Password"
                className="w-full bg-transparent py-1.5 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:placeholder-transparent"
              />
            </div>

            <div className="pt-8 text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have account?{" "}
                <Link
                  href="/SignUp"
                  className="text-[#5cb874] hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </p>

              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#5cb874] hover:bg-[#4ea865] py-3 text-lg font-medium text-white shadow-sm transition cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
