# Security Model

- JWT access tokens use short-lived RS256 signatures.
- Refresh tokens are stored as hashes and bound to platform, IP hash, and user agent.
- Telegram login validates HMAC over the official init data payload.
- Wallet login uses single-use nonces and EIP-191 signatures.
- API routes enforce rate limits and role-based authorization.
- Realtime commands are server-authoritative and sequence checked.
- Wallet mutations require idempotency keys and ledger transactions.
- Treasury movements require multi-signature approval.
- Admin actions are audit logged.
- DDoS protection is handled at CDN, WAF, ALB, and Kubernetes ingress layers.
