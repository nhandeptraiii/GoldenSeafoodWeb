# ===== Golden Seafood Backend Dockerfile =====
# Node.js 20 LTS Alpine - nhẹ, bảo mật

FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files trước để tận dụng Docker cache layer
COPY package*.json ./

# Cài chỉ production dependencies (không có devDependencies)
RUN npm ci --only=production

# Copy toàn bộ source code
COPY src/ ./src/

# Tạo thư mục uploads (sẽ được mount bởi Docker volume)
RUN mkdir -p uploads

# Expose port 3000
EXPOSE 3000

# Chạy app bằng node (không dùng nodemon trong production)
CMD ["node", "src/app.js"]
