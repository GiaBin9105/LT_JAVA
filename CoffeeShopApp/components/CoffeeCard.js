import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";
import { useFavorite } from "../context/FavoriteContext";

export default function CoffeeCard({ item, onPress }) {
  const { favorites, toggleFavorite } = useFavorite();
  const { addToCart } = useCart();
  const isFav = favorites.some((f) => f.id === item.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imgWrap}>
        <Image source={item.image} style={styles.img} />
        {/* Rating góc phải trên */}
        <View style={styles.rating}>
          <Feather name="star" size={12} color="#C67C4E" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item)}>
            <MaterialCommunityIcons
              name={isFav ? "heart" : "heart-outline"}
              size={20}
              color={isFav ? "#C67C4E" : "#999"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
            <Feather name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFF7F0",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
  },
  imgWrap: {
    position: "relative",
    width: "100%",
    height: 130,
  },
  img: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  rating: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    elevation: 3,
  },
  ratingText: { fontSize: 12, color: "#C67C4E", marginLeft: 3 },
  infoBox: { padding: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
    color: "#000",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  price: { color: "#C67C4E", fontWeight: "700", fontSize: 15 },
  addBtn: {
    backgroundColor: "#C67C4E",
    borderRadius: 10,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
