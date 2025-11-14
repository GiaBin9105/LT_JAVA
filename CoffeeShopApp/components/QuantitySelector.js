import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QuantitySelector({ qty, setQty }) {
  const decrease = () => setQty(qty > 1 ? qty - 1 : 1);
  const increase = () => setQty(qty + 1);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={decrease}>
        <Feather name="minus" size={18} color="#C67C4E" />
      </TouchableOpacity>

      <Text style={styles.qty}>{qty}</Text>

      <TouchableOpacity style={styles.btn} onPress={increase}>
        <Feather name="plus" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 4,
    alignSelf: "flex-start",
    backgroundColor: "#FFF",
  },
  btn: {
    backgroundColor: "#FFF7F0",
    borderRadius: 8,
    padding: 6,
    marginHorizontal: 4,
  },
  qty: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 8,
  },
});
