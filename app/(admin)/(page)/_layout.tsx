import { router, Stack } from "expo-router";
import "react-native-reanimated";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { C } from "@/constants/Colors";

const AdminPageLayout = () => {
  return (
    <>
      <Stack
        screenOptions={({}) => ({
          headerTintColor: C[1],
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  padding: 12,
                  position: "relative",
                  zIndex: 10,
                  borderRadius: 16,
                  marginLeft: 6,
                  marginVertical: 32,
                  backgroundColor: "white",
                }}
              >
                <Ionicons name="chevron-back" size={30} color={C[1]} />
              </TouchableOpacity>
            ) : null,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: "Outfit-SemiBold",
            fontSize: 20,
          },
        })}
      >
        <Stack.Screen
          name="form-product"
          options={{ title: "Form Product", headerShown: true }}
        />
        <Stack.Screen
          name="form-input"
          options={{ title: "Form Input", headerShown: true }}
        />
        <Stack.Screen
          name="scan-product"
          options={{ title: "Scan Product", headerShown: false }}
        />
        <Stack.Screen
          name="form-partner"
          options={{ title: "Form Partner", headerShown: true }}
        />
        <Stack.Screen
          name="form-user"
          options={{ title: "Form User", headerShown: true }}
        />
        <Stack.Screen
          name="form-order"
          options={{ title: "Buat Pesanan", headerShown: true }}
        />
        <Stack.Screen
          name="profile"
          options={{ title: "Edit Profile", headerShown: true }}
        />
        <Stack.Screen
          name="change-password"
          options={{ title: "Ubah Password", headerShown: true }}
        />
        <Stack.Screen
          name="analytic"
          options={{ title: "Analisis", headerShown: true }}
        />
      </Stack>
      <Toast />
    </>
  );
};

export default AdminPageLayout;
