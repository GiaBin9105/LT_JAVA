// scripts/change-ip.js
import fs from "fs";
import path from "path";

// ✅ Lấy IP mới từ tham số dòng lệnh
// Ví dụ: npm run change-ip 192.168.100.65
const newIP = process.argv[2];

if (!newIP) {
  console.error("❌ Bạn chưa nhập IP mới! Ví dụ: npm run change-ip 192.168.100.65");
  process.exit(1);
}

// ✅ Regex tìm các IP cũ có dạng 192.168.xxx.xxx
const ipRegex = /192\.168\.\d{1,3}\.\d{1,3}/g;

// ✅ Các thư mục sẽ quét (có thể tùy chỉnh)
const TARGET_DIRS = ["app", "context", "src"];

// ✅ Hàm duyệt và thay IP trong từng file
function replaceIPInFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  if (ipRegex.test(content)) {
    const updated = content.replace(ipRegex, newIP);
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`✅ Đã cập nhật IP trong: ${filePath}`);
  }
}

// ✅ Duyệt toàn bộ thư mục
function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      traverseDir(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx")) {
      replaceIPInFile(fullPath);
    }
  }
}

// ✅ Chạy script
TARGET_DIRS.forEach((dir) => {
  if (fs.existsSync(dir)) traverseDir(dir);
});

console.log(`🎉 Hoàn tất! Tất cả IP đã được thay thành ${newIP}`);
