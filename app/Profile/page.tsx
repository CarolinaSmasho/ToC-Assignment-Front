// app/profile/page.tsx
import Sidebar from "@/components/Sidebar";

type ProfileField = {
  label: string;
  value: string;
};

const PROFILE_FIELDS: ProfileField[] = [
  { label: "Username", value: "Username" },
  { label: "Email", value: "s***k@company.com" },
  { label: "Date of Birth", value: "XX/XX/25XX" },
  { label: "Tel.", value: "XXX-XXX-4567" },
  {
    label: "Address",
    value: "XXX ซอยลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพฯ",
  },
  { label: "Credit card", value: "XXXX-XXXX-XXXX-1234" },
];

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 px-16 py-12">
        <h1 className="text-3xl text-gray-900">Profile</h1>

        <dl className="mt-12 grid max-w-3xl grid-cols-[180px_1fr] gap-y-10">
          {PROFILE_FIELDS.map((field) => (
            <div key={field.label} className="contents">
              <dt className="text-lg text-gray-900">{field.label}</dt>
              <dd className="text-lg text-gray-900">{field.value}</dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}