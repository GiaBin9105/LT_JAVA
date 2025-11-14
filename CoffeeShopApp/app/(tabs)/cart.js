import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function CartScreen() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    total,
    checkout,
    loading,
  } = useCart();
  const { isGuest, user } = useAuth();
  const router = useRouter();

  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ✅ Toast “Payment Successful”
  const showSuccessToast = () => {
    setShowSuccess(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setShowSuccess(false));
    }, 2500);
  };

  // ✅ Thanh toán VNPay demo
  const handleCheckout = async () => {
    if (cart.length === 0 || processing) return;
    if (isGuest || user?.isGuest) {
      alert("Guest Mode 🚫\nPlease sign in to make a purchase ☕");
      return;
    }

    try {
      setProcessing(true);

      // 🧾 Lưu đơn hàng vào backend
      await checkout();

      // 🧾 Gọi API backend tạo link VNPay demo (sandbox)
      const res = await fetch(
        `http://192.168.220.177:8080/api/vnpay/create?amount=${total}`
      );
      const data = await res.json();

      if (data.url) {
        router.push({
          pathname: "/vnpaydemo",
          params: { url: data.url, amount: total.toFixed(2) },
        });
      } else {
        alert("Không tạo được link VNPay demo!");
      }
    } catch (e) {
      console.error("❌ Checkout error:", e);
      alert("Checkout Failed\nPlease try again.");
    } finally {
      setProcessing(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={
          typeof item.image === "string"
            ? { uri: item.image }
            : item.image || require("../../assets/images/default.png")
        }
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sizeText}>Size: {item.size || "M"}</Text>
        <Text style={styles.price}>${item.price?.toFixed(2) || "0.00"}</Text>

        {/* Số lượng */}
        <View style={styles.qtyRow}>
          <TouchableOpacity
            onPress={() => decreaseQty(item.id)}
            style={[styles.qtyBtn, styles.minusBtn]}
          >
            <Feather name="minus" size={16} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity || 1}</Text>
          <TouchableOpacity
            onPress={() => increaseQty(item.id)}
            style={[styles.qtyBtn, styles.plusBtn]}
          >
            <Feather name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => removeFromCart(item.id)}
        style={styles.trashBtn}
      >
        <Feather name="trash-2" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ✅ Toast hiển thị thành công */}
      {showSuccess && (
        <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
          <Feather name="check-circle" size={26} color="#fff" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.toastTitle}>Payment Successful 🎉</Text>
            <Text style={styles.toastMsg}>Your order has been saved ☕</Text>
          </View>
        </Animated.View>
      )}

      {/* ✅ Loading / Empty / List */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#C67C4E" />
          <Text style={styles.loadingText}>Loading your cart...</Text>
        </View>
      ) : cart.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Feather name="shopping-bag" size={70} color="#C67C4E" />
          <Text style={styles.empty}>Your cart is empty ☕</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => `${item.id}-${item.cartItemId}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />

          {/* ✅ Footer */}
          <View style={styles.footer}>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${total ? total.toFixed(2) : "0.00"}
              </Text>
            </View>

            <TouchableOpacity
              disabled={processing || isGuest || user?.isGuest}
              style={[
                styles.checkoutBtn,
                (processing || isGuest || user?.isGuest) && {
                  backgroundColor: "#ccc",
                },
              ]}
              onPress={handleCheckout}
            >
              {processing ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={[styles.checkoutText, { marginLeft: 8 }]}>
                    Processing...
                  </Text>
                </View>
              ) : (
                <Text style={styles.checkoutText}>Checkout</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#C67C4E", fontSize: 16, marginTop: 10 },
  emptyWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { color: "#C67C4E", fontSize: 18, marginTop: 15, fontWeight: "600" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7F0",
    borderRadius: 18,
    marginBottom: 15,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  image: { width: 70, height: 70, borderRadius: 16 },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: "600", color: "#333" },
  sizeText: { fontSize: 14, color: "#666", marginBottom: 3 },
  price: { fontSize: 15, color: "#C67C4E", marginVertical: 4 },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  minusBtn: { backgroundColor: "#C67C4E" },
  plusBtn: { backgroundColor: "#C67C4E" },
  qtyText: {
    marginHorizontal: 12,
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
  trashBtn: { backgroundColor: "#C67C4E", padding: 8, borderRadius: 10 },

  // ✅ Footer mới
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginTop: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  totalSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  totalLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#C67C4E",
  },
  checkoutBtn: {
    backgroundColor: "#C67C4E",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C67C4E",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // ✅ Toast hiệu ứng
  toast: {
    position: "absolute",
    top: "40%",
    left: "10%",
    right: "10%",
    backgroundColor: "#C67C4E",
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 999,
  },
  toastTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  toastMsg: { color: "#fff", fontSize: 14, opacity: 0.9, marginTop: 2 },
});
