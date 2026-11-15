FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN DATABASE_URL=postgresql://nura_app:build_only@localhost:5432/nura npm run db:generate

COPY src ./src

EXPOSE 5001

CMD ["sh", "-c", "npm run db:deploy && npm start"]
