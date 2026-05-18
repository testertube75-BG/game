import { AppShell } from "../../components/app-shell";

export default function TournamentsPage() {
  return (
    <AppShell>
      <div className="rounded-md border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-semibold">Tournaments</h1>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 text-steel">
              <tr>
                <th className="py-3">Name</th>
                <th>Game</th>
                <th>Format</th>
                <th>Entry</th>
                <th>Prize Pool</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-medium">BCGS Daily Chess Arena</td>
                <td>Chess</td>
                <td>Swiss</td>
                <td>1 BCGS</td>
                <td>750 BCGS</td>
                <td><button className="h-9 rounded-md bg-ink px-3 text-white">Enter</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
