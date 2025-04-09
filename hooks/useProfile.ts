import api from "@/config/api";
import { USER } from "@/constants/AsyncStorage";
import { toastSuccess } from "@/helper/toast";
import { Api } from "@/models/Response";
import { User } from "@/models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

const initProfile: User = {
  name: "Loading...",
  email: "Loading...",
  phone: "Loading...",
  image: null,
  accessToken: "",
  address: "Loading...",
  countryCode: "Loading...",
  createdAt: new Date(),
  id: "",
  isDeleted: false,
  password: "",
  role: "Employee",
  updatedAt: new Date(),
};

export const useProfile = () => {
  const [profile, setProfile] = useState<User>(initProfile);

  const fetchData = async () => {
    try {
      const user = await AsyncStorage.getItem(USER);
      if (user) {
        setProfile(JSON.parse(user));
        return JSON.parse(user) as User;
      } else {
        const r = await refetch();
        return r as User;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async (profile: User) => {
    try {
      await AsyncStorage.setItem(USER, JSON.stringify(profile));
      setProfile(profile);
    } catch (error) {
      console.log(error);
    }
  };

  const refetch = async () => {
    const res = await api.get<Api<User>>("/account");
    await updateProfile(res.data.data);
    setProfile(res.data.data);
    return res.data.data;
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const signOut = async () => {
    try {
      await AsyncStorage.clear();
      setProfile(initProfile);
      toastSuccess("Sign out successfully");
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return { profile, updateProfile, signOut, fetchData, refetch };
};
