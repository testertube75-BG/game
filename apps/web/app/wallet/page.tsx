import { AppShell } from "../../components/app-shell";

export default function WalletPage() {
  return (
    <AppShell>
      <section className="grid gap-4 md:grid-cols-2">
        {["CORE", "BCGS"].map((asset) => (
          <div key={asset} className="rounded-md border border-slate-200 bg-white p-5">
            <h1 className="text-xl font-semibold">{asset}</h1>
            <p className="mt-3 text-3xl font-semibold">0.00</p>
            <div className="mt-5 flex gap-2">
              <button className="h-10 flex-1 rounded-md bg-ink text-sm font-semibold text-white">Deposit</button>
              <button className="h-10 flex-1 rounded-md border border-slate-300 text-sm font-semibold">Withdraw</button>
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
