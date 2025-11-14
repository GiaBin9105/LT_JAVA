import type { AuthProvider } from "react-admin";
import axios from "axios";

// ⚙️ URL backend (API Auth)
const apiUrl = "http://192.168.220.177:8080/api/auth";

export const authProvider: AuthProvider = {
  // 🔑 Đăng nhập
  login: async ({ username, password }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/login`, {
        email: username,
        password,
      });

      // ✅ Kiểm tra phản hồi hợp lệ
      if (!data?.accessToken || !data?.user) {
        return Promise.reject("Phản hồi không hợp lệ từ máy chủ!");
      }

      // ✅ Chỉ cho phép ADMIN đăng nhập dashboard
      if (data.user.role !== "ADMIN") {
        return Promise.reject("Bạn không có quyền truy cập!");
      }

      // ✅ Lưu token và thông tin user
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      return Promise.resolve();
    } catch (error: any) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      return Promise.reject("Sai tài khoản hoặc mật khẩu!");
    }
  },

  // 🚪 Đăng xuất
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    return Promise.resolve();
  },

  // 🔐 Kiểm tra đăng nhập
  checkAuth: () => {
    const token = localStorage.getItem("accessToken");
    return token ? Promise.resolve() : Promise.reject();
  },

  // 🧩 Xử lý lỗi 401 / 403
  checkError: (error) => {
    const status = error.status || error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("accessToken");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // 👤 Trả quyền truy cập
  getPermissions: async () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      return Promise.resolve(parsed.role);
    }
    return Promise.reject();
  },
};
