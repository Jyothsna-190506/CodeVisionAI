# ==========================================
# CodeVision AI - Unified Full-Stack Dockerfile
# Multi-stage build for Render, Railway, Fly.io, Docker
# ==========================================

# Stage 1: Build React Frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# Stage 2: Production Server Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Install production dependencies for server
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy server code
COPY server/ ./server/

# Copy built frontend assets to client/dist
COPY --from=client-builder /app/client/dist ./client/dist

WORKDIR /app/server

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
