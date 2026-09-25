"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TransactionItem from "@/components/TransactionItem";
import { API_URL, getErrorMessage } from "@/lib/api";

type ApiTransaction = {
  credit_card: string;
  old_money: number;
  updated_money: number;
  transaction_amount: number;
  status: string;
  created_at: string;
};

export default function TransactionPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      router.push("/Login");
      return;
    }

    void (async () => {
      try {
        const response = await fetch(`${API_URL}/transactions/${id}/history`);
        const data: unknown = await response.json();
        if (!response.ok || !Array.isArray(data)) {
          setError(getErrorMessage(data, "We could not load transaction activity."));
          return;
        }
        const validTransactions = (data as unknown[]).filter(isApiTransaction);
        setTransactions(validTransactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch {
        setError("We could not reach the activity service. Try again shortly.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#f7faf8] md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col justify-between gap-5 border-b border-[#dbe7e1] pb-7 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Account activity</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#102522] sm:text-4xl">Transaction history.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#667a75]">Every movement is shown with a masked card reference for safer review.</p>
            </div>
            {!loading && <span className="rounded-full border border-[#dbe7e1] bg-white px-3 py-1.5 text-xs font-semibold text-[#667a75]">{transactions.length} entries</span>}
          </header>

          {error && <p role="alert" className="mt-6 rounded-2xl border border-[#f1c7c7] bg-[#fff7f7] px-4 py-3 text-sm leading-6 text-[#b93838]">{error}</p>}
          {loading && <LoadingHistory />}
          {!loading && !error && transactions.length === 0 && <EmptyHistory />}

          {!loading && !error && transactions.length > 0 && (
            <section className="mt-8 space-y-3">
              {transactions.map((transaction, index) => {
                const date = new Date(transaction.created_at);
                return <TransactionItem key={`${transaction.created_at}-${index}`} transaction={{ id: String(index), type: transaction.status === "withdraw" ? "withdraw" : "deposit", amount: Math.abs(transaction.transaction_amount), cardNumber: transaction.credit_card, date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }} />;
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function isApiTransaction(value: unknown): value is ApiTransaction {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ApiTransaction>;
  return (item.status === "deposit" || item.status === "withdraw") &&
    typeof item.credit_card === "string" && typeof item.transaction_amount === "number" && typeof item.created_at === "string";
}

function LoadingHistory() { return <div className="mt-8 rounded-[1.75rem] border border-[#dbe7e1] bg-white p-10 text-center"><div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#dff3e9] border-t-[#147a60]" /><p className="mt-4 text-sm font-semibold text-[#667a75]">Loading activity…</p></div>; }
function EmptyHistory() { return <section className="mt-8 rounded-[1.75rem] border border-dashed border-[#c6d8d1] bg-white p-10 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf7f0] text-[#147a60]"><svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3v3m12-3v3M4.5 9.5h15M6 5h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 18 19H6a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 6 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span><h2 className="mt-5 text-xl font-semibold tracking-[-0.035em] text-[#102522]">No transactions yet.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#667a75]">Deposits and withdrawals will appear here as soon as you make them.</p></section>; }
