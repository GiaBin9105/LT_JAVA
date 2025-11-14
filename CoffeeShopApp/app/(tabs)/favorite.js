import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFavorite } from "../../context/FavoriteContext";

export default function Favorite() {
  const { favorites, toggleFavorite, clearFavorites, loading } = useFavorite();

  // ❤️ Nếu đang tải
  if (loading) {
    return (
      <View style={styles.emptyWrap}>
        <ActivityIndicator size="large" color="#C67C4E" />
        <Text style={styles.empty}>Loading favorites...</Text>
      </View>
    );
  }

  // ❤️ Nếu chưa có sản phẩm yêu thích
  if (!favorites || favorites.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Feather name="heart" size={60} color="#ccc" />
        <Text style={styles.empty}>No favorites yet ☕</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites ❤️</Text>
        <TouchableOpacity onPress={clearFavorites}>
          <Feather name="trash-2" size={20} color="#C67C4E" />
        </TouchableOpacity>
      </View>

      {/* Danh sách */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          let imageSource;

          if (
            item.image &&
            typeof item.image === "string" &&
            item.image.startsWith("http")
          ) {
            imageSource = { uri: item.image };
          } else {
            imageSource = require("../../assets/images/default.png");
          }

          return (
            <View style={styles.card}>
              <Image source={imageSource} style={styles.image} />

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>
                  ${Number(item.price || 0).toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => toggleFavorite(item)}
                style={styles.heartBtn}
              >
                <Feather name="heart" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#C67C4E" },

  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  empty: { color: "#999", fontSize: 16, marginTop: 10 },

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
  price: { fontSize: 15, color: "#C67C4E", marginVertical: 6 },
  heartBtn: {
    backgroundColor: "#C67C4E",
    padding: 8,
    borderRadius: 10,
  },
});
