import { Room, Client } from "colyseus";
import { nanoid } from "nanoid";
import type { GameCommand, GameEvent, GameKind } from "@bcgs/shared";

export interface PlayerSession {
  playerId: string;
  sequence: number;
  connected: boolean;
}

export abstract class BaseAuthoritativeRoom<TState> extends Room<TState> {
  protected abstract readonly game: GameKind;
  protected readonly players = new Map<string, PlayerSession>();
  protected serverTick = 0;

  abstract createInitialState(options: Record<string, unknown>): TState;
  abstract applyCommand(command: GameCommand): GameEvent[];

  onCreate(options: Record<string, unknown>): void {
    this.setState(this.createInitialState(options));
    this.setPatchRate(50);
    this.onMessage("command", (client, command: GameCommand) => this.handleCommand(client, command));
    this.onMessage("ack", (client, tick: number) => this.handleAck(client, tick));
  }

  onJoin(client: Client, options: { playerId?: string }): void {
    const playerId = options.playerId ?? client.sessionId;
    client.userData = { playerId };
    this.players.set(playerId, { playerId, sequence: 0, connected: true });
    this.broadcast("presence", { playerId, connected: true });
  }

  onLeave(client: Client): void {
    const playerId = client.userData?.playerId as string | undefined;
    if (!playerId) return;
    const session = this.players.get(playerId);
    if (session) session.connected = false;
    this.broadcast("presence", { playerId, connected: false });
    this.allowReconnection(client, 30);
  }

  private handleCommand(client: Client, command: GameCommand): void {
    const playerId = client.userData?.playerId as string | undefined;
    const session = playerId ? this.players.get(playerId) : undefined;
    if (!session || command.playerId !== playerId) {
      client.send("rejected", { commandId: command.commandId, reason: "unauthorized_player" });
      return;
    }
    if (command.sequence <= session.sequence) {
      client.send("rejected", { commandId: command.commandId, reason: "stale_sequence" });
      return;
    }

    session.sequence = command.sequence;
    const events = this.applyCommand(command).map((event) => ({
      ...event,
      eventId: event.eventId || nanoid(),
      roomId: this.roomId,
      serverTick: ++this.serverTick,
      createdAt: new Date().toISOString()
    }));

    for (const event of events) this.broadcast("event", event);
  }

  private handleAck(_client: Client, _tick: number): void {
    // Hook for Redis-backed replay cursor cleanup in production.
  }
}
