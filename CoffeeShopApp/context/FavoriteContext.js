import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { user, isGuest } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⚙️ API backend thật
  const BASE_URL = "http://192.168.220.177:8080/api/public/favorites";

  // 🧭 Lấy danh sách yêu thích của user
  const fetchFavorites = async () => {
    if (!user?.id || isGuest) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        // ✅ Map dữ liệu từ Favorite -> Product
        setFavorites(
          data.map((fav) => ({
            id: fav.product.id,
            name: fav.product.name,
            price: fav.product.price,
            image: fav.product.image,
          })) || []
        );
      } else {
        console.error("❌ Lỗi load favorites:", res.status);
      }
    } catch (e) {
      console.error("❌ Fetch favorites error:", e);
    } finally {
      setLoading(false);
    }
  };

  // ❤️ Thêm / Xoá sản phẩm yêu thích
  const toggleFavorite = async (product) => {
    if (!user?.id || isGuest) {
      alert("Please sign in to manage favorites ☕");
      return;
    }

    const exists = favorites.some((p) => p.id === product.id);
    const url = `${BASE_URL}/${user.id}/${product.id}`;
    const method = exists ? "DELETE" : "POST";

    try {
      const res = await fetch(url, { method });
      if (res.ok) {
        console.log(exists ? "💔 Removed favorite" : "❤️ Added favorite");
        await fetchFavorites();
      } else {
        console.error("❌ Toggle favorite failed:", await res.text());
      }
    } catch (e) {
      console.error("❌ Toggle favorite error:", e);
    }
  };

  // 🗑️ Xóa toàn bộ danh sách yêu thích (tùy chọn)
  const clearFavorites = () => setFavorites([]);

  // 🔁 Tự động load mỗi khi user thay đổi
  useEffect(() => {
    fetchFavorites();
  }, [user]);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        loading,
        toggleFavorite,
        clearFavorites,
        fetchFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);
