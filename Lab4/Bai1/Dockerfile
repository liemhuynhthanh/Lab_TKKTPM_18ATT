# Sử dụng base image Node.js 18
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file package.json vào container
COPY package.json .

# Cài đặt dependencies (ở đây không có nhưng vẫn nên giữ bước này)
RUN npm install

# Copy toàn bộ source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]