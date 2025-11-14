import axios from "axios";
import type { DataProvider } from "react-admin";

// ⚙️ URL backend (LAN IP)
const apiUrl = "http://192.168.220.177:8080/api";

// ✅ Tạo axios instance chung
const api = axios.create({ baseURL: apiUrl });

// 🧠 Interceptor 1: tự động gắn token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔁 Interceptor 2: tự refresh token nếu hết hạn (401)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const originalRequest = error.config;

    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${apiUrl}/auth/refresh`, { refreshToken });
        localStorage.setItem("accessToken", data.accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        return api(originalRequest); // thử lại request cũ
      } catch (e) {
        console.error("❌ Token refresh failed:", e);
        localStorage.clear();
      }
    }
    return Promise.reject(error);
  }
);

// =====================================================
// ✅ CÁC API CHÍNH CHO REACT ADMIN
// =====================================================
export const dataProvider: DataProvider = {
  // 🟢 GET ALL (Danh sách)
  getList: async (resource) => {
    try {
      const { data } = await api.get(`/admin/${resource}`);
      const list = Array.isArray(data) ? data : data.data || [];
      return { data: list, total: list.length };
    } catch (error) {
      console.error(`❌ GET LIST failed for ${resource}`, error);
      throw new Error("Không thể tải danh sách.");
    }
  },

  // 🟢 GET ONE
  getOne: async (resource, params) => {
    const { data } = await api.get(`/admin/${resource}/${params.id}`);
    return { data };
  },

  // 🟢 CREATE
  create: async (resource, params) => {
    const { data } = await api.post(`/admin/${resource}`, params.data);
    return { data };
  },

  // 🟢 UPDATE
  update: async (resource, params) => {
    const { data } = await api.put(`/admin/${resource}/${params.id}`, params.data);
    return { data };
  },

  // 🟢 DELETE
  delete: async (resource, params) => {
    await api.delete(`/admin/${resource}/${params.id}`);
    return { data: params.previousData as any };
  },

  // 🟢 GET MANY (nhiều ID)
  getMany: async (resource, params) => {
    const { data } = await api.get(`/admin/${resource}`);
    const list = Array.isArray(data) ? data : data.data || [];
    const filtered = list.filter((r: any) => params.ids.includes(r.id));
    return { data: filtered };
  },

  // 🟢 GET MANY REFERENCE (quan hệ)
  getManyReference: async (resource) => {
    const { data } = await api.get(`/admin/${resource}`);
    const list = Array.isArray(data) ? data : data.data || [];
    return { data: list, total: list.length };
  },

  // 🟢 DELETE MANY
  deleteMany: async (resource, params) => {
    await Promise.all(params.ids.map((id) => api.delete(`/admin/${resource}/${id}`)));
    return { data: [] };
  },

  // 🟢 UPDATE MANY
  updateMany: async (resource, params) => {
    const results = await Promise.all(
      params.ids.map((id) => api.put(`/admin/${resource}/${id}`, params.data))
    );
    return { data: results.map((r) => r.data.id) };
  },
};
