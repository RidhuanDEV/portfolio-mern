FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

## Development image (for local dev with nodemon)
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 5000
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

## Production image (minimal, installs only production deps)
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]

