# Stage 1: Build the production bundle
FROM node:16-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve using Node.js and 'serve'
FROM node:16-alpine
WORKDIR /app

RUN npm install -g serve

USER node

# Copy compiled files from builder stage
COPY --from=builder --chown=node:node /app/dist/* /app/public/

EXPOSE 4200

# -s flag enables Single Page Application fallback to index.html
# -l flag binds to port 4200
CMD ["serve", "-s", "/app/public", "-l", "4200"]
