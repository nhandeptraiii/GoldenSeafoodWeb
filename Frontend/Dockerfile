# ===== Golden Seafood Frontend Dockerfile =====
# Multi-stage build: Node build → nginx serve

# ── Stage 1: Build React/Vite app ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đủ dependencies (bao gồm devDependencies để build)
RUN npm ci

# Copy toàn bộ source
COPY . .

# Build production bundle
# VITE_API_BASE_URL được inject lúc build qua ARG
ARG VITE_API_BASE_URL=https://goldensf.crmkhdncto.id.vn/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── Stage 2: Serve static files với nginx:alpine ───────────────────────────
FROM nginx:alpine

# Copy kết quả build từ stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy cấu hình nginx nội bộ
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
