import Link from "next/link";
import { Activity, Swords, Users } from "lucide-react";
import { AppShell } from "../components/app-shell";

const games = [
  { id: "chess", name: "Chess", players: "1v1", latency: "42 ms", pool: "18,420" },
  { id: "ludo", name: "Ludo", players: "2-4", latency: "55 ms", pool: "33,118" },
  { id: "tash", name: "Tash", players: "2-6", latency: "61 ms", pool: "9,774" }
];

export default function LobbyPage() {
  return (
    <AppShell>
      <section className="grid gap-4 md:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">Matchmaking Lobby</h1>
              <p className="mt-1 text-sm text-steel">Choose a game, stake mode, and region to enter a realtime room.</p>
            </div>
            <Activity className="h-7 w-7 text-mint" aria-hidden />
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.id}`}
                className="rounded-md border border-slate-200 p-4 transition hover:border-mint hover:shadow-sm"
              >
                <Swords className="h-5 w-5 text-coral" aria-hidden />
                <h2 className="mt-4 text-lg font-semibold">{game.name}</h2>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-steel">
                  <span>{game.players}</span>
                  <span>{game.latency}</span>
                  <span className="col-span-2 flex items-center gap-1">
                    <Users className="h-4 w-4" aria-hidden />
                    {game.pool} online
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <aside className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Queue Controls</h2>
          <div className="mt-4 space-y-3">
            <select className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm">
              <option>Asia low latency</option>
              <option>Europe</option>
              <option>North America</option>
            </select>
            <div className="grid grid-cols-3 gap-2">
              {["FREE", "BCGS", "CORE"].map((token) => (
                <button key={token} className="h-10 rounded-md border border-slate-300 text-sm font-medium hover:bg-slate-100">
                  {token}
                </button>
              ))}
            </div>
            <button className="h-11 w-full rounded-md bg-ink text-sm font-semibold text-white hover:bg-slate-700">
              Find Match
            </button>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
