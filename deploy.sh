#!/bin/bash

# =========================================================
# Kịch bản Deploy cho Dự án Golden Seafood Web
# =========================================================

echo "Bắt đầu quá trình deploy Golden Seafood..."

# Kiểm tra file .env.prod đã tồn tại chưa
if [ ! -f .env.prod ]; then
    echo "⚠️ CHÚ Ý: Chưa tìm thấy file .env.prod!"
    echo "Hệ thống sẽ tự động copy từ .env.prod.example..."
    cp .env.prod.example .env.prod
    echo "Vui lòng cấu hình lại mật khẩu trong file .env.prod, sau đó chạy lại lệnh ./deploy.sh nhé!"
    exit 1
fi

# Build và khởi chạy các container (sử dụng docker compose V2 và chỉ định file .env.prod)
docker compose --env-file .env.prod -f docker-compose.prod.yml up --build -d

echo "========================================================="
echo "✅ Quá trình Deploy hoàn tất!"
echo "Các container của Golden Seafood đang chạy:"
docker ps --filter "name=goldenseafood_"

echo ""
echo "📌 LƯU Ý CỔNG KẾT NỐI (PORT):"
echo "- Frontend (React): cổng 8003"
echo "- Backend API (Node.js): cổng 8090"
echo "- Database (MySQL): cổng 3308"
echo "Để kiểm tra log, sử dụng lệnh: docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f"
echo "========================================================="
