import { ThemedText } from "@/components/ThemedText";
import FormInput from "@/components/ui/FormInput";
import api from "@/config/api";
import { toastError, toastLoading, toastSuccess } from "@/helper/toast";
import { Api } from "@/models/Response";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  TouchableOpacity,
  ScrollView,
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { height } = Dimensions.get("window");

const ResetPassScreen = () => {
  const { form, handleLogin, loading, onChange } = useChangePassword();
  const { width, height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);

  const dynamicStyles = StyleSheet.create({
    input: {
      width: width >= 500 && width < 1200 ? "90%" : "100%",
      fontSize: width >= 500 && width < 1200 ? 24 : 14,
      marginBottom: 15,
    },
    button: {
      backgroundColor: "#23ACE3",
      padding: 15,
      borderRadius: 10,
      width: width >= 500 && width < 1200 ? "90%" : "100%",
      alignItems: "center",
      marginVertical: 15,
    },
    buttonText: {
      color: "#fff",
      fontSize: width >= 500 && width < 1200 ? 24 : 16,
      fontWeight: "600",
    },
  });

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <View className="flex flex-row justify-between absolute top-11 bg-white">
        <View className="px-5 mt-32">
          <ThemedText className="font-obold text-3xl md:text-4xl lg:text-8xl text-[#585858]">
            Welcome to
          </ThemedText>
          <ThemedText className="font-oextrabold text-3xl md:text-4xl lg:text-7xl text-[#23ACE3]">
            SupplyMate
          </ThemedText>
          <ThemedText className="font-omedium text-sm md:text-3xl lg:text-3xl text-[#585858]">
            Sign in now and be a part
          </ThemedText>
          <ThemedText className="font-omedium text-sm md:text-3xl lg:text-3xl text-[#585858]">
            of something amazing.
          </ThemedText>
        </View>

        <Image
          source={require("@/assets/images/login.png")}
          style={{ width: width * 1.4, height: height / 1.4 }}
          className="absolute inset-y-0-right-10"
          resizeMode="contain"
        />
      </View>
      <KeyboardAvoidingView behavior={"height"} style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.formSection]} className="bg-white">
            <ThemedText
              type="title"
              className="text-3xl md:text-3xl lg:text-5xl font-obold text-[#585858] mt-2"
            >
              RESET PASSWORD
            </ThemedText>

            <FormInput
              value={form.email}
              onChangeText={(value) => onChange("email", value)}
              label="Email"
              returnKeyType="next"
              keyboardType="email-address"
            />

            <TouchableOpacity
              className="self-end"
              onPress={() => router.replace("/login")}
            >
              <ThemedText className=" font-oregular lg:text-lg text-originblue">
                Sudah Memiliki Akun?
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={dynamicStyles.button}
              onPress={handleLogin}
            >
              <ThemedText
                className="font-oregular"
                style={dynamicStyles.buttonText}
              >
                {loading ? <ActivityIndicator color="white" /> : "Sign In"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

interface ChangePassDTO {
  email: string;
}

const initChangePassDTO: ChangePassDTO = {
  email: "",
};

const useChangePassword = () => {
  const [form, setForm] = useState<ChangePassDTO>(initChangePassDTO);
  const [loading, setLoading] = useState(false);

  const onChange = (key: keyof ChangePassDTO, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleLogin = async () => {
    try {
      Object.values(form).forEach((value) => {
        if (value === "") {
          throw new Error("Harap isi semua field");
        }
      });
      if (loading) return;
      setLoading(true);
      toastLoading();
      const res = await api.post<Api>("/account/reset-password", form);
      toastSuccess(res?.data?.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      router.replace("/login");
    } catch (error) {
      console.log(error);
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onChange,
    handleLogin,
    loading,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formSection: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    marginTop: height * 0.4,
    paddingBottom: 10,
  },
  welcomeText: {
    color: "#585858",
    fontWeight: "bold",
  },
  appName: {
    color: "#23ACE3",
  },

  signUpLink: {
    fontSize: 14,
    color: "#585858",
  },
  signUpLinkText: {
    color: "#23ACE3",
    fontWeight: "600",
  },
});

export default ResetPassScreen;
