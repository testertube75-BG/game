import { AppShell } from "../../components/app-shell";

const metrics = [
  ["Active rooms", "0"],
  ["Users online", "0"],
  ["Wallet queue", "0"],
  ["Anti-cheat signals", "0"]
];

export default function AdminPage() {
  return (
    <AppShell>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-md border border-slate-200 bg-white p-4">
            <p className="text-sm text-steel">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </section>
      <section className="mt-4 rounded-md border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold">Anti-cheat Dashboard</h1>
        <div className="mt-4 h-52 rounded-md border border-dashed border-slate-300 bg-slate-50" />
      </section>
    </AppShell>
  );
}
