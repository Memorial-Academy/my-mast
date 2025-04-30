# build everything
FROM node:22-alpine AS base
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
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile

#####
# Build the NextJS application as a standalone server
#####
FROM base AS build
WORKDIR /app
## copy all the source code & config files
COPY . ./
## copy dependencies
COPY --from=initialize /app/node_modules ./node_modules
COPY --from=initialize /app/apps/client/node_modules ./apps/client/node_modules
COPY --from=initialize /app/apps/admin/node_modules ./apps/admin/node_modules
COPY --from=initialize /app/apps/server/node_modules ./apps/server/node_modules
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
COPY --from=build /app/node_modules ./node_modules

ENV PORT=5000
EXPOSE 5000

CMD ["node", "/app/apps/server/dist/app.js"]