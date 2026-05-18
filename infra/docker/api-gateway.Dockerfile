FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/api-gateway/package.json apps/api-gateway/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --filter @bcgs/api-gateway... --no-frozen-lockfile

FROM deps AS build
COPY apps/api-gateway apps/api-gateway
COPY packages/shared packages/shared
RUN pnpm --filter @bcgs/api-gateway build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api-gateway/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
