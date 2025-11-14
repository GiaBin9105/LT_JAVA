// EXAMPLE05/scripts/change-ip.js
import fs from "fs";
import path from "path";

const newIP = process.argv[2];
if (!newIP) {
  console.error("❌ Bạn chưa nhập IP mới! Ví dụ: npm run change-ip 192.168.100.65");
  process.exit(1);
}

// Regex tìm IP cũ dạng 192.168.xxx.xxx
const ipRegex = /192\.168\.\d{1,3}\.\d{1,3}/g;

// Các loại file có thể chứa IP
const EXTENSIONS = [".java", ".properties"];

// Hàm cập nhật IP trong file
function updateIPInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    if (ipRegex.test(content)) {
      const updated = content.replace(ipRegex, newIP);
      fs.writeFileSync(filePath, updated, "utf8");
      console.log("🔄 Updated:", filePath);
    }
  } catch (err) {
    console.error("⚠️ Lỗi đọc file:", filePath, err.message);
  }
}

// Duyệt toàn bộ project
function scanDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (EXTENSIONS.includes(path.extname(fullPath))) {
      updateIPInFile(fullPath);
    }
  });
}

// Bắt đầu quét từ thư mục hiện tại (EXAMPLE05)
console.log(`🚀 Đang cập nhật IP trong backend EXAMPLE05...`);
scanDir(path.resolve("."));
console.log(`✅ Hoàn tất! IP mới: ${newIP}`);
