# Stage 1: Build with Bun
FROM oven/bun:latest as builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies with bun
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Runtime with Bun
FROM oven/bun:latest

WORKDIR /app

# Install serve globally with bun
RUN bun install -g serve

# Copy built files from builder
COPY --from=builder /app/dist /app/dist

EXPOSE 5173

# Serve the application using serve
CMD ["serve", "-s", "dist", "-l", "5173"]
