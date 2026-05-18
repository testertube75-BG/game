# Redis Cluster Strategy

## Key layout

- `presence:{userId}`: current socket and room presence.
- `match:{game}:{region}`: sorted set of matchmaking tickets by rating and wait time.
- `room:snapshot:{roomId}`: compressed reconnect snapshot with TTL.
- `room:locks:{roomId}`: short-lived command processing lock.
- `rate:{scope}:{id}`: token bucket counters.
- `leaderboard:{game}:{season}`: sorted set of player ratings.

## Expiration policy

- Presence keys: 60 seconds, refreshed by heartbeat.
- Room snapshots: 30 minutes after room completion.
- Match tickets: 2 minutes, renewed by client queue heartbeat.
- Rate limit keys: duration of rate window plus 10 seconds.

## Consistency

Redis is used for coordination and speed. PostgreSQL remains the source of truth for identity, ledger, rooms, tournaments, and audit trails.
