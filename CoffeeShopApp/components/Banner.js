import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function Banner() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bannersale.png")}
        style={styles.banner}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.textBox}>
          <Text style={styles.mainText}>☕ Buy one get one</Text>
          <Text style={styles.subText}>FREE today!</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    height: 130,
    justifyContent: "flex-end",
  },
  image: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)", // làm tối nhẹ giúp chữ nổi bật
  },
  textBox: {
    padding: 16,
  },
  mainText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  subText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 4,
  },
});
