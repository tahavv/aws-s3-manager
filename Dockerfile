# Use Node base image
FROM node:18.18-alpine AS base
WORKDIR /app

# -------------------------------------
# Dependencies Layer
# -------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# -------------------------------------
# Development Build
# -------------------------------------
FROM base AS dev-builder
ENV NODE_ENV=development
ENV NEXT_PUBLIC_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN cp .env.local .env
RUN npm run build:dev

# -------------------------------------
# Production Build
# -------------------------------------
FROM base AS prod-builder
ENV NODE_ENV=production
ENV NEXT_PUBLIC_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN cp .env.production .env
RUN npm run build:prod

# -------------------------------------
# Runtime Image
# -------------------------------------
FROM base AS runner
WORKDIR /app
ENV PORT=3000
EXPOSE 3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Choose the build to copy from using build args
ARG BUILD_ENV=production

# Copy build output
COPY --from=prod-builder /app/public ./public
COPY --from=prod-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=prod-builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Use dev build conditionally
# This is evaluated at build time!
RUN if [ "$BUILD_ENV" = "development" ]; then \
    echo "Using dev build..." && \
    cp -r /app/public /app && \
    cp -r /app/.next /app; \
  fi

USER nextjs
CMD ["node", "server.js"]
