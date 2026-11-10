# Stage 1: Build the production bundle
FROM node:16-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve using Node.js and 'serve'
FROM node:16-alpine
WORKDIR /app

USER root
RUN npm install -g serve

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN mkdir -p /app/public && chown -R node:node /app

# Copy compiled files from builder stage
COPY --from=builder --chown=node:node /app/dist/* /app/public/

USER node

EXPOSE 4200

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
# -s flag enables Single Page Application fallback to index.html
# -l flag binds to port 4200
CMD ["serve", "-s", "/app/public", "-l", "4200"]
