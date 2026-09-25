"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthBrandPanel from "@/components/AuthBrandPanel";
import BrandMark from "@/components/BrandMark";
import { API_URL, getErrorMessage } from "@/lib/api";

type FormData = {
  username: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  creditCard: string;
};

type MaskResponse = {
  original_email?: string;
  original_date_of_birth?: string;
  original_phone_number?: string;
  original_address?: string;
  original_credit_card?: string;
  email?: string;
  date_of_birth?: string;
  phone_number?: string;
  address?: string;
  credit_card?: string;
};

const EMPTY_FORM: FormData = {
  username: "",
  email: "",
  password: "",
  dateOfBirth: "",
  phone: "",
  address: "",
  creditCard: "",
};

const EXAMPLE = `somchai
1234
somchai.d@company.com
093-245-7894
DOB:25/12/2549
Address: 689 ซอยลาดกระบัง 19 ถนนลาดกระบัง
1234-5678-9012-3456`;

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "review">("input");
  const [rawInfo, setRawInfo] = useState("");
  const [plainForm, setPlainForm] = useState<FormData>(EMPTY_FORM);
  const [maskedForm, setMaskedForm] = useState<FormData>(EMPTY_FORM);
  const [showPlain, setShowPlain] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const prepareReview = async () => {
    setError("");
    const lines = rawInfo.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length < 3) {
      setError("Add a username, password, and contact details before continuing.");
      return;
    }

    const username = lines[0] ?? "";
    const password = lines[1] ?? "";
    const text = lines.slice(2).join(" ");
    if (!username || !password || !text) {
      setError("Add a username, password, and contact details before continuing.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/mask/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== "object") {
        setError(getErrorMessage(data, "We could not process those details. Check the format and try again."));
        return;
      }

      const masked = data as MaskResponse;
      if (!masked.original_email) {
        setError("We could not find an email address in those details. Check the format and try again.");
        return;
      }

      setPlainForm({
        username,
        password,
        email: masked.original_email ?? "",
        phone: masked.original_phone_number ?? "",
        dateOfBirth: masked.original_date_of_birth ?? "",
        address: masked.original_address ?? "",
        creditCard: masked.original_credit_card ?? "",
      });
      setMaskedForm({
        username,
        password: "••••••••",
        email: masked.email ?? "",
        phone: masked.phone_number ?? "",
        dateOfBirth: masked.date_of_birth ?? "",
        address: masked.address ?? "",
        creditCard: masked.credit_card ?? "",
      });
      setStep("review");
    } catch {
      setError("The masking service is unavailable. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: plainForm.username,
          password: plainForm.password,
          email: plainForm.email,
          tel: plainForm.phone,
          date_of_birth: plainForm.dateOfBirth,
          address: plainForm.address,
          credit_card: plainForm.creditCard,
        }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        setError(getErrorMessage(data, "We could not create your account. Try again."));
        return;
      }
      router.push("/Login");
    } catch {
      setError("The secure service is unavailable. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayed = showPlain ? plainForm : maskedForm;
  const safeDisplayed = { ...displayed, password: "••••••••" };

  return (
    <div className="flex min-h-screen bg-[#f7faf8] lg:flex-row">
      <AuthBrandPanel />
      <main className="soft-grid relative flex min-w-0 flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
        <section className="enter-up relative w-full max-w-[32rem]">
          <div className="mb-9 flex items-center justify-between lg:hidden">
            <Link href="/Login" className="flex items-center gap-3"><BrandMark size="sm" /><span className="font-semibold text-[#102522]">MaskVault</span></Link>
            <span className="rounded-full bg-[#dff3e9] px-3 py-1.5 text-xs font-semibold text-[#083a31]">Protected</span>
          </div>

          {step === "input" ? (
            <>
              <p className="eyebrow">Create an account</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-[#102522] sm:text-5xl">Review before we protect it.</h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-[#667a75]">
                Paste your registration details. We will mask sensitive values before the final review.
              </p>

              <label className="mt-8 block">
                <span className="mb-2 block text-sm font-semibold text-[#102522]">Registration details</span>
                <div className="field-shell p-1.5">
                  <textarea
                    id="user-info-input"
                    value={rawInfo}
                    onChange={(event) => setRawInfo(event.target.value)}
                    placeholder={EXAMPLE}
                    className="h-62 w-full resize-none rounded-xl bg-transparent px-3 py-3 font-mono text-sm leading-6 text-[#102522] outline-none placeholder:text-[#8a9b96]"
                  />
                </div>
              </label>
              <button type="button" onClick={() => setRawInfo(EXAMPLE)} className="mt-3 text-sm font-semibold text-[#147a60] underline-offset-4 hover:underline">
                Use sample format
              </button>
              <p className="mt-2 text-xs leading-5 text-[#7c8d88]">Line 1: username · Line 2: password · Remaining lines: personal details</p>

              {error && <Message text={error} />}
              <button type="button" onClick={prepareReview} disabled={loading} className="mt-7 flex h-13 w-full items-center justify-center rounded-2xl bg-[#083a31] px-5 text-base font-semibold text-white transition hover:bg-[#0d5546] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Protecting details…" : "Continue to protected review"}
              </button>
              <p className="mt-6 text-sm text-[#667a75]">Already have an account? <Link href="/Login" className="font-semibold text-[#147a60] underline-offset-4 hover:underline">Sign in</Link></p>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Protected review</p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-[#102522]">Confirm your details.</h1>
                </div>
                <span className={`mt-1 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${showPlain ? "bg-amber-100 text-amber-800" : "bg-[#dff3e9] text-[#083a31]"}`}>
                  {showPlain ? "Plain view" : "Masked view"}
                </span>
              </div>
              <p className="mt-4 text-base leading-7 text-[#667a75]">Sensitive values are masked by default before this account is created.</p>

              <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#dbe7e1] bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#dff3e9] text-[#083a31]"><ShieldIcon /></span>
                  <div><p className="text-sm font-semibold text-[#102522]">Privacy preview</p><p className="text-xs text-[#667a75]">Review sensitive values safely</p></div>
                </div>
                <button type="button" onClick={() => setShowPlain((value) => !value)} className="rounded-xl px-3 py-2 text-sm font-semibold text-[#147a60] hover:bg-[#f1f7f4]">
                  {showPlain ? "Mask values" : "Show values"}
                </button>
              </div>

              <dl className="mt-5 overflow-hidden rounded-2xl border border-[#dbe7e1] bg-white">
                <ReviewRow label="Username" value={displayed.username} />
                <ReviewRow label="Email" value={displayed.email} mono />
                <ReviewRow label="Password" value={safeDisplayed.password} />
                <ReviewRow label="Date of birth" value={displayed.dateOfBirth} />
                <ReviewRow label="Phone" value={displayed.phone} mono />
                <ReviewRow label="Address" value={displayed.address} />
                <ReviewRow label="Card" value={displayed.creditCard} mono last />
              </dl>

              {error && <Message text={error} />}
              <button type="button" onClick={register} disabled={loading} className="mt-7 flex h-13 w-full items-center justify-center rounded-2xl bg-[#083a31] px-5 text-base font-semibold text-white transition hover:bg-[#0d5546] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Creating account…" : "Create secure account"}
              </button>
              <button type="button" onClick={() => { setStep("input"); setShowPlain(false); setError(""); }} className="mt-3 h-12 w-full rounded-2xl border border-[#dbe7e1] bg-white text-sm font-semibold text-[#102522] transition hover:bg-[#f1f7f4]">
                Edit details
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function ReviewRow({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) {
  return <div className={`grid gap-1 px-4 py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-4 ${last ? "" : "border-b border-[#edf2ef]"}`}><dt className="text-xs font-semibold text-[#667a75]">{label}</dt><dd className={`min-w-0 break-words text-sm text-[#102522] ${mono ? "font-mono" : ""}`}>{value || "—"}</dd></div>;
}

function Message({ text }: { text: string }) {
  return <p role="alert" className="mt-5 rounded-xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm leading-6 text-[#b93838]">{text}</p>;
}

function ShieldIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.5 19 6.4v4.7c0 4.4-2.9 8.2-7 9.4-4.1-1.2-7-5-7-9.4V6.4l7-2.9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="m8.9 12 2.1 2.1 4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
