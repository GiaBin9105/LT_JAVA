import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// ⚙️ URL backend API (Spring Boot chạy ở cổng 8080)
const API_URL = "http://192.168.142.177:8080/api";
// ⚠️ Thay IP thật khi test trên điện thoại thật

// ======== TOKEN XỬ LÝ ========
async function getAccessToken() {
  return await AsyncStorage.getItem("accessToken");
}
async function getRefreshToken() {
  return await AsyncStorage.getItem("refreshToken");
}
async function saveTokens(accessToken, refreshToken) {
  if (accessToken) await AsyncStorage.setItem("accessToken", accessToken);
  if (refreshToken) await AsyncStorage.setItem("refreshToken", refreshToken);
}

// ======== HÀM GỌI CHUNG (CÓ TỰ REFRESH TOKEN) ========
export async function callApi(endpoint, method = "GET", data = null) {
  const fullUrl = `${API_URL}/${endpoint}`;
  let accessToken = await getAccessToken();

  try {
    const response = await axios({
      method,
      url: fullUrl,
      data,
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    // Nếu token hết hạn → refresh lại
    if (error.response?.status === 401) {
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        return await axios({
          method,
          url: fullUrl,
          data,
          headers: {
            Authorization: `Bearer ${newAccess}`,
            "Content-Type": "application/json",
          },
        });
      }
    }
    throw error;
  }
}

// ======== HÀM REFRESH TOKEN ========
async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
    const { accessToken } = res.data;
    await AsyncStorage.setItem("accessToken", accessToken);
    console.log("♻️ Token refreshed successfully!");
    return accessToken;
  } catch (err) {
    console.log("❌ Refresh token failed:", err.message);
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
    return null;
  }
}

// ======== AUTH: LOGIN + REGISTER ========

// 🔑 Đăng nhập
export async function POST_LOGIN(email, password) {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    console.log("✅ Login response:", res.data);

    const { accessToken, refreshToken, user } = res.data;
    await saveTokens(accessToken, refreshToken);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    alert("🎉 Đăng nhập thành công!");
    return user;
  } catch (error) {
    console.error("❌ Login error:", error.response?.data || error.message);
    alert("Đăng nhập thất bại, kiểm tra lại thông tin!");
    throw error;
  }
}

// 📝 Đăng ký
export async function POST_REGISTER(data) {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, data);
    console.log("✅ Register response:", res.data);
    alert("🎉 Đăng ký thành công!");
    return res.data;
  } catch (error) {
    console.error("❌ Register error:", error.response?.data || error.message);
    alert("Đăng ký thất bại!");
    throw error;
  }
}

// ======== CÁC HÀM CRUD CHUNG ========
export function GET_ALL(endpoint) {
  return callApi(endpoint, "GET");
}
export function GET_ID(endpoint, id) {
  return callApi(`${endpoint}/${id}`, "GET");
}
export function POST_ADD(endpoint, data) {
  return callApi(endpoint, "POST", data);
}
export function PUT_EDIT(endpoint, data) {
  return callApi(endpoint, "PUT", data);
}
export function DELETE_ID(endpoint, id) {
  return callApi(`${endpoint}/${id}`, "DELETE");
}

// ======== PRODUCT ========
export async function GET_PRODUCTS() {
  return callApi("public/products", "GET");
}

// ======== CART & ORDER ========
export async function ADD_TO_CART(userId, productId) {
  return callApi(`public/cart/add/${userId}/${productId}`, "POST");
}
export async function GET_CART(userId) {
  return callApi(`public/cart/${userId}`, "GET");
}
export async function CLEAR_CART(userId) {
  return callApi(`public/cart/clear/${userId}`, "DELETE");
}
export async function CHECKOUT(userId) {
  return callApi(`public/orders/checkout/${userId}`, "POST");
}
export async function GET_ORDERS(userId) {
  return callApi(`public/orders/user/${userId}`, "GET");
}
