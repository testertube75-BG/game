FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/realtime/package.json apps/realtime/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --filter @bcgs/realtime... --no-frozen-lockfile

FROM deps AS build
COPY apps/realtime apps/realtime
COPY packages/shared packages/shared
RUN pnpm --filter @bcgs/realtime build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/realtime/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 2567
CMD ["node", "dist/server.js"]
