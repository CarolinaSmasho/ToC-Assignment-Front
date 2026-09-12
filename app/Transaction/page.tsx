import Sidebar from "@/components/Sidebar";
import TransactionItem from "@/components/TransactionItem";
import { MOCK_TRANSACTIONS } from "@/lib/transactions";

export default function TransactionPage() {
return (
	<div className="flex min-h-screen bg-white">
	<Sidebar />

	<main className="flex-1 px-16 py-12">
		<h1 className="text-3xl text-gray-900">Transaction Log</h1>

		<div className="mt-10 flex max-w-md flex-col gap-4">
		{MOCK_TRANSACTIONS.map((transaction) => (
			<TransactionItem key={transaction.id} transaction={transaction} />
		))}
		</div>
	</main>
	</div>
);
}