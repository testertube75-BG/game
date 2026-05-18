# BCGS Gaming Platform

Production-oriented monorepo for a Web3 multiplayer gaming platform targeting Android, iOS, web, and Telegram Mini App clients.

## What is included

- NestJS API Gateway with authentication, matchmaking, wallet, tournament, and admin modules.
- Colyseus realtime service with server-authoritative room/session handling for Chess, Ludo, and Tash.
- Solidity contracts for BCGS token, game escrow, tournament rewards, and treasury multisig.
- Next.js web app with lobby, gameplay, wallet, tournament, and admin screens.
- React Telegram Mini App shell.
- Flutter mobile app shell for Android and iOS.
- PostgreSQL schema, Redis strategy, Dockerfiles, Kubernetes manifests, CI, and monitoring rules.

## Repository layout

```text
apps/
  api-gateway/   NestJS HTTP API
  realtime/      Colyseus WebSocket game shards
  web/           Next.js web and admin UI
  telegram/      Telegram Mini App
  mobile/        Flutter Android/iOS app
contracts/       Solidity contracts and deployment script
packages/
  shared/        Shared TypeScript contracts
  db/            PostgreSQL schema
infra/
  docker/        Production Dockerfiles
  k8s/           Kubernetes deployments and ingress
  monitoring/    Prometheus alert rules
docs/            Architecture, API, security, deployment, Redis strategy
```

## Local start

```bash
pnpm install
docker compose up -d
pnpm dev:api
pnpm dev:realtime
pnpm dev:web
```

## Production posture

The platform is designed around horizontal scaling and authoritative gameplay. Realtime rooms own active game state, Redis Cluster coordinates matchmaking and reconnect snapshots, Kafka carries event streams, PostgreSQL records durable identity and wallet state, and CORE DAO contracts custody tokenized stakes and rewards.

Before a real-money launch, complete external audits for contracts, wallet flows, anti-cheat models, operational runbooks, and regulatory requirements in each target market.
