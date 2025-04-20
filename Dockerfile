# ==== Stage 1: Build ====
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
# ARG NEXT_PUBLIC_... # Define build-time args if needed
# ENV NEXT_PUBLIC_... # Set build-time envs if needed
RUN npm run build

# ==== Stage 2: Production Runner ====
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/package.json ./package.json # Needed for start script if not standalone

# --- Option A: Standalone Output ---
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/public ./public # If needed by standalone
# COPY --from=builder /app/.next/static ./.next/static

--- Option B: Non-Standalone Output ---
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules # If not pruning in build stage
COPY --from=builder /app/public ./public

EXPOSE 3000
USER node

# --- Final CMD (Choose ONE) ---
# CMD ["node", "server.js"] # If using output: 'standalone'
CMD ["npm", "start"] # If NOT using output: 'standalone'
