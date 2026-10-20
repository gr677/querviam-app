# Production multi-stage Dockerfile for Google Cloud Run
# Stage 1: Build the Vite frontend bundle
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN mkdir -p /app/exports
RUN npm run build

# Stage 2: Production runtime image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps && npm install tsx --legacy-peer-deps

# Copy built frontend assets and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/exports ./exports
COPY --from=builder /app/server.ts ./server.ts

# Ensure runtime directory permissions
RUN mkdir -p /app/exports /app/shared_stories && chown -R node:node /app

USER node
EXPOSE 8080

CMD ["npx", "tsx", "server.ts"]
