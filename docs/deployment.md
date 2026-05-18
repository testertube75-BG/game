# Deployment Guide

## Local development

1. Copy `.env.example` to `.env`.
2. Install Node dependencies with `pnpm install`.
3. Start local infrastructure with `docker compose up -d`.
4. Run `pnpm dev:api`, `pnpm dev:realtime`, and `pnpm dev:web`.

## Production release

1. Build and test all packages with `pnpm build && pnpm test`.
2. Build container images using the Dockerfiles in `infra/docker`.
3. Push images to ECR or another trusted registry.
4. Apply Kubernetes manifests from `infra/k8s`.
5. Run database migrations against Aurora PostgreSQL.
6. Deploy smart contracts to CORE DAO using a hardware-wallet controlled deployer.
7. Configure CloudFront, WAF, Shield, TLS certificates, and DNS.

## Scaling knobs

- Scale API Gateway by CPU, latency, and request rate.
- Scale realtime pods by active rooms and event-loop lag.
- Scale matchmaking workers by queue depth.
- Partition Kafka topics by `game-region-roomId`.
- Keep Colyseus room process memory below 65% to leave room for reconnect bursts.
