# Stage 1: Build the React client
FROM node:20 AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup the PTY Node.js server
FROM node:20-slim

# Install system dependencies needed for compiling node-pty (gcc, g++, make, python3)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install --prefix server --omit=dev

COPY server/ ./server/
COPY --from=client-builder /app/client/dist ./client/dist

EXPOSE 3001
ENV PORT=3001
CMD ["npm", "start"]
