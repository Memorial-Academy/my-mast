# build everything
FROM node:22-alpine AS base

# Take in args/env values
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ADMIN_URL
ARG NEXT_PUBLIC_PARENT_AGREEMENT
ARG NEXT_PUBLIC_VOLUNTEER_AGREEMENT
ARG NEXT_PUBLIC_MYMAST_URL

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV HOSTNAME="0.0.0.0"
RUN apk update && apk add --no-cache libc6-compat && corepack enable pnpm

#####
# Install dependencies and source code
#####
FROM base AS initialize
WORKDIR /app
# Copy config files
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
COPY ./pnpm-workspace.yaml ./
COPY ./turbo.json ./
# append symlink settings to pnpm-workspace
# RUN echo "nodeLinker: hoisted" >> pnpm-workspace.yaml && echo "symlink: false" >> pnpm-workspace.yaml
# Copy needed packages and apps
COPY ./apps ./apps
COPY ./packages ./packages
# install dependencies

## build target to install all dependencies (for `build` stage)
FROM initialize AS all-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile

# build target to install only production dependencies (to be used later by certain non-bundled apps)
FROM initialize AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile --prod

#####
# Build the NextJS application as a standalone server
#####
FROM base AS build
WORKDIR /app
ENV NODE_ENV=production
## copy all the source code & config files
COPY . ./
## copy dependencies
COPY --from=all-deps /app/node_modules ./node_modules
COPY --from=all-deps /app/apps/client/node_modules ./apps/client/node_modules
COPY --from=all-deps /app/apps/admin/node_modules ./apps/admin/node_modules
COPY --from=all-deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=all-deps /app/packages/api/node_modules ./packages/api/node_modules
COPY --from=all-deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=all-deps /app/packages/utils/node_modules ./packages/utils/node_modules
# build time
RUN pnpm run build

##### DEPLOYMENTS (build targets) #####

#####
# Prepare "client" app deployment from `build`
# TARGET: `deploy-client`
#####
FROM base AS deploy-client
ENV NODE_ENV=production
COPY --from=build /app/apps/client/.next/standalone/apps/client ./apps/client
COPY --from=build /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=build /app/apps/client/public ./apps/client/public
COPY --from=build /app/apps/client/.next/standalone/node_modules ./node_modules

ENV PORT=3000
EXPOSE 3000

CMD ["node", "./apps/client/server.js"]

#####
# Prepare "admin" app deployment from `build`
# TARGET: `deploy-admin`
#####
FROM base AS deploy-admin
ENV NODE_ENV=production
COPY --from=build /app/apps/admin/.next/standalone/apps/admin ./apps/admin
COPY --from=build /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=build /app/apps/admin/public ./apps/admin/public
COPY --from=build /app/apps/admin/.next/standalone/node_modules ./node_modules

ENV PORT=3001
EXPOSE 3001

CMD ["node", "./apps/admin/server.js"]

#####
# Prepare "server" app deployment from `build`
# TARGET: `deploy-server`
#####
FROM base AS deploy-server
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=build /app/apps/server/templates ./apps/server/templates
COPY --from=build /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=build /app/apps/server/package.json ./apps/server/package.json
COPY --from=prod-deps /app/node_modules ./node_modules

ENV PORT=5000
EXPOSE 5000

CMD ["node", "/app/apps/server/dist/app.js"]