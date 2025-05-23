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
# --- REMOVED COMMENT FROM THIS LINE ---
COPY --from=builder /app/package.json ./package.json

# --- Option A: Standalone Output (Commented out) ---
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/public ./public # If needed by standalone
# COPY --from=builder /app/.next/static ./.next/static

# --- Option B: Non-Standalone Output (Uncommented) ---
COPY --from=builder /app/.next ./.next
# --- REMOVED COMMENT FROM THIS LINE ---
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

EXPOSE 3000
USER node

# --- Final CMD (Choose ONE) ---
# CMD ["node", "server.js"] # (Commented out - for standalone)
#CMD ["npm", "start"]      # (Uncommented - for non-standalone)
CMD npm start