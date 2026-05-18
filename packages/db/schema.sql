CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin', 'treasury');
CREATE TYPE game_kind AS ENUM ('chess', 'ludo', 'tash');
CREATE TYPE match_status AS ENUM ('queued', 'matched', 'starting', 'active', 'completed', 'abandoned');
CREATE TYPE wallet_asset AS ENUM ('CORE', 'BCGS');
CREATE TYPE ledger_direction AS ENUM ('deposit', 'withdrawal', 'stake', 'reward', 'refund');
CREATE TYPE ledger_status AS ENUM ('pending', 'confirmed', 'failed', 'reversed');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  handle CITEXT UNIQUE NOT NULL,
  email CITEXT UNIQUE,
  telegram_id TEXT UNIQUE,
  wallet_address TEXT UNIQUE,
  password_hash TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES users(id),
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  PRIMARY KEY (user_id, role)
);

CREATE TABLE refresh_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  platform TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);

CREATE TABLE player_ratings (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game game_kind NOT NULL,
  rating INTEGER NOT NULL DEFAULT 1200,
  volatility INTEGER NOT NULL DEFAULT 350,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, game)
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game game_kind NOT NULL,
  status match_status NOT NULL,
  region TEXT NOT NULL,
  stake_asset TEXT NOT NULL,
  stake_amount_atomic NUMERIC(78, 0) NOT NULL DEFAULT 0,
  realtime_shard TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE room_players (
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  seat_index INTEGER NOT NULL,
  connected BOOLEAN NOT NULL DEFAULT FALSE,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  result TEXT,
  PRIMARY KEY (room_id, user_id),
  UNIQUE (room_id, seat_index)
);

CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game game_kind NOT NULL,
  name TEXT NOT NULL,
  format TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  max_players INTEGER NOT NULL,
  entry_asset TEXT NOT NULL,
  entry_amount_atomic NUMERIC(78, 0) NOT NULL,
  prize_pool_atomic NUMERIC(78, 0) NOT NULL,
  reward_contract TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tournament_entries (
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  seed INTEGER,
  eliminated_at TIMESTAMPTZ,
  final_rank INTEGER,
  PRIMARY KEY (tournament_id, user_id)
);

CREATE TABLE wallet_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  asset wallet_asset NOT NULL,
  direction ledger_direction NOT NULL,
  amount_atomic NUMERIC(78, 0) NOT NULL,
  chain_id INTEGER,
  chain_tx_hash TEXT,
  status ledger_status NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);

CREATE TABLE anti_cheat_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  room_id UUID REFERENCES rooms(id),
  severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 5),
  signal TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rooms_game_status_region ON rooms(game, status, region);
CREATE INDEX idx_room_players_user ON room_players(user_id);
CREATE INDEX idx_wallet_ledger_user_asset ON wallet_ledger(user_id, asset);
CREATE INDEX idx_anti_cheat_created ON anti_cheat_events(created_at DESC);
