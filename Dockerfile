# --- Stage 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy config files
COPY package*.json ./
COPY tsconfig*.json ./

# Install build tools required for native modules (bcrypt, etc.) and install deps
RUN apk add --no-cache python3 make g++ git \
  && npm ci

# Copy source code
COPY src/ src/

# Build the app (creates /dist folder)
RUN npm run build

# --- Stage 2: Runner ---
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package.json for metadata
COPY package*.json ./

# Set production env
ENV NODE_ENV=production

# Copy node_modules and built code from builder to avoid rebuilding native modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
