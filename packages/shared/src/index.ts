export type Platform = "android" | "ios" | "web" | "telegram";

export type GameKind = "chess" | "ludo" | "tash";

export type MatchStatus =
  | "queued"
  | "matched"
  | "starting"
  | "active"
  | "completed"
  | "abandoned";

export interface AuthenticatedUser {
  id: string;
  handle: string;
  roles: Array<"user" | "moderator" | "admin" | "treasury">;
  walletAddress?: `0x${string}`;
  telegramId?: string;
}

export interface MatchTicket {
  id: string;
  userId: string;
  game: GameKind;
  stakeToken: "CORE" | "BCGS" | "FREE";
  stakeAmount: string;
  region: string;
  skillRating: number;
  createdAt: string;
}

export interface RoomSnapshot<TState = unknown> {
  roomId: string;
  game: GameKind;
  status: MatchStatus;
  players: string[];
  spectatorCount: number;
  serverTick: number;
  state: TState;
}

export interface GameCommand<TPayload = unknown> {
  commandId: string;
  roomId: string;
  playerId: string;
  sequence: number;
  type: string;
  payload: TPayload;
  clientSentAt: string;
}

export interface GameEvent<TPayload = unknown> {
  eventId: string;
  roomId: string;
  serverTick: number;
  type: string;
  payload: TPayload;
  createdAt: string;
}

export interface WalletLedgerEntry {
  id: string;
  userId: string;
  asset: "CORE" | "BCGS";
  direction: "deposit" | "withdrawal" | "stake" | "reward" | "refund";
  amountAtomic: string;
  chainTxHash?: `0x${string}`;
  status: "pending" | "confirmed" | "failed" | "reversed";
}

export interface TournamentConfig {
  id: string;
  game: GameKind;
  name: string;
  startsAt: string;
  maxPlayers: number;
  entryAsset: "CORE" | "BCGS" | "FREE";
  entryAmountAtomic: string;
  prizePoolAtomic: string;
  format: "single_elimination" | "double_elimination" | "swiss" | "round_robin";
}
