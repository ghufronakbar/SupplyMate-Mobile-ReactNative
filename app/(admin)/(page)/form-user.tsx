import React, { useState, useEffect } from "react";
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
import { User } from "@/models/User";
import { Dropdown } from "react-native-element-dropdown";
import ModalConfirmation from "@/components/ui/ModalConfirmation";
import { CountryPicker } from "react-native-country-codes-picker";
import { TextInput } from "react-native-paper";
import { Img } from "@/components/ui/Img";

const FormUser = () => {
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
    ROLES,
  } = useUser();

  if (loading) return <LoadingView />;

  return (
    <ScrollView className="px-5 flex-1 bg-white min-h-screen">
      <View>
        <View className="flex flex-col space-y-2">
          <Img
            uri={form.image}
            className="w-24 h-24 rounded-full mx-auto mb-4"
            type="profile"
          />
          <FormInput
            label="Nama"
            value={form.name}
            onChangeText={(text) => onChange("name", text)}
            editable={!id}
          />
          <FormInput
            label="Email"
            value={form.email}
            onChangeText={(text) => onChange("email", text)}
            keyboardType="email-address"
            editable={!id}
          />
          <FormInput
            label="Nomor Telepon"
            value={form.phone}
            onChangeText={(text) => onChange("phone", text)}
            keyboardType="phone-pad"
            editable={!id}
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
            label="Alamat"
            value={form.address}
            onChangeText={(text) => onChange("address", text)}
            rows={5}
            editable={!id}
          />
          <View className="bg-white z-10 w-10 h-4 -mb-4 ml-2">
            <ThemedText className="ml-1 text-gray-700 font-oregular text-xs">
              Role Akun
            </ThemedText>
          </View>
          <Dropdown
            data={ROLES}
            labelField="label"
            valueField="value"
            value={form.role}
            onChange={(item) => onChange("role", item.value)}
            search={false}
            placeholder="Pilih Role"
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

interface UserDTO {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  address: string;
  role: string;
  image: string | null;
}

const initUserDTO: UserDTO = {
  name: "",
  email: "",
  countryCode: "",
  phone: "",
  address: "",
  role: "",
  image: null,
};

const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [form, setForm] = useState(initUserDTO);
  const id = (useLocalSearchParams().id as string) || "";
  useNavigation().setOptions({
    title: id ? "Edit Role" : "Tambah Akun",
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

  const onChange = (key: keyof UserDTO, value: string | null) => {
    setForm({ ...form, [key]: value });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Api<User>>(`/users/${id}`);
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
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "image" && value === "") {
          throw new Error("Harap isi semua data");
        }
      });
      if (pending || loading) return;
      setPending(true);
      console.log({ form });
      if (id) {
        const res = await api.patch<Api<User>>(`/account/${id}`, form);
        toastSuccess(res?.data?.message);
      } else {
        const res = await api.post<Api<User>>("/account/register", form);
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
      const res = await api.delete<Api<User>>(`/users/${id}`);
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

  const ROLES = [
    {
      label: "Admin",
      value: "Admin",
    },
    {
      label: "Manager",
      value: "Manager",
    },
    {
      label: "Pegawai",
      value: "Pegawai",
    },
  ];

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
    ROLES,
  };
};

export default FormUser;
