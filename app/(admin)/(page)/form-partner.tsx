import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import FormInput from "@/components/ui/FormInput";
import LoadingView from "@/components/ui/LoadingView";
import SelectImage from "@/components/ui/SelectImage";
import { Ionicons } from "@expo/vector-icons";
import { toastError, toastSuccess } from "@/helper/toast";
import api from "@/config/api";
import { Api } from "@/models/Response";
import { Partner } from "@/models/Partner";
import ModalConfirmation from "@/components/ui/ModalConfirmation";
import { CountryPicker } from "react-native-country-codes-picker";
import { TextInput } from "react-native-paper";

const FormPartner = () => {
  const {
    form,
    loading,
    onChange,
    handleSubmit,
    pending,
    id,
    Confirmation,
    CountryCode,
    onClickCountry,
  } = usePartner();

  if (loading) return <LoadingView />;

  return (
    <ScrollView className="px-5 flex-1 bg-white min-h-screen">
      <View>
        <View className="flex-row">
          <ThemedText className="text-3xl font-obold">Yuk, </ThemedText>
          <ThemedText className="text-3xl font-obold text-custom-1">
            Lengkapi Mitra
          </ThemedText>
        </View>
        <View className="flex flex-col space-y-2 mt-4">
          <FormInput
            label="Nama Mitra"
            value={form.name}
            onChangeText={(text) => onChange("name", text)}
          />
          <FormInput
            label="Penanggung Jawab"
            value={form.pic}
            onChangeText={(text) => onChange("pic", text)}
          />
          <FormInput
            label="Nomor Telepon"
            value={form.phone}
            onChangeText={(text) => onChange("phone", text)}
            keyboardType="phone-pad"
            left={
              <TextInput.Icon
                icon={() => (
                  <Pressable
                    className="flex-row items-center"
                    onPress={onClickCountry}
                  >
                    <ThemedText
                      className="text-md text-[#181D27]"
                      numberOfLines={1}
                    >
                      {form.countryCode || "-"}
                    </ThemedText>
                  </Pressable>
                )}
              />
            }
          />
          <FormInput
            label="Alamat Mitra"
            value={form.address}
            onChangeText={(text) => onChange("address", text)}
            rows={5}
          />
          <View className="z-10 w-15 h-4 -mb-1 ml-2">
            <ThemedText className="ml-1 text-gray-700 font-oregular text-xs">
              Logo Mitra
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
          <View className="h-60 w-full bg-transparent" />
        </View>
      </View>
      <Confirmation />
      <CountryCode />
    </ScrollView>
  );
};

interface PartnerDTO {
  name: string;
  pic: string;
  countryCode: string;
  phone: string;
  address: string;
  image: string | null;
}

const initPartnerDTO: PartnerDTO = {
  name: "",
  pic: "",
  countryCode: "",
  phone: "",
  address: "",
  image: null,
};

const usePartner = () => {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [form, setForm] = useState(initPartnerDTO);
  const id = (useLocalSearchParams().id as string) || "";
  useNavigation().setOptions({
    title: id ? "Edit Mitra" : "Tambah Mitra",
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

  const onClickCountry = () => {
    setOpenCountry(!openCountry);
  };

  const CountryCode = () => (
    <CountryPicker
      lang="en"
      show={openCountry}
      pickerButtonOnPress={(item) => {
        onClickCountry();
        setForm({ ...form, countryCode: item.dial_code });
      }}
    />
  );

  const onClickDel = () => {
    setOpenDel(!openDel);
  };

  const onChange = (key: keyof PartnerDTO, value: string | null) => {
    setForm({ ...form, [key]: value });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Api<Partner>>(`/partners/${id}`);
      setForm({
        ...res.data.data,
      });
      setLoading(false);
    } catch (error) {
      toastError(error);
      router.back();
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      Object.values(form).forEach((value) => {
        if (value === "") {
          throw new Error("Harap isi semua data");
        }
      });
      if (pending || loading) return;
      setPending(true);
      if (id) {
        const res = await api.put<Api<Partner>>(`/partners/${id}`, form);
        toastSuccess(res?.data?.message);
      } else {
        const res = await api.post<Api<Partner>>("/partners", form);
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
      const res = await api.delete<Api<Partner>>(`/partners/${id}`);
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
    onClickCountry,
    CountryCode,
  };
};

export default FormPartner;
