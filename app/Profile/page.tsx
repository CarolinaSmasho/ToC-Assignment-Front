"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { API_URL, getErrorMessage } from "@/lib/api";

type Profile = {
  username: string;
  email: string;
  tel: string;
  date_of_birth: string;
  address: string;
  credit_card: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      router.push("/Login");
      return;
    }

    void (async () => {
      try {
        const response = await fetch(`${API_URL}/users/${id}`);
        const data: unknown = await response.json();
        if (!response.ok || !isProfile(data)) {
          setError(getErrorMessage(data, "We could not load this profile."));
          return;
        }
        setProfile(data);
      } catch {
        setError("We could not reach the profile service. Try again shortly.");
      }
    })();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#f7faf8] md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-5xl">
          <header className="border-b border-[#dbe7e1] pb-7">
            <p className="eyebrow">Privacy profile</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#102522] sm:text-4xl">Your protected details.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667a75]">These values are masked by the data-protection policy before they are displayed.</p>
          </header>

          {error && <p role="alert" className="mt-6 rounded-2xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm leading-6 text-[#b93838]">{error}</p>}
          {!profile && !error && <LoadingProfile />}

          {profile && (
            <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
              <div className="overflow-hidden rounded-[1.75rem] border border-[#dbe7e1] bg-white">
                <div className="border-b border-[#edf2ef] px-5 py-5 sm:px-7">
                  <p className="text-sm font-semibold text-[#102522]">Account identity</p>
                  <p className="mt-1 text-sm text-[#667a75]">Data shown here cannot be edited from this workspace.</p>
                </div>
                <dl>
                  <DetailRow label="Username" value={profile.username} />
                  <DetailRow label="Email" value={maskEmail(profile.email)} mono />
                  <DetailRow label="Date of birth" value={maskDob(profile.date_of_birth)} />
                  <DetailRow label="Phone" value={maskPhone(profile.tel)} mono />
                  <DetailRow label="Address" value={maskAddress(profile.address)} />
                  <DetailRow label="Card" value={maskCard(profile.credit_card)} mono last />
                </dl>
              </div>

              <aside className="rounded-[1.75rem] border border-[#c9e7d8] bg-[#eaf7f0] p-6">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#083a31] text-white"><ShieldIcon /></span>
                <h2 className="mt-5 text-xl font-semibold tracking-[-0.035em] text-[#102522]">Masked by default</h2>
                <p className="mt-3 text-sm leading-6 text-[#406058]">Your personal fields are protected by the active masking policy. Access is recorded for audit review.</p>
                <div className="mt-6 rounded-2xl border border-[#c9e7d8] bg-white/70 p-4 text-sm leading-6 text-[#406058]">
                  <p className="font-semibold text-[#102522]">Need to update details?</p>
                  <p className="mt-1">Contact an authorized administrator.</p>
                </div>
              </aside>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Profile>;
  return [item.username, item.email, item.tel, item.date_of_birth, item.address, item.credit_card].every((field) => typeof field === "string");
}

function maskEmail(value: string) {
  const [local, domain] = value.split("@");
  if (!local || !domain) return "••••••••";
  if (local.length <= 2) return `${local[0] ?? "•"}••@${domain}`;
  return `${local[0]}${"•".repeat(Math.max(1, local.length - 2))}${local.at(-1)}@${domain}`;
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "••••";
  return `XXX-XXX-${digits.slice(-4)}`;
}

function maskCard(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "••••••••";
  return `XXXX-XXXX-XXXX-${digits.slice(-4)}`;
}

function maskDob(value: string) {
  const clean = value.replace(/^DOB:\s*/i, "");
  return clean.replace(/\d/g, "X").replace(/[/-]/g, "/");
}

function maskAddress(value: string) {
  const clean = value.replace(/^Address:\s*/i, "");
  return clean.replace(/^\d+(?:\/\d+)?/, (houseNumber) => houseNumber.replace(/\d/g, "X"));
}

function DetailRow({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) {
  return <div className={`grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-5 sm:px-7 ${last ? "" : "border-b border-[#edf2ef]"}`}><dt className="text-sm font-semibold text-[#667a75]">{label}</dt><dd className={`min-w-0 break-words text-sm leading-6 text-[#102522] ${mono ? "font-mono" : ""}`}>{value || "—"}</dd></div>;
}

function LoadingProfile() { return <div className="mt-8 rounded-[1.75rem] border border-[#dbe7e1] bg-white p-10 text-center"><div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#dff3e9] border-t-[#147a60]" /><p className="mt-4 text-sm font-semibold text-[#667a75]">Loading protected details…</p></div>; }
function ShieldIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.5 19 6.4v4.7c0 4.4-2.9 8.2-7 9.4-4.1-1.2-7-5-7-9.4V6.4l7-2.9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="m8.9 12 2.1 2.1 4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
