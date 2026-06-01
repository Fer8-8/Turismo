# Build stage
FROM node:22-slim AS builder

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy configuration files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# ... (después de pnpm install)
RUN npx prisma generate
RUN pnpm build
# Production stage
FROM node:22-slim AS runner

# Install openssl for Prisma runtime
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

ENV NODE_ENV=production
ENV STANDALONE=true

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose port (default NestJS 3000, adjust if necessary)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
