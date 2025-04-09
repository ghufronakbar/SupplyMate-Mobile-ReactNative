import { Tabs } from "expo-router";
import Toast from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";
import { C } from "@/constants/Colors";

export default function LayoutHome() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: C[1],
          tabBarStyle: {
            backgroundColor: "white",
            position: "absolute",
            bottom: 30,
            marginHorizontal: 20,
            borderRadius: 20,
            paddingBottom: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 2,
            height: 55,
            borderTopWidth: 0,
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Beranda",
            headerShown: false,
            tabBarLabelStyle: {
              fontFamily: "Outfit-SemiBold",
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            tabBarLabel: "Pesanan",
            headerShown: false,
            tabBarLabelStyle: {
              fontFamily: "Outfit-SemiBold",
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bag-handle-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="product"
          options={{
            tabBarLabel: "Produk",
            headerShown: false,
            tabBarLabelStyle: {
              fontFamily: "Outfit-SemiBold",
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="logo-dropbox" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="partner"
          options={{
            tabBarLabel: "Mitra",
            headerShown: false,
            tabBarLabelStyle: {
              fontFamily: "Outfit-SemiBold",
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="business-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="user"
          options={{
            tabBarLabel: "Pengguna",
            headerShown: false,
            tabBarLabelStyle: {
              fontFamily: "Outfit-SemiBold",
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
      <Toast />
    </>
  );
}
