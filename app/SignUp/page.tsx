import Button from "@/components/Button";

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-bg-app px-6 py-16">
      <div className="app-glow" aria-hidden />

      <section className="panel relative w-full max-w-sm px-8 py-10 text-center shadow-panel">
        <span className="brand-mark mx-auto text-h1" aria-hidden>
          ฿
        </span>

        <h1 className="mt-6 text-display text-text-primary">พี่เมสั่งปิน</h1>
        <p className="eyebrow mt-2">Banking Service</p>

        <hr className="my-8 border-line" />

        <Button size="lg" fullWidth>
          Login
        </Button>

        <p className="mt-4 text-caption text-text-muted">
          เข้าสู่ระบบเพื่อดูยอดเงินและรายการเดินบัญชี
        </p>
      </section>
    </main>
  );
}
