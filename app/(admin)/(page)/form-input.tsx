import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import FormInput from "@/components/ui/FormInput";
import { Ionicons } from "@expo/vector-icons";
import { toastError, toastSuccess } from "@/helper/toast";
import api from "@/config/api";
import { Api } from "@/models/Response";
import { Product } from "@/models/Product";
import ModalConfirmation from "@/components/ui/ModalConfirmation";
import { Input } from "@/models/Input";
import formatDate from "@/utils/formatDate";
import LoadingView from "@/components/ui/LoadingView";

const FormInputScreen = () => {
  const { form, loading, onChange, handleSubmit, pending, id, Confirmation } =
    useInput();

  if (loading) return <LoadingView />;

  return (
    <ScrollView className="px-5 flex-1 bg-white min-h-screen">
      <View>
        <View className="flex-row">
          <ThemedText className="text-3xl font-obold">
            Yuk,{" "}
            <ThemedText className="text-3xl font-obold text-custom-1">
              Lengkapi Data Input Stock
            </ThemedText>
          </ThemedText>
        </View>
        <ThemedText className="font-omedium mt-2">
          Data Input {form.name}{" "}
        </ThemedText>
        <ThemedText className="font-omedium">
          {form.date ? `pada tanggal ${formatDate(form.date, true, true)}` : ""}
        </ThemedText>
        <View className="flex flex-col space-y-2 mt-2">
          <FormInput
            label={`Jumlah Stok (${form.unit})`}
            value={form.amount}
            onChangeText={(text) => onChange("amount", text)}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={handleSubmit}
            className="mb-4 p-3 flex items-center justify-center rounded-lg bg-custom-1 mt-4"
          >
            <ThemedText className="text-white font-oregular text-lg">
              {pending ? (
                <ActivityIndicator color="white" />
              ) : form.id ? (
                "Simpan"
              ) : (
                "Tambahkan"
              )}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      <Confirmation />
      <View className="h-64 w-full" />
    </ScrollView>
  );
};

interface InputDTO {
  id: string;
  amount: string;
  productId: string;
  name: string;
  date: string;
  unit: string;
}

const useInput = () => {
  const [openDel, setOpenDel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const id = (useLocalSearchParams().id as string) || "";
  const name = (useLocalSearchParams().name as string) || "";
  const productId = (useLocalSearchParams().productId as string) || "";
  const date = (useLocalSearchParams().date as string) || "";
  const unit = (useLocalSearchParams().unit as string) || "";
  const amount = (useLocalSearchParams().amount as string) || "0";
  const [form, setForm] = useState<InputDTO>({
    amount,
    id,
    productId,
    date,
    name,
    unit,
  });

  useNavigation().setOptions({
    title: id ? "Edit Input Data Stock" : "Tambah Input Data Stock",
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

  const onChange = (key: keyof InputDTO, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Api<Input>>(`/inputs/${id}`);
      setForm({
        id: res.data.data.id,
        amount: res.data.data.amount.toString(),
        productId: res.data.data?.productId,
        date: "",
        name: res.data.data.product?.name,
        unit: res.data.data.unit,
      });
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

  const handleSubmit = async () => {
    try {
      if (!form.amount || form.amount === "0" || isNaN(Number(form.amount))) {
        throw new Error(`Harap lengkapi data`);
      }
      if (pending || loading) return;
      setPending(true);
      if (id) {
        const res = await api.put<Api<Input>>(`/inputs/${id}`, form);
        toastSuccess(res?.data?.message);
      } else {
        const res = await api.post<Api<Input>>("/inputs", form);
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
      const res = await api.delete<Api<Product>>(`/inputs/${id}`);
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

  return {
    form,
    onChange,
    loading,
    handleSubmit,
    pending,
    id,
    Confirmation,
  };
};

export default FormInputScreen;
