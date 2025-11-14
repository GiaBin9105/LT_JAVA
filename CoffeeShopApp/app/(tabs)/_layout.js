import { MaterialCommunityIcons } from "@expo/vector-icons"; // thay cho Feather
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#C67C4E",
          tabBarInactiveTintColor: "#9b9b9b",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 0.5,
            borderColor: "#eee",
            height: 65,
            paddingBottom: 6,
          },
          tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
        }}
      >
        {/* 4 Tab chính */}
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-variant-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorite"
          options={{
            title: "Favorite",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="heart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="shopping-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-outline" size={size} color={color} />
            ),
          }}
        />

        {/* 🔒 Ẩn các tab phụ, chỉ phục vụ logic nội bộ */}
        <Tabs.Screen
          name="index"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="explore"
          options={{ href: null }}
        />
      </Tabs>
    </View>
  );
}
