import React from "react";
import { createRoot } from "react-dom/client";
import { Trophy, Wallet } from "lucide-react";
import "./styles.css";

function TelegramApp() {
  return (
    <main className="shell">
      <header className="topbar">
        <strong>BCGS</strong>
        <button>Connect</button>
      </header>
      <section className="panel">
        <h1>Play Now</h1>
        <div className="grid">
          {["Chess", "Ludo", "Tash"].map((game) => (
            <button key={game} className="game">{game}</button>
          ))}
        </div>
      </section>
      <nav className="tabs">
        <button><Trophy size={18} />Tournaments</button>
        <button><Wallet size={18} />Wallet</button>
      </nav>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<TelegramApp />);
