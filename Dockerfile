# --- Stage 1: Builder ---
  FROM node:20-alpine AS builder
  
  WORKDIR /app
  
  # Copy config files
  COPY package*.json ./
  COPY tsconfig*.json ./
  
  # Install ALL dependencies (including devDependencies for building)
  RUN npm ci
  
  # Copy source code
  COPY src/ src/
  
  # Build the app (creates /dist folder)
  RUN npm run build
  
  # --- Stage 2: Runner ---
  FROM node:20-alpine AS runner
  
  WORKDIR /app
  
  # Copy package.json for production install
  COPY package*.json ./
  
  # Install ONLY production dependencies (saves space)
  RUN npm ci --only=production
  
  # Copy built code from Stage 1
  COPY --from=builder /app/dist ./dist
  
  # Expose the port
  EXPOSE 3000
  
  # Start the app
  CMD ["node", "dist/main"]