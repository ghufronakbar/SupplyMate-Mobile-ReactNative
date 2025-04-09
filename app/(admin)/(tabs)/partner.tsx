import { ThemedText } from "@/components/ThemedText";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { Img } from "@/components/ui/Img";
import api from "@/config/api";
import { Partner } from "@/models/Partner";
import { Api } from "@/models/Response";
import { Entypo } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PartnerScreen = () => {
  const { data, loading, fetchData } = usePartners();
  return (
    <RefreshControl refreshing={loading} onRefresh={fetchData}>
      <SafeAreaView className="bg-white h-full">
        <ThemedText
          type="title"
          className=" py-6 px-4 text-center font-omedium"
        >
          Mitra Terdaftar
        </ThemedText>

        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <ListPartner
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/(admin)/(page)/form-partner",
                  params: {
                    id: item.id,
                  },
                })
              }
            />
          )}
        />

        <FloatingAddButton
          onPress={() => router.push("/(admin)/(page)/form-partner")}
        />
      </SafeAreaView>
    </RefreshControl>
  );
};

interface ListPartnerProps {
  item: Partner;
  onPress: () => void;
}
const ListPartner: React.FC<ListPartnerProps> = ({ item, onPress }) => {
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

const usePartners = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Partner[]>([]);

  const fetchUsers = async () => {
    const res = await api.get<Api<Partner[]>>("/partners");
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
    data,
  };
};

export default PartnerScreen;
