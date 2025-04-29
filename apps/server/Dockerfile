# MyMAST server (ExpressJS application)
FROM node:22-alpine

RUN corepack enable pnpm && pnpm i && pnpm build

# Environment variables
ENV NODE_ENV=production

EXPOSE 5000

CMD [ "node", "dist/app.js" ]