import { ThemedText } from "@/components/ThemedText";
import api from "@/config/api";
import { C } from "@/constants/Colors";
import { toastError, toastLoading } from "@/helper/toast";
import { Product } from "@/models/Product";
import { Api } from "@/models/Response";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";

const ScanProductScreen = () => {
  const { onBarcodeScanned, loading } = useScan();
  return (
    <SafeAreaView className="w-full h-full relative ">
      <View className="flex-row absolute top-20 justify-center w-full">
        <View className="w-full items-center flex flex-row">
          <View className="flex flex-row w-full justify-center">
            <ThemedText className="text-3xl font-obold">Scan </ThemedText>
            <ThemedText className="text-3xl font-obold text-custom-1">
              Barcode Produk
            </ThemedText>
          </View>
        </View>
      </View>
      <View className="flex flex-row items-center justify-center w-full h-full">
        <View className="flex-col items-center w-full space-y-4">
          <View className="flex-col items-center w-[90%] h-[40%] rounded-3xl overflow-hidden">
            <CameraView
              facing={"back"}
              className="w-full h-full flex items-center justify-center"
              onBarcodeScanned={({ data }) => onBarcodeScanned(data)}
            >
              {loading && <ActivityIndicator size={"large"} color={C[1]} />}
              {loading && (
                <View className="absolute top-0 left-0 w-full h-full bg-black opacity-50" />
              )}
            </CameraView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const useScan = () => {
  const [loading, setLoading] = useState(false);

  const onBarcodeScanned = async (data: string) => {
    try {
      if (loading) return;
      toastLoading();
      setLoading(true);
      const res = await api.get<Api<Product>>(`/products/${data}/code`);
      console.log({
        productId: res.data.data.id,
        unit: res.data.data.unit,
        date: "",
        name: res.data.data.name,
        amount: "",
        id: "",
      });
      router.push({
        pathname: "/(admin)/(page)/form-input",
        params: {
          productId: res.data.data.id,
          unit: res.data.data.unit,
          date: "",
          name: res.data.data.name,
          amount: "",
          id: "",
        },
      });
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  return { onBarcodeScanned, loading };
};

export default ScanProductScreen;
