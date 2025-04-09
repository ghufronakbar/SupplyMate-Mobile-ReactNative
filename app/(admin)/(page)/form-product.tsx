import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import FormInput from "@/components/ui/FormInput";
import LoadingView from "@/components/ui/LoadingView";
import SelectImage from "@/components/ui/SelectImage";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { toastError, toastSuccess } from "@/helper/toast";
import api from "@/config/api";
import { Api } from "@/models/Response";
import { Product } from "@/models/Product";
import { Dropdown } from "react-native-element-dropdown";
import ModalConfirmation from "@/components/ui/ModalConfirmation";
import { CameraView } from "expo-camera";
import { C } from "@/constants/Colors";
import { Input } from "@/models/Input";
import formatDate from "@/utils/formatDate";
import Toast from "react-native-toast-message";

const FormProduct = () => {
  const {
    form,
    loading,
    onChange,
    UNITS,
    handleSubmit,
    pending,
    id,
    Confirmation,
    isOpen,
    setIsOpen,
    onBarcodeScanned,
    inputs,
  } = useProduct();

  if (loading) return <LoadingView />;

  return (
    <ScrollView className="px-5 flex-1 bg-white min-h-screen">
      <View>
        <View className="flex-row">
          <ThemedText className="text-3xl font-obold">Yuk, </ThemedText>
          <ThemedText className="text-3xl font-obold text-custom-1">
            Lengkapi Produk
          </ThemedText>
        </View>
        <View className="flex flex-col space-y-2 mt-4">
          <FormInput
            label="Nama Produk"
            value={form.name}
            onChangeText={(text) => onChange("name", text)}
          />
          <TouchableOpacity className="w-full" onPress={() => setIsOpen(true)}>
            <FormInput
              label="Kode Unik"
              value={form.uniqueCode}
              onChangeText={(text) => onChange("uniqueCode", text)}
              editable={false}
            />
          </TouchableOpacity>
          <FormInput
            label={id ? "Stok Produk" : "Stok Awal Produk"}
            value={form.stock}
            onChangeText={(text) => onChange("stock", text)}
            keyboardType="numeric"
            editable={!id}
          />
          <FormInput
            label="Modal Produk (Rp)"
            value={form.buyPrice}
            onChangeText={(text) => onChange("buyPrice", text)}
            keyboardType="numeric"
          />
          <FormInput
            label="Harga Jual (Rp)"
            value={form.sellPrice}
            onChangeText={(text) => onChange("sellPrice", text)}
            keyboardType="numeric"
          />
          <View className="bg-white z-10 w-10 h-4 -mb-4 ml-2">
            <ThemedText className="ml-1 text-gray-700 font-oregular text-xs">
              Satuan
            </ThemedText>
          </View>
          <Dropdown
            data={UNITS}
            labelField="label"
            valueField="value"
            value={form.unit}
            onChange={(item) => onChange("unit", item.value)}
            search={false}
            placeholder="Pilih Satuan"
            placeholderStyle={{
              fontFamily: "Outfit-Regular",
              fontSize: 16,
              color: "#181D27",
            }}
            itemTextStyle={{
              fontFamily: "Outfit-Regular",
              fontSize: 16,
              color: "#181D27",
            }}
            containerStyle={{
              backgroundColor: "white",
              borderRadius: 10,
              borderWidth: 0,
            }}
            itemContainerStyle={{
              borderRadius: 10,
            }}
            activeColor={"#f0f0f0"}
            selectedTextStyle={{
              fontFamily: "Outfit-Regular",
              fontSize: 16,
              color: "#181D27",
            }}
            style={{
              borderColor: "#A0A0A0",
              borderWidth: 1,
              borderRadius: 10,
              padding: 12,
              marginBottom: 8,
            }}
          />
          <View className="z-10 w-15 h-4 -mb-1 ml-2">
            <ThemedText className="ml-1 text-gray-700 font-oregular text-xs">
              Foto Produk
            </ThemedText>
          </View>
          <SelectImage
            image={form.image}
            onChangeImage={(value) => onChange("image", value)}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            className="mb-4 p-3 flex items-center justify-center rounded-lg bg-custom-1 mt-4"
          >
            <ThemedText className="text-white font-oregular text-lg">
              {pending ? (
                <ActivityIndicator color="white" />
              ) : id ? (
                "Simpan"
              ) : (
                "Tambahkan"
              )}
            </ThemedText>
          </TouchableOpacity>
          {inputs.length > 0 && (
            <View className="w-full flex flex-col space-y-4">
              <ThemedText className="text-2xl font-obold">
                Riwayat Input Stok
              </ThemedText>
              <View className="w-full flex flex-col space-y-2">
                {inputs.map((input, index) => (
                  <Pressable
                    key={index}
                    className="flex flex-row items-center justify-between h-16 bg-white rounded-lg p-4 border border-gray-200"
                    onPress={() =>
                      router.push({
                        pathname: "/(admin)/(page)/form-input",
                        params: {
                          productId: input.productId,
                          unit: input.unit,
                          date: input.createdAt.toString(),
                          name: form.name,
                          amount: input.amount,
                          id: input.id,
                        },
                      })
                    }
                  >
                    <ThemedText className="text-lg font-oregular">
                      {input.amount} {input?.unit} pada{" "}
                      {formatDate(input.createdAt, true, true)}
                    </ThemedText>
                    <Entypo name="chevron-thin-right" size={18} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
      <ModalScan
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onBarcodeScanned={onBarcodeScanned}
      />
      <Confirmation />
      <Toast />
      <View className="h-64 w-full" />
    </ScrollView>
  );
};

interface ProductDTO {
  name: string;
  sellPrice: string;
  buyPrice: string;
  unit: string;
  uniqueCode: string;
  stock: string;
  image: string | null;
}

const initProductDTO: ProductDTO = {
  name: "",
  sellPrice: "",
  buyPrice: "",
  unit: "kg",
  uniqueCode: "",
  stock: "0",
  image: null,
};

const useProduct = () => {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initProductDTO);
  const [inputs, setInputs] = useState<Input[]>([]);
  const id = (useLocalSearchParams().id as string) || "";
  useNavigation().setOptions({
    title: id ? "Edit Produk" : "Tambah Produk",
    headerRight: () =>
      !id ? null : (
        <TouchableOpacity
          onPress={onClickDel}
          style={{
            padding: 12,
            position: "relative",
            zIndex: 10,
            borderRadius: 16,
            marginRight: 6,
            marginVertical: 32,
            backgroundColor: "white",
          }}
        >
          <Ionicons name="trash-outline" size={26} color={"#F44336"} />
        </TouchableOpacity>
      ),
    headerShown: !loading,
  });

  const onClickDel = () => {
    setOpenDel(!openDel);
  };

  const onChange = (key: keyof ProductDTO, value: string | null) => {
    setForm({ ...form, [key]: value });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Api<Product>>(`/products/${id}`);
      setForm({
        name: res.data.data.name,
        buyPrice: res.data.data.buyPrice.toString(),
        sellPrice: res.data.data.sellPrice.toString(),
        unit: res.data.data.unit,
        image: res.data.data.image,
        stock: res.data.data.stock.toString(),
        uniqueCode: res.data.data.uniqueCode,
      });
      setInputs(res.data.data.inputs);
      setLoading(false);
    } catch (error) {
      toastError(error);
      router.back();
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchData();
      }
    }, [id])
  );

  const UNITS = [
    {
      label: "pcs",
      value: "pcs",
    },
    {
      label: "kg",
      value: "kg",
    },
    {
      label: "liter",
      value: "liter",
    },
    {
      label: "package",
      value: "package",
    },
    {
      label: "box",
      value: "box",
    },
  ];

  const handleSubmit = async () => {
    try {
      Object.entries(form).forEach(([key, value]) => {
        if (value === "" && key !== "image") {
          throw new Error(`Harap lengkapi data`);
        }
      });
      if (pending || loading) return;
      setPending(true);
      if (id) {
        const res = await api.put<Api<Product>>(`/products/${id}`, form);
        toastSuccess(res?.data?.message);
      } else {
        const res = await api.post<Api<Product>>("/products", form);
        toastSuccess(res?.data?.message);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.back();
    } catch (error) {
      console.log(error);
      toastError(error);
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (pending || loading) return;
      setPending(true);
      onClickDel();
      const res = await api.delete<Api<Product>>(`/products/${id}`);
      toastSuccess(res?.data?.message);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.back();
    } catch (error) {
      console.log(error);
      toastError(error);
    } finally {
      setPending(false);
    }
  };

  const Confirmation = () => (
    <ModalConfirmation
      onConfirm={handleDelete}
      setShowAlert={setOpenDel}
      showAlert={openDel}
    />
  );

  const onBarcodeScanned = (code: string) => {
    onChange("uniqueCode", code);
    setIsOpen(false);
  };

  return {
    form,
    onChange,
    loading,
    UNITS,
    handleSubmit,
    pending,
    id,
    Confirmation,
    isOpen,
    setIsOpen,
    onBarcodeScanned,
    inputs,
  };
};

interface ModalScanProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeScanned: (code: string) => void;
}

const ModalScan: React.FC<ModalScanProps> = ({
  isOpen,
  onClose,
  onBarcodeScanned,
}) => {
  // if (!isOpen) return null;
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
                className="w-full h-full"
                onBarcodeScanned={({ data }) => onBarcodeScanned(data)}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FormProduct;
