FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Install yarn
RUN apk add --no-cache libc6-compat && \
    corepack enable && \
    corepack prepare yarn@1.22.22 --activate

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./
COPY scripts ./scripts

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Install yarn
RUN apk add --no-cache libc6-compat && \
    corepack enable && \
    corepack prepare yarn@1.22.22 --activate

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./
COPY scripts ./scripts

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Change ownership of the working directory to the non-root user
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
