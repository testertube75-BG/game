import { AppShell } from "../../../components/app-shell";

export default function GamePage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="aspect-square max-h-[720px] rounded-md border border-slate-200 bg-white p-4">
          <div className="grid h-full grid-cols-8 grid-rows-8 overflow-hidden rounded-md border border-slate-300">
            {Array.from({ length: 64 }).map((_, index) => (
              <div key={index} className={(Math.floor(index / 8) + index) % 2 === 0 ? "bg-slate-100" : "bg-mint/30"} />
            ))}
          </div>
        </div>
        <aside className="rounded-md border border-slate-200 bg-white p-4">
          <h1 className="text-xl font-semibold capitalize">{params.id} Room</h1>
          <div className="mt-4 space-y-3 text-sm text-steel">
            <p>Room status: active</p>
            <p>Server tick: 1284</p>
            <p>Reconnect window: 30 seconds</p>
          </div>
          <button className="mt-5 h-10 w-full rounded-md bg-coral text-sm font-semibold text-white">Resign</button>
        </aside>
      </section>
    </AppShell>
  );
}
