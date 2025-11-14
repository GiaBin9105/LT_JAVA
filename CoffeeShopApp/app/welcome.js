import { useRouter } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";

export default function Welcome() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/banner.png")} // ✅ Dùng banner chính trong app
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Overlay làm tối nhẹ để chữ nổi bật */}
      <View style={styles.overlay} />

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.title}>Fall in Love with Coffee ☕</Text>
        <Text style={styles.subtitle}>
          Enjoy every sip — made just for you in our cozy corner.
        </Text>

        <Button
          title="Get Started"
          onPress={() => router.push("/(auth)/signin")}
          color="#C67C4E"
          textColor="#fff"
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: "flex-end" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  content: { padding: 24, marginBottom: 40 },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#eee",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
});
