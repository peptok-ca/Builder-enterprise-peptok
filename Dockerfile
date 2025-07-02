# Multi-stage build for React frontend
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install git for potential git-based dependencies
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci for reproducible builds
RUN npm ci --only=production --no-audit --no-fund

# Copy source code (excluding files in .dockerignore)
COPY . .

# Ensure proper line endings for scripts (Windows compatibility)
RUN find . -type f -name "*.sh" -exec dos2unix {} \; 2>/dev/null || true

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Install dos2unix for handling Windows line endings
RUN apk add --no-cache dos2unix

# Copy built app to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration and fix line endings
COPY nginx.conf /tmp/nginx.conf
RUN dos2unix /tmp/nginx.conf && mv /tmp/nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx user if it doesn't exist and set proper permissions
RUN addgroup -g 101 -S nginx || true && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx || true && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Use non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
