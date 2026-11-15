FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose port (default 5000)
EXPOSE 5000

# Use pm2 for process management (optional)
RUN npm install -g pm2
CMD ["pm2-runtime", "server.js"]
