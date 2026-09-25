"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { API_URL, getErrorMessage } from "@/lib/api";

const QUICK_AMOUNTS = [100, 500, 1_000, 5_000];

type BalanceResponse = { username?: string; money?: number };

export default function MainMenu() {
  const router = useRouter();
  const userIdRef = useRef<string | null>(null);
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<"deposit" | "withdraw" | null>(null);

  const loadBalance = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}/balance`);
      const data: unknown = await response.json();
      if (!response.ok || !data || typeof data !== "object") {
        setError(getErrorMessage(data, "We could not load your account balance."));
        return;
      }
      const account = data as BalanceResponse;
      if (typeof account.username === "string") setUsername(account.username);
      if (typeof account.money === "number") setBalance(account.money);
    } catch {
      setError("We could not reach the account service. Try again shortly.");
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      router.push("/Login");
      return;
    }
    userIdRef.current = id;
    void (async () => {
      await loadBalance(id);
      setLoading(false);
    })();
  }, [router]);

  const addAmount = (setter: Dispatch<SetStateAction<string>>, quickAmount: number) => {
    setter((current) => (Number(current || 0) + quickAmount).toString());
  };

  const submitTransaction = async (type: "deposit" | "withdraw") => {
    const id = userIdRef.current;
    const input = type === "deposit" ? depositAmount : withdrawAmount;
    const amount = Number(input);
    setError("");

    if (!id || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than 0 before continuing.");
      return;
    }

    setSubmitting(type);
    try {
      const response = await fetch(`${API_URL}/transactions/${id}/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        setError(getErrorMessage(data, `${type === "deposit" ? "Deposit" : "Withdrawal"} failed. Try again.`));
        return;
      }
      if (type === "deposit") setDepositAmount("");
      else setWithdrawAmount("");
      await loadBalance(id);
    } catch {
      setError("The transaction service is unavailable. Try again shortly.");
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen bg-[#f7faf8] md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-col justify-between gap-5 border-b border-[#dbe7e1] pb-7 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Account overview</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#102522] sm:text-4xl">Hello, {username || "there"}.</h1>
              <p className="mt-2 text-sm leading-6 text-[#667a75]">Make a deposit or withdrawal. Each entry is recorded in your activity log.</p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#c9e7d8] bg-[#eaf7f0] px-3 py-1.5 text-xs font-semibold text-[#083a31] sm:self-auto">
              <span className="h-2 w-2 rounded-full bg-[#147a60]" /> Secure session
            </div>
          </header>

          {error && <p role="alert" className="mt-6 rounded-2xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm leading-6 text-[#b93838]">{error}</p>}

          <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
            <div className="grid gap-6">
              <TransactionPanel
                title="Deposit funds"
                description="Add funds to this account."
                amount={depositAmount}
                onAmountChange={setDepositAmount}
                onQuickAmount={(amount) => addAmount(setDepositAmount, amount)}
                onSubmit={() => submitTransaction("deposit")}
                submitting={submitting === "deposit"}
                tone="deposit"
              />
              <TransactionPanel
                title="Withdraw funds"
                description="Move available funds out of this account."
                amount={withdrawAmount}
                onAmountChange={setWithdrawAmount}
                onQuickAmount={(amount) => addAmount(setWithdrawAmount, amount)}
                onSubmit={() => submitTransaction("withdraw")}
                submitting={submitting === "withdraw"}
                tone="withdraw"
              />
            </div>

            <aside className="rounded-[1.75rem] bg-[#083a31] p-6 text-white shadow-[0_20px_50px_-30px_rgba(6,45,38,.8)] sm:p-8 xl:sticky xl:top-8 xl:h-fit">
              <p className="text-sm font-semibold text-emerald-100/80">Available balance</p>
              <p className="mt-5 text-5xl font-semibold tracking-[-0.07em] tabular-nums sm:text-6xl">{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="mt-2 text-base text-emerald-100/75">Thai baht</p>
              <div className="mt-10 border-t border-white/15 pt-6 text-sm leading-6 text-emerald-50/72">
                <p className="font-semibold text-white">Protected account activity</p>
                <p className="mt-1">Masked customer data stays protected while you work.</p>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}

type TransactionPanelProps = {
  title: string;
  description: string;
  amount: string;
  onAmountChange: (value: string) => void;
  onQuickAmount: (amount: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  tone: "deposit" | "withdraw";
};

function TransactionPanel({ title, description, amount, onAmountChange, onQuickAmount, onSubmit, submitting, tone }: TransactionPanelProps) {
  const isDeposit = tone === "deposit";
  return (
    <section className="rounded-[1.75rem] border border-[#dbe7e1] bg-white p-5 sm:p-7">
      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${isDeposit ? "bg-[#147a60]" : "bg-[#d89b31]"}`} /><h2 className="text-xl font-semibold tracking-[-0.035em] text-[#102522]">{title}</h2></div>
          <p className="mt-2 text-sm leading-6 text-[#667a75]">{description}</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {QUICK_AMOUNTS.map((quickAmount) => <button key={quickAmount} type="button" onClick={() => onQuickAmount(quickAmount)} className="rounded-xl border border-[#dbe7e1] bg-[#f7faf8] px-3 py-3 text-sm font-semibold text-[#102522] transition hover:border-[#9ecfb8] hover:bg-[#eaf7f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147a60]">+{quickAmount.toLocaleString()}</button>)}
      </div>
      <div className="field-shell mt-4 flex items-center gap-3 px-4">
        <span className="text-sm font-semibold text-[#667a75]">THB</span>
        <input type="number" min="0" inputMode="decimal" value={amount} onChange={(event) => onAmountChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onSubmit(); }} placeholder="Enter an amount" className="h-13 min-w-0 flex-1 bg-transparent text-base font-semibold text-[#102522] outline-none placeholder:font-normal placeholder:text-[#8a9b96]" />
        <button type="button" onClick={onSubmit} disabled={submitting} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147a60] disabled:cursor-not-allowed disabled:opacity-60 ${isDeposit ? "bg-[#083a31] hover:bg-[#0d5546]" : "bg-[#6d4b10] hover:bg-[#835d16]"}`}>{submitting ? "Processing…" : isDeposit ? "Deposit" : "Withdraw"}</button>
      </div>
    </section>
  );
}

function LoadingScreen() {
  return <div className="flex min-h-screen items-center justify-center bg-[#f7faf8]"><div className="text-center"><div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#dff3e9] border-t-[#147a60]" /><p className="mt-4 text-sm font-semibold text-[#667a75]">Loading your account…</p></div></div>;
}
