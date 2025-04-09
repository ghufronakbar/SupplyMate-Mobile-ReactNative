import { ThemedText } from "@/components/ThemedText";
import { ACCESS_TOKEN, ROLE } from "@/constants/AsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

const IndexScreen = () => {
  useAuth();
  return (
    <View className="w-full h-full bg-custom-1 flex items-center justify-center">
      <ThemedText className="text-white text-3xl font-obold">
        SupplyMate
      </ThemedText>
    </View>
  );
};

const useAuth = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      checkToken();
    });
  }, [fadeAnim]);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    const role = await AsyncStorage.getItem(ROLE);
    if (token && role) {
      if (role === "Admin") {
        router.replace("/(admin)/(tabs)");
      } else if (role === "Employee") {
        router.replace("/(employee)/(page)");
      }
    } else {
      router.replace("/login");
    }
  };
};

export default IndexScreen;
