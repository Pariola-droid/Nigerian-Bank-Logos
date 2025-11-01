# Using a specific version of Alpine for deterministic builds.
FROM node:25-alpine AS base
WORKDIR /app

# This stage is dedicated to installing dependencies and will be cached by Docker
# unless package.json or pnpm-lock.yaml changes.
FROM base AS deps
# Install necessary tools for pnpm
RUN npm install -g pnpm

# Copy only the files required for dependency installation to leverage build cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm's --frozen-lockfile for CI environments
RUN pnpm i --frozen-lockfile

# This stage builds the Next.js application using the dependencies from the 'deps' stage.
FROM base AS builder
WORKDIR /app
ENV NODE_ENV=production

# Declare build-time arguments for public environment variables
ARG NEXT_PUBLIC_ROOT_DOMAIN
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS

# Set environment variables from the build arguments
ENV NEXT_PUBLIC_ROOT_DOMAIN=$NEXT_PUBLIC_ROOT_DOMAIN
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS=$NEXT_PUBLIC_GOOGLE_ANALYTICS

# Copy dependencies from the previous stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application source code
COPY . .

# Disable Next.js telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application. This requires the `output: 'standalone'`
# setting in next.config.mjs for an optimized production server.
RUN npm install -g pnpm
RUN pnpm build

# This is the final, minimal image that will run in production.
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder stage. This includes only the
# necessary files to run the Next.js server, dramatically reducing image size.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy the public and static assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck to ensure the server is running correctly
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start the server
CMD ["node", "server.js"]