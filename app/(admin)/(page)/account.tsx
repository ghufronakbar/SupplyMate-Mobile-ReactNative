import { ThemedText } from "@/components/ThemedText";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { Img } from "@/components/ui/Img";
import api from "@/config/api";
import { Partner } from "@/models/Partner";
import { Api } from "@/models/Response";
import { User } from "@/models/User";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import { Entypo } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AccountScreen = () => {
  const {
    users,
    loading,
    fetchData,
    onClickSection,
    sections,
    selectedSection,
    partners,
  } = useOrders();
  return (
    <RefreshControl refreshing={loading} onRefresh={fetchData}>
      <SafeAreaView className="bg-white min-h-screen">
        <ThemedText
          type="title"
          className=" py-6 px-4 text-center font-omedium"
        >
          Akun Terdaftar
        </ThemedText>

        <View className="flex flex-row space-x-2">
          {sections.map((item, index) => (
            <TouchableOpacity
              className={`px-4 py-2 h-12 rounded-lg flex flex-col`}
              onPress={() => onClickSection(item)}
            >
              <ThemedText
                className={`${
                  selectedSection === item ? "text-custom-1" : " text-black"
                }`}
              >
                {item}
              </ThemedText>
              <View
                className={`h-[1px] w-full ${
                  selectedSection === item && "bg-custom-1"
                } mt-2`}
              />
            </TouchableOpacity>
          ))}
        </View>

        {selectedSection === "Mitra" ? (
          <FlatList
            data={partners}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => <ListPartner item={item} />}
          />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => <ListUser item={item} />}
          />
        )}
        <FloatingAddButton
          onPress={() => {
            if (selectedSection === "Mitra") {
              router.push("/(admin)/(page)/form-partner");
            } else {
              router.push("/(admin)/(page)/form-user");
            }
          }}
        />
      </SafeAreaView>
    </RefreshControl>
  );
};

interface ListUserProps {
  item: User;
}
const ListUser: React.FC<ListUserProps> = ({ item }) => {
  return (
    <Pressable
      className="w-full h-fit bg-white mb-2 border border-gray-200 rounded-2xl shadow-md overflow-hidden py-2 px-2"
      style={{ elevation: 5 }}
    >
      <View className="flex flex-row items-center ">
        <Img
          className="h-16 w-16 object-cover aspect-square rounded-xl mr-2"
          uri={item?.image}
          type="profile"
        />
        <View className="flex flex-row justify-between items-center w-[75%]">
          <View className="flex flex-col">
            <ThemedText className="text-black " numberOfLines={1}>
              {item.name}
            </ThemedText>
            <ThemedText>
              {item.role === "Employee" ? "Pegawai" : "Owner"}
            </ThemedText>
          </View>
          <Entypo name="chevron-thin-right" size={18} />
        </View>
      </View>
    </Pressable>
  );
};

interface ListPartnerProps {
  item: Partner;
}
const ListPartner: React.FC<ListPartnerProps> = ({ item }) => {
  return (
    <Pressable
      className="w-full h-fit bg-white mb-2 border border-gray-200 rounded-2xl shadow-md overflow-hidden py-2 px-2"
      style={{ elevation: 5 }}
    >
      <View className="flex flex-row items-center ">
        <Img
          className="h-16 w-16 object-cover aspect-square rounded-xl mr-2"
          uri={item?.image}
          type="profile"
        />
        <View className="flex flex-row justify-between items-center w-[75%]">
          <View className="flex flex-col">
            <ThemedText className="text-black " numberOfLines={1}>
              {item.pic}
            </ThemedText>
            <ThemedText>{item.name}</ThemedText>
          </View>
          <Entypo name="chevron-thin-right" size={18} />
        </View>
      </View>
    </Pressable>
  );
};

const useOrders = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedSection, setSelectedSection] = useState("Mitra");
  const sections = ["Mitra", "Pegawai"];

  const onClickSection = (section: string) => {
    setSelectedSection(section);
  };

  const fetchUsers = async () => {
    const res = await api.get<Api<User[]>>("/users");
    setUsers(res.data.data);
  };

  const fetchPartners = async () => {
    const res = await api.get<Api<Partner[]>>("/partners");
    setPartners(res.data.data);
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchPartners()]);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return {
    users,
    loading,
    fetchData,
    onClickSection,
    selectedSection,
    sections,
    partners,
  };
};

export default AccountScreen;
