import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

// ⚙️ URL backend API
const API_BASE = "http://192.168.220.177:8080/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🧠 Load user khi mở app
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setIsGuest(parsed?.isGuest || false);
        } else {
          setUser({ name: "Guest", isGuest: true });
          setIsGuest(true);
        }
      } catch (err) {
        console.log("❌ Lỗi khi load user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // 🔑 Đăng nhập (JWT)
  const login = async (email, password) => {
    if (!email || !password) throw new Error("Vui lòng nhập email và mật khẩu!");
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const { user, accessToken, refreshToken } = res.data;

      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      setUser(user);
      setIsGuest(false);
      return user;
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err.message);
      throw new Error("Sai tài khoản hoặc mật khẩu!");
    }
  };

  // 📝 Đăng ký (đã thêm address & phone)
  const signup = async (name, email, password, address, phone) => {
    if (!name || !email || !password || !address || !phone)
      throw new Error("Vui lòng điền đầy đủ thông tin!");
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, {
        name,
        email,
        password,
        address,
        phone,
      });
      return res.data;
    } catch (err) {
      console.error("❌ Lỗi đăng ký:", err.message);
      throw new Error(err.response?.data?.error || "Không thể đăng ký, vui lòng thử lại!");
    }
  };

  // 👤 Đăng nhập Guest
  const guestLogin = async () => {
    const guestUser = { name: "Guest", isGuest: true };
    setUser(guestUser);
    setIsGuest(true);
    await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
  };

  // 🚪 Đăng xuất
  const logout = async () => {
    const guestUser = { name: "Guest", isGuest: true };
    setUser(guestUser);
    setIsGuest(true);
    await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        loading,
        login,
        signup,
        logout,
        guestLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
