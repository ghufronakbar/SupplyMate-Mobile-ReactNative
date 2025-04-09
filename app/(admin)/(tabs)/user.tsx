import { ThemedText } from "@/components/ThemedText";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { Img } from "@/components/ui/Img";
import api from "@/config/api";
import { Api } from "@/models/Response";
import { User } from "@/models/User";
import { Entypo } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UserScreen = () => {
  const {
    filteredData,
    loading,
    fetchData,
    onClickSection,
    sections,
    selectedSection,
  } = useUsers();
  return (
    <RefreshControl refreshing={loading} onRefresh={fetchData}>
      <SafeAreaView className="bg-white h-full">
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

        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <ListUser
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/(admin)/(page)/form-user",
                  params: {
                    id: item.id,
                  },
                })
              }
            />
          )}
        />

        <FloatingAddButton
          onPress={() => router.push("/(admin)/(page)/form-user")}
        />
      </SafeAreaView>
    </RefreshControl>
  );
};

interface ListUserProps {
  item: User;
  onPress: () => void;
}
const ListUser: React.FC<ListUserProps> = ({ item, onPress }) => {
  return (
    <Pressable
      className="w-full h-fit bg-white mb-2 border border-gray-200 rounded-2xl shadow-md overflow-hidden py-2 px-2"
      style={{ elevation: 5 }}
      onPress={onPress}
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
            <ThemedText>{item.role}</ThemedText>
          </View>
          <Entypo name="chevron-thin-right" size={18} />
        </View>
      </View>
    </Pressable>
  );
};

const useUsers = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<User[]>([]);
  const [selectedSection, setSelectedSection] = useState("Admin");
  const sections = ["Admin", "Pegawai", "Manager"];

  const filteredData = useMemo(() => {
    return data.filter((item) => item.role === selectedSection);
  }, [data, selectedSection]);

  const onClickSection = (section: string) => {
    setSelectedSection(section);
  };

  const fetchUsers = async () => {
    const res = await api.get<Api<User[]>>("/users");
    setData(res.data.data);
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers()]);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return {
    loading,
    fetchData,
    onClickSection,
    selectedSection,
    sections,
    filteredData,
  };
};

export default UserScreen;
