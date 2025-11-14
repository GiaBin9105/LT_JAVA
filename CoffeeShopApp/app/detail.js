import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../context/CartContext";
import { useFavorite } from "../context/FavoriteContext";

export default function Detail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorite();

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("M");
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://192.168.220.177:8080/api/public/products";

  // 🧭 Lấy chi tiết sản phẩm từ backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();

        setProduct({
          ...data,
          image:
            data.image && data.image.startsWith("http")
              ? { uri: data.image }
              : require("../assets/images/default.png"),
        });
      } catch (err) {
        console.error("❌ Lỗi khi tải chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C67C4E" />
        <Text style={{ color: "#555", marginTop: 10 }}>Loading...</Text>
      </View>
    );

  if (!product)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#999" }}>Product not found ☕</Text>
      </View>
    );

  const isFav = favorites.some((f) => f.id === Number(product.id));

  // 💰 Lấy giá theo size thật từ backend
  const getPriceBySize = () => {
    switch (size) {
      case "S":
        return product.priceS ?? product.price ?? 0;
      case "L":
        return product.priceL ?? product.price ?? 0;
      default:
        return product.priceM ?? product.price ?? 0;
    }
  };

  // 🛒 Thêm vào giỏ hàng thật
  const handleAddToCart = async () => {
    try {
      await addToCart({ ...product, size });
      Alert.alert("🛒 Added to Cart", `Added ${product.name} (Size ${size})`);
    } catch (e) {
      console.error("❌ Add to cart error:", e);
    }
  };

  // ❤️ Toggle yêu thích
  const handleToggleFavorite = async () => {
    await toggleFavorite(product);
    Alert.alert(
      isFav ? "💔 Removed from Favorites" : "❤️ Added to Favorites",
      `${product.name}`
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.image} />

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.heartBtn} onPress={handleToggleFavorite}>
          <MaterialCommunityIcons
            name={isFav ? "heart" : "heart-outline"}
            size={22}
            color={isFav ? "#C67C4E" : "#000"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.title}>{product.name}</Text>

        <View style={styles.ratingRow}>
          <MaterialCommunityIcons name="star" size={18} color="#C67C4E" />
          <Text style={styles.rating}>
            {product.rating ? product.rating.toFixed(1) : "4.5"}
          </Text>
          <Text style={styles.review}> (230 reviews)</Text>
        </View>

        <Text style={styles.section}>Description</Text>
        <Text style={styles.desc}>
          {product.description || "No description available."}
        </Text>

        <Text style={styles.section}>Size</Text>
        <View style={styles.sizeRow}>
          {["S", "M", "L"].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.sizeBtn, size === s && styles.sizeActive]}
              onPress={() => setSize(s)}
            >
              <Text
                style={[styles.sizeText, size === s && styles.sizeTextActive]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>${getPriceBySize().toFixed(2)}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
            <Text style={styles.addText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageContainer: {
    height: 360,
    position: "relative",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 50,
  },
  heartBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 50,
  },
  infoSection: {
    padding: 24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
  },
  title: { fontSize: 26, fontWeight: "700", color: "#000", marginBottom: 8 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  rating: { color: "#C67C4E", fontSize: 16, fontWeight: "600" },
  review: { color: "#777", fontSize: 13, marginLeft: 4 },
  section: { fontSize: 18, fontWeight: "700", marginTop: 18, color: "#000" },
  desc: { color: "#555", lineHeight: 22, fontSize: 14, marginTop: 6 },
  sizeRow: { flexDirection: "row", marginTop: 10 },
  sizeBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 22,
    marginRight: 10,
  },
  sizeActive: { backgroundColor: "#C67C4E", borderColor: "#C67C4E" },
  sizeText: { color: "#000", fontWeight: "600" },
  sizeTextActive: { color: "#fff" },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  price: { fontSize: 24, fontWeight: "700", color: "#C67C4E" },
  addBtn: {
    backgroundColor: "#C67C4E",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 18,
  },
  addText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
