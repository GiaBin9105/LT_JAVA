import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { FavoriteProvider } from "../context/FavoriteContext";

/**
 * 📱 Root Layout chính cho toàn bộ ứng dụng CoffeeShopApp
 * - Bao gồm Auth, Cart, Favorite context
 * - Sử dụng Stack để điều hướng các màn hình
 * - Tự động mở màn hình Welcome khi app khởi động
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <CartProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            {/* 🏁 Màn hình khởi động đầu tiên */}
            <Stack.Screen name="index" />

            {/* 🌅 Màn hình Welcome */}
            <Stack.Screen name="welcome" />

            {/* 🔐 Màn hình xác thực */}
            <Stack.Screen name="(auth)/signin" />
            <Stack.Screen name="(auth)/signup" />

            {/* 🧭 Tabs chính: Home, Cart, Favorite, Account */}
            <Stack.Screen name="(tabs)" />

            {/* ☕ Chi tiết sản phẩm */}
            <Stack.Screen name="detail" />
          </Stack>
        </CartProvider>
      </FavoriteProvider>
    </AuthProvider>
  );
}
