import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";

export default function Home() {
  const { addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All Coffee"]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All Coffee");
  const [search, setSearch] = useState("");

  // ⚙️ Địa chỉ backend
  const BASE_URL = "http://192.168.220.177:8080/api/public";

  // 🧭 Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/categories`);
        const data = await res.json();
        setCategories(["All Coffee", ...data.map((c) => c.name)]);
      } catch (err) {
        console.error("❌ Lỗi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🧭 Lấy sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products`);
        const data = await res.json();
        const mapped = data.map((p) => ({
          ...p,
          image: p.image
            ? { uri: p.image }
            : require("../../assets/images/default.png"),
        }));
        setProducts(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🔍 Lọc sản phẩm theo danh mục & tìm kiếm
  const filtered = products.filter(
    (p) =>
      (selected === "All Coffee" || p.category?.name === selected) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  // 💰 Chọn giá mặc định nếu có nhiều size
  const getDefaultPrice = (p) => {
    if (p.priceM != null) return p.priceM;
    return p.price || 0;
  };

  // 🛒 Thêm vào giỏ
  const handleAddToCart = (item) => {
    const newItem = {
      ...item,
      size: "M",
      price: getDefaultPrice(item),
    };
    addToCart(newItem);
    Alert.alert("🛒 Added to Cart", `${item.name} (Size M)`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C67C4E" />
        <Text style={{ color: "#555", marginTop: 10 }}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🗺️ Vị trí */}
      <Text style={styles.location}>Location</Text>
      <Text style={styles.city}>Ho Chi Minh City</Text>

      {/* 🔍 Thanh tìm kiếm */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#999" />
          <TextInput
            placeholder="Search coffee..."
            placeholderTextColor="#aaa"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Feather name="sliders" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ☕ Banner khuyến mãi */}
      <View style={styles.bannerWrap}>
        <Image
          source={require("../../assets/images/bannersale.png")}
          style={styles.banner}
        />
        <View style={styles.bannerOverlay} />
        <View style={styles.bannerTextBox}>
          <Text style={styles.bannerEmoji}>☕</Text>
          <Text style={styles.bannerLine1}>Buy one get one</Text>
          <Text style={styles.bannerLine2}>FREE today!</Text>
        </View>
      </View>

      {/* 🧾 Danh mục */}
      <View style={styles.categoryWrap}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                selected === item && styles.categoryActive,
              ]}
              onPress={() => setSelected(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selected === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 🛍️ Danh sách sản phẩm */}
      <FlatList
        data={filtered}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/detail?id=${item.id}`)}
            style={styles.card}
          >
            <View style={styles.imageWrap}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.ratingBox}>
                <Feather name="star" size={12} color="#C67C4E" />
                <Text style={styles.ratingText}>
                  {item.rating ? item.rating.toFixed(1) : "4.5"}
                </Text>
              </View>
            </View>

            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>
              ${getDefaultPrice(item).toFixed(2)}
            </Text>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => handleAddToCart(item)}
            >
              <Feather name="plus" size={18} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  location: { color: "#999", marginTop: 40, fontSize: 14 },
  city: { fontSize: 22, fontWeight: "700", color: "#333" },

  searchRow: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F4F4F4",
    borderRadius: 14,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  input: { flex: 1, padding: 8, fontSize: 14, color: "#333" },
  filterBtn: {
    backgroundColor: "#C67C4E",
    padding: 12,
    borderRadius: 14,
    marginLeft: 10,
  },

  bannerWrap: { borderRadius: 18, overflow: "hidden", marginBottom: 20 },
  banner: { width: "100%", height: 160, borderRadius: 18 },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bannerTextBox: { position: "absolute", bottom: 20, left: 20 },
  bannerEmoji: { fontSize: 28, color: "#fff", marginBottom: 4 },
  bannerLine1: { color: "#fff", fontSize: 20, fontWeight: "600" },
  bannerLine2: { color: "#FFD89C", fontSize: 24, fontWeight: "800" },

  categoryWrap: { marginVertical: 10 },
  categoryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F4F4F4",
    borderRadius: 20,
    marginRight: 12,
  },
  categoryActive: { backgroundColor: "#C67C4E" },
  categoryText: { color: "#444", fontWeight: "600" },
  categoryTextActive: { color: "#fff" },

  card: {
    width: "48%",
    backgroundColor: "#FFF7F0",
    borderRadius: 20,
    marginBottom: 20,
    padding: 10,
    position: "relative",
  },
  imageWrap: { borderRadius: 16, overflow: "hidden", position: "relative" },
  image: { width: "100%", height: 120, borderRadius: 16 },
  ratingBox: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: { fontSize: 12, color: "#C67C4E", marginLeft: 3 },
  name: { fontWeight: "600", fontSize: 15, marginTop: 8, color: "#333" },
  price: { color: "#C67C4E", fontWeight: "700", marginTop: 2 },
  addBtn: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#C67C4E",
    borderRadius: 10,
    padding: 6,
  },
});
