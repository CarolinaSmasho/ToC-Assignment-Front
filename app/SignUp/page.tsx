"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthBrandPanel from "@/components/AuthBrandPanel";

interface FormData {
  username: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  creditCard: string;
}

const DEFAULT_FORM_DATA: FormData = {
  username: "SSRDZz",
  email: "TOC@gmail.com",
  password: "Password123!",
  dateOfBirth: "15/08/2002",
  phone: "022 222 2222",
  address: "99/1 Rama 9 Rd, Bangkok",
  creditCard: "4111 2222 3333 4444",
};

export default function SignUpPage() {
  const [step, setStep] = useState<"input" | "confirmation">("input");
  const [rawInfo, setRawInfo] = useState("");
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [isCensored, setIsCensored] = useState(true);

  // Check URL query parameter ?step=confirmation for direct link testing
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("step") === "confirmation") {
        setStep("confirmation");
      }
    }
  }, []);

  // Parse raw info if user typed into "Your info here..."
  const handleProceedToConfirmation = () => {
    if (rawInfo.trim()) {
      const lines = rawInfo.split("\n").map((l) => l.trim()).filter(Boolean);
      
      const emailMatch = rawInfo.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = rawInfo.match(/(?:0\d{1,2}[-\s]?\d{3}[-\s]?\d{4}|\b\d{9,10}\b)/);
      const cardMatch = rawInfo.match(/(?:\d{4}[-\s]?){3}\d{4}/);
      const dobMatch = rawInfo.match(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/);

      setFormData({
        username: lines[0] || DEFAULT_FORM_DATA.username,
        email: emailMatch ? emailMatch[0] : lines[1] || DEFAULT_FORM_DATA.email,
        password: lines[2] || DEFAULT_FORM_DATA.password,
        dateOfBirth: dobMatch ? dobMatch[0] : DEFAULT_FORM_DATA.dateOfBirth,
        phone: phoneMatch ? phoneMatch[0] : DEFAULT_FORM_DATA.phone,
        address: lines[5] || DEFAULT_FORM_DATA.address,
        creditCard: cardMatch ? cardMatch[0] : DEFAULT_FORM_DATA.creditCard,
      });
    }
    setStep("confirmation");
  };

  // Censoring functions for Personal Data
  const getCensoredEmail = (email: string) => {
    if (!isCensored) return email;
    const parts = email.split("@");
    if (parts.length === 2) {
      const name = parts[0];
      const domain = parts[1];
      const maskedName = name.length > 2 ? `${name.slice(0, 1)}••••` : `${name.slice(0, 1)}*`;
      return `${maskedName}@${domain}`;
    }
    return "••••@gmail.com";
  };

  const getCensoredPhone = (phone: string) => {
    if (!isCensored) return phone;
    const clean = phone.trim();
    if (clean.length >= 8) {
      const prefix = clean.slice(0, 3);
      const suffix = clean.slice(-4);
      return `${prefix} ••• ${suffix}`;
    }
    return "022 ••• 2222";
  };

  const getCensoredCreditCard = (card: string) => {
    if (!isCensored) return card;
    const digits = card.replace(/\D/g, "");
    if (digits.length >= 12) {
      const last4 = digits.slice(-4);
      return `•••• •••• •••• ${last4}`;
    }
    return "•••• •••• •••• ••••";
  };

  const getCensoredDOB = (dob: string) => {
    if (!isCensored) return dob;
    return "••/••/••••";
  };

  const getCensoredAddress = (addr: string) => {
    if (!isCensored) return addr;
    const parts = addr.split(" ");
    if (parts.length > 1) {
      return `${parts[0]} ••••••••••`;
    }
    return "••••••••••••";
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#F0FDFD]">
      {/* Left Brand Panel */}
      <AuthBrandPanel />

      {/* Right Content Panel */}
      <main className="flex flex-1 items-center justify-center px-6 py-12 lg:py-0">
        <div className="w-full max-w-sm">
          {/* STEP 1: Image 2 - Create Account (Input info) */}
          {step === "input" && (
            <div>
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-normal text-black tracking-tight">
                  Welcome
                </h1>
                <p className="mt-2 text-base sm:text-lg text-gray-500 font-normal">
                  Create account
                </p>
              </div>

              {/* Large Textarea Box */}
              <div className="mt-8">
                <div className="h-64 sm:h-72 w-full rounded-2xl border-2 border-gray-400 bg-white p-4 transition focus-within:border-[#5cb874]">
                  <textarea
                    id="user-info-input"
                    value={rawInfo}
                    onChange={(e) => setRawInfo(e.target.value)}
                    placeholder="Your info here..."
                    className="h-full w-full resize-none bg-transparent text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleProceedToConfirmation}
                  className="w-full rounded-xl bg-[#5cb874] hover:bg-[#4ea865] py-3 text-lg font-medium text-white shadow-sm transition cursor-pointer"
                >
                  Sign Up
                </button>
              </div>

              {/* Footer Link */}
              <p className="mt-4 text-center text-sm text-gray-500">
                Already have account?{" "}
                <Link
                  href="/Login"
                  className="text-[#5cb874] hover:underline font-medium"
                >
                  Log In
                </Link>
              </p>
            </div>
          )}

          {/* STEP 2: Image 3 - Sign Up Confirmation (Personal Data Censored) */}
          {step === "confirmation" && (
            <div>
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-normal text-black tracking-tight">
                  Welcome
                </h1>
                <p className="mt-2 text-base sm:text-lg text-gray-500 font-normal">
                  Create Account
                </p>
              </div>

              {/* Censored Status & Toggle Pill */}
              <div className="mt-4 flex items-center justify-between px-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      isCensored ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  />
                  {isCensored ? "Personal Data Censored" : "Raw Data Visible"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCensored(!isCensored)}
                  className="text-xs font-medium text-[#5cb874] hover:underline cursor-pointer"
                >
                  {isCensored ? "👁️ Show Plain" : "🔒 Censor Data"}
                </button>
              </div>

              {/* Fields List (matching Image 3 underline format) */}
              <div className="mt-4 space-y-4">
                {/* 1. Username */}
                <div className="border-b border-gray-400 pb-1">
                  <input
                    type="text"
                    readOnly
                    value={formData.username}
                    aria-label="Username"
                    className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default"
                  />
                </div>

                {/* 2. Email (Censored) */}
                <div className="border-b border-gray-400 pb-1">
                  <input
                    type="text"
                    readOnly
                    value={getCensoredEmail(formData.email)}
                    aria-label="Email"
                    className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans"
                  />
                </div>

                {/* 3. Password */}
                <div className="border-b border-gray-400 pb-1">
                  <input
                    type="text"
                    readOnly
                    value={isCensored ? "••••••••" : formData.password}
                    aria-label="Password"
                    className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default"
                  />
                </div>

                {/* 4. Date of Birth (Censored) */}
                <div className="border-b border-gray-400 pb-1">
                  <input
                    type="text"
                    readOnly
                    value={getCensoredDOB(formData.dateOfBirth)}
                    aria-label="Date of Birth"
                    className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans"
                  />
                </div>

                {/* 5. Phone (Censored) */}
                <div className="border-b border-gray-400 pb-1">
                  <input
                    type="text"
                    readOnly
                    value={getCensoredPhone(formData.phone)}
                    aria-label="Phone"
                    className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans"
                  />
                </div>

                {/* 6. Address (Censored) */}
                <div className="border-b border-gray-400 pb-1">
                  <input
                    type="text"
                    readOnly
                    value={getCensoredAddress(formData.address)}
                    aria-label="Address"
                    className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans"
                  />
                </div>

                {/* 7. Credit Card (Censored) */}
                <div className="border-b border-gray-400 pb-1">
                  <input
                    type="text"
                    readOnly
                    value={getCensoredCreditCard(formData.creditCard)}
                    aria-label="Credit Card"
                    className="w-full bg-transparent text-sm sm:text-base text-gray-700 outline-none select-none cursor-default font-mono sm:font-sans"
                  />
                </div>
              </div>

              {/* Buttons (matching Image 3) */}
              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    alert("Account created successfully!");
                    window.location.href = "/Login";
                  }}
                  className="w-full rounded-xl bg-[#5cb874] hover:bg-[#4ea865] py-3 text-lg font-medium text-white shadow-sm transition cursor-pointer"
                >
                  Sign Up
                </button>

                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="w-full rounded-xl bg-[#c4c4c4] hover:bg-[#b5b5b5] py-3 text-lg font-medium text-white shadow-sm transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
