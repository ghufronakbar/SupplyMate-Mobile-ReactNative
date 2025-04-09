import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router, useNavigation } from "expo-router";
import FormInput from "@/components/ui/FormInput";
import LoadingView from "@/components/ui/LoadingView";
import { toastError, toastSuccess } from "@/helper/toast";
import api from "@/config/api";
import { Api } from "@/models/Response";
import { User } from "@/models/User";

const ChangePassScreen = () => {
  const { form, loading, onChange, handleSubmit, pending } = useChangePass();

  if (loading) return <LoadingView />;

  return (
    <ScrollView className="px-5 flex-1 bg-white min-h-screen">
      <View>
        <View className="flex-row">
          <ThemedText className="text-3xl font-obold">Yuk, </ThemedText>
          <ThemedText className="text-3xl font-obold text-custom-1">
            Ganti Password!
          </ThemedText>
        </View>

        <View className="flex flex-col space-y-2 mt-4">
          <FormInput
            label="Password Lama"
            value={form.oldPassword}
            onChangeText={(text) => onChange("oldPassword", text)}
            secureTextEntry
          />
          <FormInput
            label="Password Baru"
            value={form.newPassword}
            onChangeText={(text) => onChange("newPassword", text)}
            secureTextEntry
          />
          <FormInput
            label="Konfirmasi Password"
            value={form.confirmPassword}
            onChangeText={(text) => onChange("confirmPassword", text)}
            secureTextEntry
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
    </ScrollView>
  );
};

interface ChangePassDTO {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const initChangePassDTO: ChangePassDTO = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const useChangePass = () => {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState(initChangePassDTO);

  useNavigation().setOptions({
    headerShown: !loading,
  });

  const onChange = (key: keyof ChangePassDTO, value: string | null) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "image" && value === "") {
          throw new Error("Harap isi semua data");
        }
      });
      if (form.newPassword.length < 6)
        throw new Error("Password minimal 6 karakter");
      if (form.newPassword !== form.confirmPassword)
        throw new Error("Konfirmasi password tidak sama");
      if (pending || loading) return;
      setPending(true);
      const res = await api.post<Api<User>>("/account/edit-password", form);
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
  };
};

export default ChangePassScreen;
