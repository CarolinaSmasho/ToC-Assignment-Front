"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthBrandPanel from "@/components/AuthBrandPanel";
import BrandMark from "@/components/BrandMark";
import { API_URL, getErrorMessage } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "review">("input");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    creditCard: ""
  });

  const [showPlain, setShowPlain] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const prepareReview = () => {
    setError("");
    const { username, password, email, phone, dateOfBirth, address, creditCard } = formData;

    if (!username.trim() || !password || !email.trim() || !phone.trim() || !dateOfBirth.trim() || !address.trim() || !creditCard.trim()) {
      setError("Please fill in all fields before continuing.");
      return;
    }

    setStep("review");
  };

  const register = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
          email: formData.email.trim(),
          tel: formData.phone.trim(),
          date_of_birth: formData.dateOfBirth.trim(),
          address: formData.address.trim(),
          credit_card: formData.creditCard.trim(),
        }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        setError(getErrorMessage(data, "Account creation failed."));
        return;
      }
      router.push("/Login");
    } catch {
      setError("Service offline. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const maskedData = {
    username: formData.username,
    password: "••••••••",
    email: maskEmail(formData.email),
    phone: maskPhone(formData.phone),
    dateOfBirth: maskDob(formData.dateOfBirth),
    address: maskAddress(formData.address),
    creditCard: maskCard(formData.creditCard),
  };

  const displayed = showPlain ? formData : maskedData;
  const safeDisplayed = showPlain ? { ...formData, password: "••••••••" } : maskedData;

  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />
      <main className="soft-grid flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-14 min-h-screen overflow-y-auto">
        <section className="enter-up w-full max-w-[34rem] py-8 mt-auto mb-auto">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link href="/Login" className="flex items-center gap-2.5">
              <BrandMark size="sm" />
              <span className="text-[0.9375rem] font-bold text-[#0d1f1c]">MaskVault</span>
            </Link>
            <span className="badge badge-green">Protected flow</span>
          </div>

          {step === "input" ? (
            <>
              <p className="eyebrow">Create account</p>
              <h1 className="mt-3 text-[2.6rem] font-bold tracking-[-0.06em] leading-[1.1] text-[#0d1f1c]">
                Register your <br/>secure identity.
              </h1>
              <p className="mt-4 text-[0.9375rem] leading-7 text-[#52716a]">
                Fill in your details below. Sensitive data will be masked by our active policies before final review.
              </p>

              <div className="mt-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Username" value={formData.username} onChange={(v) => handleInputChange("username", v)} placeholder="john_doe" />
                  <InputField label="Password" type="password" value={formData.password} onChange={(v) => handleInputChange("password", v)} placeholder="••••••••" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Email Address" type="email" value={formData.email} onChange={(v) => handleInputChange("email", v)} placeholder="john@example.com" />
                  <InputField label="Phone Number" value={formData.phone} onChange={(v) => handleInputChange("phone", v)} placeholder="081-234-5678" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Date of Birth" value={formData.dateOfBirth} onChange={(v) => handleInputChange("dateOfBirth", v)} placeholder="DD/MM/YYYY" />
                  <InputField label="Credit Card" value={formData.creditCard} onChange={(v) => handleInputChange("creditCard", v)} placeholder="1234-5678-9012-3456" />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#0d1f1c]">Address</label>
                  <div className="field-shell p-1 shadow-sm h-[6rem]">
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="123 Example Street, City, Country"
                      className="h-full w-full resize-none rounded-xl bg-transparent px-3 py-2 text-[0.9375rem] text-[#0d1f1c] outline-none placeholder:text-[#a0b5af]"
                    />
                  </div>
                </div>
              </div>

              {error && <Message text={error} />}
              <button type="button" onClick={prepareReview} className="btn-primary w-full mt-8">
                Continue to protected review
              </button>
              <div className="mt-8 text-center text-[0.9375rem] text-[#52716a]">
                Already have an account? <Link href="/Login" className="font-semibold text-[#147a60] hover:underline">Sign in</Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Protected review</p>
                  <h1 className="mt-3 text-[2.6rem] font-bold tracking-[-0.06em] leading-[1.1] text-[#0d1f1c]">
                    Confirm details.
                  </h1>
                </div>
                <span className={`badge shrink-0 mt-3 ${showPlain ? "badge-neutral" : "badge-green"}`}>
                  {showPlain ? "Unmasked view" : "Masked view"}
                </span>
              </div>
              <p className="mt-4 text-[0.9375rem] leading-7 text-[#52716a]">
                Sensitive values are masked by default. Verify the information before creating your account.
              </p>

              <div className="mt-8 flex items-center justify-between rounded-t-2xl border border-b-0 border-[#e0ebe5] bg-[#f5f9f7] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e2f5ec] text-[#083a31]">
                    <ShieldIcon />
                  </div>
                  <div><p className="text-sm font-semibold text-[#0d1f1c]">Privacy preview</p><p className="text-xs text-[#7a9790]">View sensitive fields securely</p></div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPlain((v) => !v)}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#083a31] shadow-sm ring-1 ring-inset ring-[#e0ebe5] transition hover:bg-[#f5f9f7]"
                >
                  {showPlain ? "Mask values" : "Show values"}
                </button>
              </div>

              <dl className="card rounded-t-none divide-y divide-[#e0ebe5]">
                <ReviewRow label="Username" value={displayed.username} />
                <ReviewRow label="Email" value={displayed.email} mono />
                <ReviewRow label="Password" value={safeDisplayed.password} />
                <ReviewRow label="Date of birth" value={displayed.dateOfBirth} />
                <ReviewRow label="Phone" value={displayed.phone} mono />
                <ReviewRow label="Address" value={displayed.address} />
                <ReviewRow label="Card" value={displayed.creditCard} mono />
              </dl>

              {error && <Message text={error} />}

              <div className="mt-8 grid gap-3 lg:grid-cols-2">
                <button type="button" onClick={register} disabled={loading} className="btn-primary">
                  {loading ? "Creating…" : "Create account"}
                </button>
                <button type="button" onClick={() => { setStep("input"); setShowPlain(false); setError(""); }} className="btn-secondary">
                  Edit input
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, type?: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#0d1f1c]">{label}</label>
      <div className="field-shell">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-[3.25rem] w-full bg-transparent px-4 text-[0.9375rem] text-[#0d1f1c] outline-none placeholder:text-[#a0b5af]"
        />
      </div>
    </div>
  );
}

function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid gap-1 px-6 py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#7a9790]">{label}</dt>
      <dd className={`truncate text-sm text-[#0d1f1c] ${mono ? "font-mono" : ""}`}>{value || "—"}</dd>
    </div>
  );
}

function Message({ text }: { text: string }) {
  return (
    <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#c0392b]">
      {text}
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3.5 19 6.4v4.7c0 4.4-2.9 8.2-7 9.4-4.1-1.2-7-5-7-9.4V6.4l7-2.9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m8.9 12 2.1 2.1 4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Frontend Masking Helpers
function maskEmail(value: string) {
  const [local, domain] = value.split("@");
  if (!local || !domain) return "••••••";
  if (local.length <= 2) return `${local[0] ?? "•"}••@${domain}`;
  return `${local[0]}${"•".repeat(Math.max(1, local.length - 2))}${local.at(-1)}@${domain}`;
}
function maskPhone(value: string) {
  const d = value.replace(/\D/g, "");
  if (d.length < 4) return "••••";
  return `XXX-XXX-${d.slice(-4)}`;
}
function maskCard(value: string) {
  const d = value.replace(/\D/g, "");
  if (d.length < 4) return "••••";
  return `XXXX-XXXX-XXXX-${d.slice(-4)}`;
}
function maskDob(value: string) {
  return value.replace(/\d/g, "X");
}
function maskAddress(value: string) {
  return value.replace(/^\d+(?:\/\d+)?/, (h) => h.replace(/\d/g, "X"));
}