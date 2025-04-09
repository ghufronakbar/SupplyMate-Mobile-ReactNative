import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router, useNavigation } from "expo-router";
import FormInput from "@/components/ui/FormInput";
import LoadingView from "@/components/ui/LoadingView";
import { toastError, toastSuccess } from "@/helper/toast";
import api from "@/config/api";
import { Api } from "@/models/Response";
import { User } from "@/models/User";
import { CountryPicker } from "react-native-country-codes-picker";
import { TextInput } from "react-native-paper";
import SelectRoundImage from "@/components/ui/SelectRoundImage";
import { useProfile } from "@/hooks/useProfile";

const ProfileScreen = () => {
  const {
    form,
    loading,
    onChange,
    handleSubmit,
    pending,
    CountryCode,
    onClickCountry,
  } = useEditProfile();

  if (loading) return <LoadingView />;

  return (
    <ScrollView className="px-5 flex-1 bg-white min-h-screen">
      <View>
        <SelectRoundImage
          image={form.image}
          onChangeImage={(value) => onChange("image", value)}
        />
        <View className="flex flex-col space-y-2 mt-4">
          <FormInput
            label="Nama"
            value={form.name}
            onChangeText={(text) => onChange("name", text)}
          />
          <FormInput
            label="Email"
            value={form.email}
            onChangeText={(text) => onChange("email", text)}
            keyboardType="email-address"
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
            label="Alamat"
            value={form.address}
            onChangeText={(text) => onChange("address", text)}
            rows={5}
          />
          <FormInput
            label="Role Akun"
            value={form.role}
            onChangeText={(text) => onChange("role", text)}
            editable={false}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            className="mb-4 p-3 flex items-center justify-center rounded-lg bg-custom-1 mt-4"
          >
            <ThemedText className="text-white font-oregular text-lg">
              {pending ? <ActivityIndicator color="white" /> : "Simpan"}
            </ThemedText>
          </TouchableOpacity>
          <View className="h-60 w-full bg-transparent" />
        </View>
      </View>
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

const useEditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [form, setForm] = useState(initUserDTO);
  const { updateProfile } = useProfile();

  useNavigation().setOptions({
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

  const onChange = (key: keyof UserDTO, value: string | null) => {
    setForm({ ...form, [key]: value });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Api<User>>(`/account`);
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
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "image" && value === "") {
          throw new Error("Harap isi semua data");
        }
      });
      if (pending || loading) return;
      setPending(true);
      const res = await api.put<Api<User>>("/account", form);
      updateProfile(res.data.data);
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

  return {
    form,
    onChange,
    loading,
    handleSubmit,
    pending,
    onClickCountry,
    CountryCode,
  };
};

export default ProfileScreen;
