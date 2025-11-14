import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.shadow}>
      <LinearGradient
        colors={["#C67C4E", "#A05B36"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.btn}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: "100%",
    borderRadius: 14,
    shadowColor: "#C67C4E",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4, // hiệu ứng đổ bóng cho Android
  },
  btn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
