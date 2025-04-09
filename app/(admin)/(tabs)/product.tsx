import { ThemedText } from "@/components/ThemedText";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { Img } from "@/components/ui/Img";
import api from "@/config/api";
import { C } from "@/constants/Colors";
import { toastError, toastLoading } from "@/helper/toast";
import { Product } from "@/models/Product";
import { Api } from "@/models/Response";
import formatRupiah from "@/utils/formatRupiah";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { CameraView } from "expo-camera";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductScreen = () => {
  const {
    data,
    fetchData,
    loading,
    isOpen,
    setIsOpen,
    errormsg,
    isScan,
    loadingScan,
    onBarcodeScanned,
    setIsScan,
  } = useProducts();

  return (
    <RefreshControl refreshing={loading} onRefresh={fetchData}>
      <SafeAreaView className="bg-white h-full">
        <ThemedText
          type="title"
          className=" py-6 px-4 text-center font-omedium"
        >
          Daftar Produk
        </ThemedText>

        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => <ListProduct item={item} />}
        />
        <ModalScan
          isOpen={isScan}
          onClose={() => setIsScan(false)}
          loading={loadingScan}
          onBarcodeScanned={onBarcodeScanned}
          errormsg={errormsg}
        />
        <ModalProduct
          onClose={() => setIsOpen(false)}
          visible={isOpen}
          onScanPress={() => {
            console.log({ isScan });
            setIsScan(true);
          }}
        />
        <FloatingAddButton onPress={() => setIsOpen(true)} />
      </SafeAreaView>
    </RefreshControl>
  );
};

interface ListProductProps {
  item: Product;
}
const ListProduct: React.FC<ListProductProps> = ({ item }) => {
  return (
    <Pressable
      className="w-full h-20 bg-white mb-2 border border-gray-200 rounded-2xl shadow-md flex flex-row items-center overflow-hidden py-2 px-2"
      style={{ elevation: 5 }}
      onPress={() =>
        router.push({
          pathname: "/(admin)/(page)/form-product",
          params: {
            id: item.id,
          },
        })
      }
    >
      <Img
        className="h-16 w-16 object-cover aspect-square rounded-xl mr-2"
        uri={item?.image}
      />
      <View className="flex flex-row justify-between items-center w-[75%]">
        <View className="flex flex-col">
          <ThemedText className="text-black">{item.name}</ThemedText>
          <ThemedText>{formatRupiah(item.sellPrice)}</ThemedText>
          <ThemedText className="text-sm">
            Stok: {item.stock} {item.unit}
          </ThemedText>
        </View>
        <Entypo name="chevron-thin-right" size={18} />
      </View>
    </Pressable>
  );
};

const useProducts = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setIsOpen(false);
    setIsScan(false);
    setLoadingScan(false);
    setErrormsg("");
    const res = await api.get<Api<Product[]>>("/products");
    setData(res.data.data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // SCAN

  const [loadingScan, setLoadingScan] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [errormsg, setErrormsg] = useState("");

  const onBarcodeScanned = async (data: string) => {
    try {
      console.log({ loadingScan });
      if (loadingScan) return;
      setLoadingScan(true);
      setErrormsg("");
      const res = await api.get<Api<Product>>(`/products/${data}/code`);
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
      setLoadingScan(false);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setErrormsg(error.response?.data.message);
      } else if (error instanceof Error) {
        setErrormsg(error.message);
      } else {
        setErrormsg("Terjadi kesalahan");
      }
      setLoadingScan(false);
    }
  };

  useEffect(() => {
    if (errormsg) {
      setTimeout(() => {
        setErrormsg("");
      }, 2000);
    }
  }, [errormsg]);

  return {
    data,
    loading,
    fetchData,
    isOpen,
    setIsOpen,
    onBarcodeScanned,
    loadingScan,
    isScan,
    setIsScan,
    errormsg,
  };
};

export default ProductScreen;

interface ModalProductProps {
  visible: boolean;
  onClose: () => void;
  onScanPress: () => void;
}

const ModalProduct: React.FC<ModalProductProps> = ({
  onClose,
  visible,
  onScanPress,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#80808080",
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: "#fff",
            borderRadius: 15,
            paddingHorizontal: 30,
            paddingBottom: 50,
            paddingTop: 30,
          }}
        >
          <View className="flex-row justify-between items-center">
            <ThemedText className="text-2xl font-osemibold">
              Tambah Produk / Stock
            </ThemedText>
            <Ionicons
              name="close-outline"
              size={30}
              color={"#7F8893"}
              onPress={onClose}
            />
          </View>
          <ThemedText className=" font-oregular mt-2">
            Pilih aksi untuk melanjutkan
          </ThemedText>
          <View className="flex-col items-center space-y-2">
            <TouchableOpacity
              className="w-full bg-custom-1 rounded-lg p-3 mt-3 flex flex-row space-x-2 items-center justify-center"
              onPress={() => {
                onClose();
                router.push("/(admin)/(page)/form-product");
              }}
            >
              <Ionicons name="logo-dropbox" size={22} color={"white"} />
              <ThemedText className="text-lg font-oregular text-white">
                Buat Produk Baru
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full bg-white rounded-lg p-3 mt-3 flex flex-row space-x-2 items-center justify-center border border-custom-1"
              onPress={() => {
                console.log("HITT");
                onClose();
                onScanPress();
              }}
            >
              <Ionicons name="archive-outline" size={22} color={C[1]} />
              <ThemedText className="text-lg font-oregular text-custom-1">
                Input Stock Produk
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface ModalScanProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeScanned: (code: string) => void;
  loading: boolean;
  errormsg: string;
}

const ModalScan: React.FC<ModalScanProps> = ({
  isOpen,
  onClose,
  onBarcodeScanned,
  loading,
  errormsg,
}) => {
  return (
    <Modal visible={isOpen} animationType="slide">
      <View className="w-full h-full relative ">
        <View className="flex-row absolute top-10 justify-center w-full">
          <View className="w-full items-center flex flex-row">
            <Ionicons
              name="close-outline"
              size={26}
              color={C[2]}
              onPress={onClose}
              style={{ position: "absolute", right: 16 }}
            />
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
                onBarcodeScanned={async ({ data }) =>
                  await onBarcodeScanned(data)
                }
              >
                <ActivityIndicator
                  size={"large"}
                  color={C[1]}
                  className={loading ? "" : "hidden"}
                />

                <View
                  className={`absolute top-0 left-0 w-full h-full bg-black opacity-50 ${
                    loading ? "absolute" : "hidden"
                  }`}
                />
              </CameraView>
            </View>
            <ThemedText className="text-2xl font-omedium text-red-400">
              {errormsg}
            </ThemedText>
          </View>
        </View>
      </View>
    </Modal>
  );
};
