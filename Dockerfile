# syntax=docker/dockerfile:1
FROM node:24-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=secret,id=node_auth_token \
    NODE_AUTH_TOKEN=$(cat /run/secrets/node_auth_token) \
    pnpm install --frozen-lockfile --prod

FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=secret,id=node_auth_token \
    NODE_AUTH_TOKEN=$(cat /run/secrets/node_auth_token) \
    pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
EXPOSE 3001
CMD ["node", "dist/main"]
