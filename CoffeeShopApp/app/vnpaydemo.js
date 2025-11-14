import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function VNPayDemo() {
  const { url, orderId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const webviewRef = useRef(null);
  const router = useRouter();

  // 🧩 Không có URL -> hiển thị thông báo
  if (!url) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16, color: "#444" }}>
          Không có URL VNPay để hiển thị
        </Text>
      </View>
    );
  }

  // 🧭 Theo dõi URL để phát hiện khi quay lại /return
  const handleNavigation = (event) => {
    const currentUrl = event.url;
    if (currentUrl.includes("/api/vnpay/return")) {
      const isSuccess = currentUrl.includes("result=success");

      // 🧾 Gọi API cập nhật trạng thái đơn hàng
      fetch(
        `http://192.168.220.177:8080/api/vnpay/update-order/${orderId}?success=${isSuccess}`,
        { method: "PUT" }
      )
        .then((res) => res.json())
        .then((data) => {
          Alert.alert(
            "Thanh toán VNPay",
            isSuccess
              ? "✅ Thanh toán demo VNPay thành công!"
              : "❌ Thanh toán thất bại.",
            [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]
          );
        })
        .catch((err) => {
          Alert.alert("Lỗi", "Không thể cập nhật trạng thái đơn hàng.");
          console.error(err);
        });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={{ marginTop: 10, color: "#333" }}>
            Đang tải VNPay Demo...
          </Text>
        </View>
      )}
      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigation}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F1",
    zIndex: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F1",
  },
});
