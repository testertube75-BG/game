# BCGS Gaming Platform Architecture

BCGS is split into stateless API services, stateful realtime shards, event streaming, durable PostgreSQL storage, Redis Cluster coordination, and EVM smart contracts on CORE DAO.

## Scale target

The target of 1,000,000+ concurrent users requires horizontal isolation:

- API Gateway: stateless NestJS pods behind NGINX or AWS ALB.
- Realtime: Colyseus room pods sharded by game, region, and room id.
- Matchmaking: Redis sorted sets plus Kafka events for durable queue telemetry.
- Game state: server-authoritative state in memory, periodic snapshots in Redis, final state in PostgreSQL.
- Wallets: chain listener workers reconcile deposits and withdrawals into a double-entry ledger.
- Admin: separate backend routes and role-gated UI.

## Critical production principles

- Clients submit commands, never final game state.
- Every command is sequence checked, rate limited, validated against authoritative rules, and emitted as a signed server event.
- Reconnect uses room id, player id, refresh token, last acknowledged server tick, and a Redis snapshot.
- Stakes and tournament rewards move through escrow contracts or a multi-signature treasury, never direct hot-wallet balance mutation.
- Leaderboards are eventually consistent from Kafka streams, while wallet balances are strongly consistent from PostgreSQL ledger entries.

## Suggested AWS topology

- EKS for API, realtime, workers, web, admin.
- Aurora PostgreSQL for ledger and identity.
- ElastiCache Redis Cluster for matchmaking, presence, and snapshots.
- MSK Kafka for game, wallet, notification, and anti-cheat streams.
- CloudFront CDN for Next.js assets and Flutter web assets.
- AWS Shield Advanced and WAF for DDoS protection.
- OpenTelemetry Collector, Prometheus, Grafana, Loki, and Tempo for observability.
