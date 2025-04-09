import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import FormInput from "@/components/ui/FormInput";
import LoadingView from "@/components/ui/LoadingView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { toastError, toastSuccess } from "@/helper/toast";
import api from "@/config/api";
import { Api } from "@/models/Response";
import { Product } from "@/models/Product";
import { Dropdown } from "react-native-element-dropdown";
import { Partner } from "@/models/Partner";
import { Order } from "@/models/Order";
import { C } from "@/constants/Colors";
import formatRupiah from "@/utils/formatRupiah";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import formatDate from "@/utils/formatDate";

const FormOrder = () => {
  const {
    form,
    loading,
    onChange,
    pending,
    partners,
    products,
    setForm,
    handleSubmit,
    onChangeItem,
    formItem,
    onChangeItemQty,
    AddButton,
    isLastItem,
    RemoveButton,
    getSubTotal,
    total,
    DatePicker,
    toggleDate,
    validItems,
  } = useOrder();

  if (loading) return <LoadingView />;

  return (
    <SafeAreaView className="flex-1 bg-white h-[100%] relative">
      <ScrollView className="-z-10">
        <View className="px-5 ">
          <View className="flex-row">
            <ThemedText className="text-3xl font-obold">Yuk, </ThemedText>
            <ThemedText className="text-3xl font-obold text-custom-1">
              Buat Pesanan Baru
            </ThemedText>
          </View>
          <View className="flex flex-col space-y-2 mt-4">
            <View className="bg-white z-10 w-10 h-4 -mb-4 ml-2">
              <ThemedText className="ml-1 text-gray-700 font-oregular text-xs">
                Nama Mitra
              </ThemedText>
            </View>
            <Dropdown
              data={partners}
              labelField="name"
              valueField="id"
              value={form.partnerId}
              onChange={(item) =>
                setForm({ ...form, partnerId: item.id, partnerName: item.name })
              }
              search={false}
              placeholder="Pilih Mitra"
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
            <View className="bg-white z-10 w-24 h-4 -mb-4 ml-2">
              <ThemedText className="ml-1 text-gray-700 font-oregular text-xs">
                Tanggal Pesanan
              </ThemedText>
            </View>
            <Pressable
              className="border border-gray-500 px-3 py-3 rounded-lg"
              onPress={toggleDate}
            >
              <ThemedText className="text-black">
                {formatDate(form.date, true)}
              </ThemedText>
            </Pressable>
            <FormInput
              label="Catatan"
              value={form.note}
              onChangeText={(text) => onChange("note", text)}
              rows={5}
            />

            {formItem.map((item, index) => (
              <View key={index} className="flex flex-col space-y-2">
                <View className="bg-white z-10 w-20 h-4 -mb-4 ml-2">
                  <ThemedText className="ml-1 text-gray-700 font-oregular text-xs">
                    Nama Produk {index + 1}
                  </ThemedText>
                </View>
                <Dropdown
                  data={products}
                  labelField="label"
                  valueField="id"
                  value={formItem[index].productId}
                  onChange={(item: Product) => onChangeItem(index, item)}
                  search={false}
                  placeholder={`Pilih Produk ${index + 1}`}
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
                <FormInput
                  label={`Jumlah ${
                    formItem[index].productUnit
                      ? `(${formItem[index].productUnit})`
                      : ""
                  }`}
                  value={formItem[index].quantity}
                  onChangeText={(text) => onChangeItemQty(index, text)}
                  keyboardType="numeric"
                />
                <RemoveButton index={index} />
                {isLastItem(index) && <AddButton />}
              </View>
            ))}
            <View className="w-full h-96 bg-transparent" />
          </View>
        </View>
      </ScrollView>
      <View
        className="absolute bottom-0 w-full h-fit bg-white z-20 rounded-t-3xl border border-gray-200 flex flex-col px-4 py-4"
        style={{ elevation: 5 }}
      >
        <ThemedText className="font-osemibold text-black text-lg mb-2">
          Ringkasan Pesanan
        </ThemedText>
        {validItems.map((item, index) => (
          <View key={index} className="flex flex-row justify-between">
            <View className="flex flex-col">
              <ThemedText className="font-omedium">
                {item.productName}
              </ThemedText>
              <ThemedText>{formatRupiah(getSubTotal(item))}</ThemedText>
            </View>
            <ThemedText>
              x{item.quantity} {item.productUnit}
            </ThemedText>
          </View>
        ))}
        <View className="flex flex-row justify-between mt-2">
          <ThemedText className="font-osemibold">Total Pesanan</ThemedText>
          <ThemedText className="font-osemibold">
            {formatRupiah(total)}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          className="mb-4 p-3 flex items-center justify-center rounded-lg bg-custom-1 mt-4"
        >
          <ThemedText className="text-white font-oregular text-lg">
            {pending ? <ActivityIndicator color="white" /> : "Buat Pesanan"}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <DatePicker />
    </SafeAreaView>
  );
};

interface OrderDTO {
  partnerId: string;
  partnerName: string;
  date: Date;
  note: string;
}

interface OrderItemDTO {
  productId: string;
  productName: string;
  productUnit: string;
  productPrice: string;
  quantity: string;
}

const initOrderItemDTO: OrderItemDTO = {
  productId: "",
  productName: "",
  productUnit: "",
  productPrice: "0",
  quantity: "0",
};

