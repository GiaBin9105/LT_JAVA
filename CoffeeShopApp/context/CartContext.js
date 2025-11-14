import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isGuest } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://192.168.220.177:8080/api/public/carts";

  // 🧭 Lấy giỏ hàng từ backend thật
  const fetchCart = async () => {
    if (!user?.id || isGuest) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCart(
          data.items?.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price:
              item.priceAtAdd ||
              item.product[`price${item.size}`] ||
              item.product.priceM ||
              0,
            image: item.product.image,
            quantity: item.quantity,
            size: item.size || "M",
            cartItemId: item.id,
          })) || []
        );
      } else {
        console.error("❌ Lỗi load cart:", res.status);
      }
    } catch (e) {
      console.error("❌ Fetch cart error:", e);
    } finally {
      setLoading(false);
    }
  };

  // 🛒 Thêm sản phẩm vào giỏ (API thật có size)
  const addToCart = async (product) => {
    if (!user?.id || isGuest) {
      alert("Please sign in to add items to cart ☕");
      return;
    }
    try {
      const size = product.size || "M";
      const res = await fetch(
        `${BASE_URL}/${user.id}/add/${product.id}?size=${size}`,
        { method: "POST" }
      );
      if (res.ok) {
        console.log("✅ Add to cart success!");
        await fetchCart();
      } else {
        const msg = await res.text();
        console.error("❌ Add cart failed:", msg);
      }
    } catch (e) {
      console.error("❌ Add cart error:", e);
    }
  };

  // ➕ Tăng số lượng (client-only tạm thời)
  const increaseQty = async (id) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const updated = cart.map((i) =>
      i.id === id ? { ...i, quantity: i.quantity + 1 } : i
    );
    setCart(updated);
  };

  // ➖ Giảm số lượng
  const decreaseQty = async (id) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.quantity - 1;
    if (newQty <= 0) return removeFromCart(id);
    const updated = cart.map((i) =>
      i.id === id ? { ...i, quantity: newQty } : i
    );
    setCart(updated);
  };

  // 🗑️ Xóa sản phẩm
  const removeFromCart = async (id) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    try {
      await fetch(`${BASE_URL}/item/${item.cartItemId}`, { method: "DELETE" });
      setCart(cart.filter((i) => i.id !== id));
      console.log("🗑️ Removed item:", id);
    } catch (e) {
      console.error("❌ removeFromCart error:", e);
    }
  };

  // 🧹 Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${BASE_URL}/${user.id}/clear`, {
        method: "DELETE",
      });
      if (res.ok) {
        console.log("🧹 Cleared cart!");
        setCart([]);
      } else {
        console.error("❌ clearCart failed:", res.status);
      }
    } catch (e) {
      console.error("❌ clearCart error:", e);
    }
  };

  // 💰 Tính tổng tiền
  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // 💳 Thanh toán → tạo Order thật
  const checkout = async () => {
    if (cart.length === 0 || isGuest) return;

    const orderData = {
      userId: user.id,
      total,
      items: cart.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
        price: i.price,
        size: i.size,
      })),
    };

    try {
      const res = await fetch("http://192.168.220.177:8080/api/public/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        await clearCart();
        console.log("✅ Checkout thành công!");
      } else {
        console.error("❌ Checkout failed:", res.status);
      }
    } catch (e) {
      console.error("❌ Checkout error:", e);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        total,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        checkout,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
