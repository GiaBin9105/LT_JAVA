import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Account() {
  const { user, isGuest, logout } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const BASE_URL = "http://192.168.220.177:8080/api";

  // 📦 Load danh sách đơn hàng
  const fetchOrders = async () => {
    if (!user || user.isGuest) return;
    try {
      setLoading(true);
      const orderRes = await fetch(`${BASE_URL}/public/orders/user/${user.id}`);
      if (!orderRes.ok) throw new Error("Failed to load orders");
      const orderData = await orderRes.json();
      setOrders(orderData);
    } catch (err) {
      console.error("❌ Load orders failed:", err);
      Alert.alert("Error", "Cannot load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // 👤 Nếu là khách
  if (isGuest || user?.isGuest) {
    return (
      <View style={styles.guestContainer}>
        <Image
          source={require("../../assets/images/guest.png")}
          style={styles.guestAvatar}
        />
        <Text style={styles.guestName}>Guest</Text>
        <TouchableOpacity
          style={styles.signinBtn}
          onPress={() => router.push("/(auth)/signin")}
        >
          <Text style={styles.signinText}>Sign In / Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ⏳ Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C67C4E" />
        <Text style={{ marginTop: 8, color: "#666" }}>Loading your orders...</Text>
      </View>
    );
  }

  // 👤 Người dùng thật
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#C67C4E"]}
        />
      }
    >
      {/* 👤 Thông tin người dùng */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/avatar.png")}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* 🧾 Lịch sử đơn hàng */}
      <View style={styles.orderCard}>
        <Text style={styles.sectionTitle}>🧾 Recent Orders</Text>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <View key={index} style={styles.orderBlock}>
              <Text style={styles.orderDate}>
                📅 {order.createdAt?.replace("T", " ") || "No date"}
              </Text>

              {order.items?.map((item, i) => {
                const imageSource = item.product?.image
                  ? { uri: item.product.image }
                  : require("../../assets/images/default.png"); // fallback ảnh
                return (
                  <View key={i} style={styles.orderItemRow}>
                    <Image source={imageSource} style={styles.productImage} />
                    <Text style={styles.orderItem}>
                      {item.product?.name} ({item.size}) ×{item.quantity}
                    </Text>
                  </View>
                );
              })}

              <Text style={styles.orderTotal}>
                💰 Total: ${order.totalPrice?.toFixed(2) || 0}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: "#666", textAlign: "center" }}>
            No orders yet ☕
          </Text>
        )}
      </View>

      {/* 🚪 Đăng xuất */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 💅 STYLES
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    paddingTop: 40,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#C67C4E",
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: "700", color: "#333" },
  email: { color: "#666", marginBottom: 20 },

  orderCard: {
    width: "100%",
    backgroundColor: "#FFF7F0",
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#C67C4E",
  },
  orderBlock: {
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderDate: { fontWeight: "600", color: "#333", marginBottom: 6 },

  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  productImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  orderItem: { color: "#333", fontSize: 15, flexShrink: 1 },
  orderTotal: {
    marginTop: 4,
    textAlign: "right",
    color: "#C67C4E",
    fontWeight: "700",
    fontSize: 15,
  },
  logoutBtn: {
    backgroundColor: "#F44",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // 👤 Guest mode
  guestContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  guestAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#C67C4E",
  },
  guestName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  signinBtn: {
    backgroundColor: "#C67C4E",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
  },
  signinText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