const initOrderDTO: OrderDTO = {
  partnerId: "",
  partnerName: "",
  date: new Date(),
  note: "",
};

interface DropdownProduct extends Product {
  label: string;
}

const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [products, setProducts] = useState<DropdownProduct[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState(initOrderDTO);
  const [formItem, setFormItem] = useState<OrderItemDTO[]>([initOrderItemDTO]);
  const [dateOpen, setDateOpen] = useState(false);

  useNavigation().setOptions({
    headerShown: !loading,
  });

  const onChange = (key: keyof OrderDTO, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const onChangeItem = (index: number, item: Product) => {
    const newOrderItems = [...formItem];
    newOrderItems[index] = {
      productId: item?.id || "",
      productName: item?.name || "",
      productUnit: item?.unit || "",
      quantity: formItem?.[index]?.quantity || "0",
      productPrice: String(item?.sellPrice) || "0",
    };
    setFormItem(newOrderItems);
  };

  const validItems = formItem.filter(
    (item) => item.productId !== "" && item.quantity !== "0"
  );

  const getSubTotal = (item: OrderItemDTO) => {
    return (Number(item.productPrice) || 0) * (Number(item.quantity) || 0);
  };

  const total = validItems.reduce((acc, item) => acc + getSubTotal(item), 0);

  const onChangeItemQty = (index: number, value: string) => {
    const newOrderItems = [...formItem];
    newOrderItems[index] = { ...newOrderItems[index], quantity: value };
    setFormItem(newOrderItems);
  };

  const createNewItem = () => {
    setFormItem([...formItem, initOrderItemDTO]);
  };

  const removeItem = (index: number) => {
    const newOrderItems = [...formItem];
    newOrderItems.splice(index, 1);
    setFormItem(newOrderItems);
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get<Api<Product[]>>(`/products`);
      setProducts(
        res.data.data.map((item) => ({
          ...item,
          label: `${item.name} (${item.stock} ${item.unit})`,
        }))
      );
    } catch (error) {
      toastError(error);
      router.back();
    }
  };
  const fetchPartners = async () => {
    try {
      const res = await api.get<Api<Partner[]>>(`/partners`);
      setPartners(res.data.data);
    } catch (error) {
      toastError(error);
      router.back();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchPartners()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "note" && value === "") {
          throw new Error(`Harap isi semua data`);
        }
      });
      formItem.forEach((item) => {
        if (item.productId === "") {
          throw new Error("Harap isi semua data");
        }
      });

      formItem.forEach((item, index) => {
        const duplicateIndex = formItem.findIndex(
          (otherItem, otherIndex) =>
            otherIndex !== index && otherItem.productId === item.productId
        );
        if (duplicateIndex !== -1) {
          throw new Error(
            `Terdapat produk duplikat, harap jadikan satu pesanan`
          );
        }
      });

      formItem.forEach((item, index) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(`Produk ${item.productName} tidak ditemukan`);
        }
        if (product.stock < Number(item.quantity)) {
          throw new Error(`Stok produk ${item.productName} tidak mencukupi`);
        }
      });
      if (pending || loading) return;
      setPending(true);
      const res = await api.post<Api<Order>>(`/orders`, {
        ...form,
        orderItems: formItem,
      });
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

  const isLastItemComplete = () => {
    const lastItem = formItem[formItem.length - 1];
    return lastItem.productId !== "" && lastItem.quantity !== "";
  };

  const isLastItem = (index: number) => {
    return index === formItem.length - 1;
  };

  const RemoveButton = ({ index }: { index: number }) => {
    if (formItem.length === 1) return null;
    return (
      <TouchableOpacity
        className="mb-4 p-3 flex flex-row items-center justify-center rounded-lg bg-red-400 mt-4 border-red-400 border space-x-2"
        onPress={() => removeItem(index)}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          color={"white"}
          size={24}
        />
        <ThemedText className="text-white font-oregular text-lg">
          Hapus Produk
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const AddButton = () => {
    if (!isLastItemComplete()) return null;
    return (
      <TouchableOpacity
        className="mb-4 p-3 flex flex-row items-center justify-center rounded-lg bg-white mt-4 border-custom-1 border space-x-2"
        onPress={createNewItem}
      >
        <MaterialCommunityIcons
          name="plus-circle-outline"
          color={C[1]}
          size={24}
        />
        <ThemedText className="text-custom-1 font-oregular text-lg">
          Tambah Produk Lain
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const toggleDate = () => {
    setDateOpen(!dateOpen);
  };

  const DatePicker = () => {
    return (
      <DateTimePickerModal
        isVisible={dateOpen}
        mode="date"
        onConfirm={(date) => {
          setForm({ ...form, date });
          setDateOpen(false);
        }}
        onCancel={toggleDate}
        display="default"
        minimumDate={new Date()}
      />
    );
  };

  return {
    form,
    onChange,
    loading,
    products,
    partners,
    pending,
    setForm,
    handleSubmit,
    onChangeItem,
    formItem,
    onChangeItemQty,
    AddButton,
    isLastItem,
    RemoveButton,
    getSubTotal,
    total,
    DatePicker,
    toggleDate,
    validItems,
  };
};

export default FormOrder;
