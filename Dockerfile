# Frontend
FROM node:24-alpine AS front-builder
WORKDIR /app/front
COPY front/package*.json ./
RUN npm install
COPY front/ .
RUN npm run build

# Backend
FROM node:24-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
COPY --from=front-builder /app/front/dist ./public
EXPOSE 3000
CMD ["npm", "start"]