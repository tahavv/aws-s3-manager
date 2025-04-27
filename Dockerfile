# ------------------- Base Image -------------------
FROM node:18.18-alpine AS base
WORKDIR /app

# ------------------- Dependencies -------------------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ------------------- Builder -------------------
FROM base AS builder
ARG BUILD_ENV=production
ENV NEXT_PUBLIC_ENV=$BUILD_ENV
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Select appropriate env file based on build environment
RUN if [ "$BUILD_ENV" = "production" ]; then \
  [ -f .env.production ] && cp .env.production .env || true; \
  npm run build:prod; \
  else \
  [ -f .env.local ] && cp .env.local .env || true; \
  npm run build:dev; \
  fi

# ------------------- Production Image -------------------
FROM base AS production
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Ensure API routes are included (important for standalone mode)
COPY --from=builder --chown=nextjs:nodejs /app/src/app/api ./src/app/api

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]

# ------------------- Development Image -------------------
FROM base AS dev
ENV NODE_ENV=development

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]