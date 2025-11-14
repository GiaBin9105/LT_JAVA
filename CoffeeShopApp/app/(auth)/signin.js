// /app/(auth)/signin.js
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Signin() {
  const router = useRouter();
  const { login, guestLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter email and password!");
      return;
    }

    try {
      await login(email, password);
      Alert.alert("Success", "Login successful!");
      router.replace("/(tabs)/home");
    } catch (e) {
      Alert.alert("Login failed", e.message);
    }
  };

  const handleGuest = async () => {
    try {
      await guestLogin();
      router.replace("/(tabs)/home");
    } catch (e) {
      Alert.alert("Guest login failed", e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Welcome Back ☕</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
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

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.signupText}>Create Account</Text>
        </TouchableOpacity>
      </View>
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
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#C67C4E",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  guestBtn: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#C67C4E",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  guestText: {
    color: "#C67C4E",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  signupText: {
    color: "#777",
    fontSize: 14,
  },
});
