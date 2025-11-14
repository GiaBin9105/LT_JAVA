import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !address || !phone) {
      Alert.alert("Missing info", "Please fill all fields!");
      return;
    }

    try {
      await signup(name, email, password, address, phone);
      Alert.alert("✅ Success", "Account created successfully!");
      router.replace("/(auth)/signin");
    } catch (e) {
      Alert.alert("Signup failed", e.message || "Unknown error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our coffee family ☕</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#aaa"
            value={address}
            onChangeText={setAddress}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity style={styles.btn} onPress={handleSignup}>
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => router.replace("/(auth)/signin")}
          >
            <Text style={styles.linkText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F1",
    justifyContent: "center",
    alignItems: "center",
  },
  inner: { width: "85%", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#C67C4E" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 25 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 15,
  },
  btn: {
    width: "100%",
    backgroundColor: "#C67C4E",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  linkBtn: { marginTop: 20 },
  linkText: {
    color: "#C67C4E",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});
