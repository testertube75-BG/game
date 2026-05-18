# API Documentation

Base URL: `https://api.bcgs.example/v1`

## Authentication

`POST /auth/telegram`

Validates Telegram init data and returns RS256 JWT access and refresh tokens.

`POST /auth/wallet/nonce`

Creates a one-time wallet login nonce.

`POST /auth/wallet/verify`

Verifies an EIP-191 signature and links or signs in the user.

## Matchmaking

`POST /matchmaking/tickets`

Creates or replaces a queue ticket for the authenticated user.

`DELETE /matchmaking/tickets/:id`

Cancels a queue ticket.

## Wallet

`GET /wallet/balances`

Returns ledger-derived CORE and BCGS balances.

`POST /wallet/withdrawals`

Creates a withdrawal request with idempotency protection.

## Tournaments

`GET /tournaments`

Lists active and upcoming tournaments.

`POST /tournaments/:id/entries`

Registers the current user and stakes the entry fee.

## Admin

`GET /admin/users`

Searches users. Requires `admin` role.

`POST /admin/tournaments`

Creates a tournament. Requires `admin` role.

`GET /admin/anti-cheat/events`

Lists anti-cheat signals by severity and date.

## WebSocket protocol

Clients connect to `wss://rt.bcgs.example/:game/:roomId`.

Client messages:

- `command`: authoritative game command with `commandId`, `sequence`, and payload.
- `ack`: last processed server tick.
- `ping`: latency probe.

Server messages:

- `snapshot`: full room state.
- `event`: ordered game event.
- `rejected`: command rejection with reason.
- `presence`: player connection changes.
