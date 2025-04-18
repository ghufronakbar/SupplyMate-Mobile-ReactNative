import { ThemedText } from "@/components/ThemedText";
import api from "@/config/api";
import { C, Colors } from "@/constants/Colors";
import { useProfile } from "@/hooks/useProfile";
import { ChartRes, Overview } from "@/models/Dashboard";
import { Api } from "@/models/Response";
import formatRupiah from "@/utils/formatRupiah";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackedBarChart } from "react-native-chart-kit";
import { StackedBarChartData } from "react-native-chart-kit/dist/StackedBarChart";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { toastError } from "@/helper/toast";
import { Dropdown } from "react-native-element-dropdown";

const HomeScreen = () => {
  const { profile, signOut } = useProfile();
  const { goToProfile, isSetting, toggleSetting, goToChange } = useHome();
  const {
    overview,
    chartData,
    sbChartConfig,
    loading,
    fetchData,
    data,
    isNoData,
    downloading,
    handleDownload,
    selectedLaporan,
    selectedRange,
    setSelectedLaporan,
    setSelectedRange,
  } = useDashboard();

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        className="h-full"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
      >
        <Pressable
          className="flex flex-row space-x-4 w-full px-4 py-4 items-center relative z-20"
          onPress={toggleSetting}
        >
          <ThemedText type="title" className=" font-omedium max-w-[70%]">
            Hi, {profile.name}
          </ThemedText>
          <Entypo name="chevron-thin-down" size={18} />
          {isSetting && (
            <View className="w-fit h-fit bg-white absolute -bottom-24 z-20 flex flex-col border border-[#F5F5F5] rounded-lg">
              <TouchableOpacity
                className="flex flex-row items-center px-2 py-1 space-x-2 border-b border-[#F5F5F5]"
                onPress={goToProfile}
              >
                <Ionicons name="person" size={20} />
                <ThemedText className="text-black text-xl">
                  Edit Profile
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex flex-row items-center px-2 py-1 space-x-2 border-b border-[#F5F5F5]"
                onPress={goToChange}
              >
                <Ionicons name="lock-closed" color={"#ffa500"} size={20} />
                <ThemedText className="text-black text-xl">
                  Ubah Password
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex flex-row items-center px-2 py-1 space-x-2 "
                onPress={signOut}
              >
                <Ionicons name="power" color={"#f87171"} size={20} />
                <ThemedText className="text-black text-xl">Logout</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
        <View className="flex flex-col space-y-4 h-full">
          <View className="flex flex-col space-y-2">
            <ThemedText className="text-black text-2xl font-omedium px-4">
              Overview
            </ThemedText>
            <View className="flex flex-row w-full justify-between px-4">
              <View
                className="w-[43vw] h-[43vw] bg-[#F5F5F5] rounded-xl flex flex-col p-4 justify-between"
                style={{ elevation: 5 }}
              >
                <View className="flex flex-row w-full bg-white items-center px-2 py-1 rounded-3xl space-x-2">
                  <MaterialIcons
                    name="bakery-dining"
                    color={"#ca8a04"}
                    size={24}
                  />
                  <ThemedText className="font-omedium text-xl">
                    Hari Ini
                  </ThemedText>
                </View>
                <View className="flex flex-col">
                  <ThemedText className="text-xl font-osemibold">
                    {typeof overview?.order?.total === "number"
                      ? overview?.order?.total + " Pesanan"
                      : "Loading..."}
                  </ThemedText>
                  <ThemedText className="-mb-1 leading-4">
                    {overview?.order?.message || "Loading..."}
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity
                className="w-[43vw] h-[43vw] bg-white rounded-xl flex flex-col p-4 justify-between"
                style={{ elevation: 5 }}
                onPress={() => router.push("/(admin)/(page)/analytic")}
              >
                <View className="flex flex-row w-full bg-white items-center px-2 py-1 rounded-3xl space-x-2">
                  <View className="rounded-full bg-[#F5F5F5] flex items-center justify-center w-8 h-8">
                    <MaterialIcons name="bar-chart" color={C[1]} size={24} />
                  </View>
                  <ThemedText className="font-omedium text-xl">
                    Sales
                  </ThemedText>
                </View>
                <View className="flex flex-col">
                  <ThemedText className="font-osemibold">Rp</ThemedText>
                  <ThemedText className="font-osemibold text-xl">
                    {typeof overview?.sales?.totalIncome == "number"
                      ? formatRupiah(overview?.sales?.totalIncome, false)
                      : "Loading..."}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-col space-y-2">
            <ThemedText className="text-black text-2xl font-omedium px-4">
              Laporan
            </ThemedText>
            <View className="flex flex-row w-full justify-between px-4">
              <View
                className="w-full h-fit bg-white rounded-xl flex flex-col p-4 space-y-2"
                style={{ elevation: 5 }}
              >
                <View className="flex flex-row justify-between w-full items-center">
                  <View className="w-[47%] h-fit flex flex-col space-y-2">
                    <ThemedText className="font-omedium text-lg">
                      Tipe Data
                    </ThemedText>
                    <Dropdown
                      data={LAPORAN_TYPES}
                      labelField={"label"}
                      onChange={(value) => setSelectedLaporan(value)}
                      valueField={"value"}
                      value={selectedLaporan}
                      fontFamily="Outfit-Regular"
                      style={{
                        backgroundColor: "#F5F5F5",
                        borderRadius: 8,
                        borderWidth: 0,
                        height: 45,
                        paddingHorizontal: 10,
                      }}
                    />
                  </View>
                  <View
                    className={`w-[47%] h-fit flex flex-col space-y-2 ${
                      selectedLaporan.isRanged ? "" : "hidden"
                    }`}
                  >
                    <ThemedText className="font-omedium text-lg">
                      Rentang Waktu
                    </ThemedText>
                    <Dropdown
                      data={RANGE_TYPES}
                      labelField={"label"}
                      onChange={(value) => setSelectedRange(value)}
                      valueField={"value"}
                      value={selectedRange}
                      fontFamily="Outfit-Regular"
                      style={{
                        backgroundColor: "#F5F5F5",
                        borderRadius: 8,
                        borderWidth: 0,
                        height: 45,
                        paddingHorizontal: 10,
                      }}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  className="border border-gray-200 rounded-3xl flex flex-row items-center justify-center space-x-2 h-10"
                  onPress={handleDownload}
                >
                  {downloading ? (
                    <ActivityIndicator size="small" color={C[1]} />
                  ) : (
                    <View className=" flex flex-row items-center justify-center space-x-2">
                      <MaterialCommunityIcons
                        name="download"
                        color={C[1]}
                        size={25}
                      />
                      <ThemedText className="font-omedium">Download</ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="flex flex-col space-y-2">
            <ThemedText className="text-black text-2xl font-omedium px-4">
              Analisis
            </ThemedText>
            <View className="flex flex-row w-full justify-between px-4">
              <View
                className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
                style={{ elevation: 5 }}
              >
                <View className="flex flex-row justify-between">
                  <View className="flex flex-col">
                    <ThemedText className="text-3xl font-osemibold">
                      {data?.master?.total || 0}
                    </ThemedText>
                    <ThemedText>Total Pesanan (1 tahun)</ThemedText>
                  </View>
                  <View className="rounded-full bg-[#F5F5F5] flex items-center justify-center w-10 h-10">
                    <MaterialIcons name="bar-chart" color={C[1]} size={30} />
                  </View>
                </View>
                {/* CHART */}
                {isNoData && !loading && (
                  <View className="w-full h-40 flex items-center justify-center ">
                    <ThemedText className="text-lg text-custom-1">
                      Data belum tersedia
                    </ThemedText>
                  </View>
                )}
                <ScrollView className="overflow-x-scroll w-full" horizontal>
                  {!isNoData && chartData.data.length > 0 && (
                    <StackedBarChart
                      data={chartData}
                      width={
                        Dimensions.get("window").width * 0.1 +
                        Dimensions.get("window").width *
                          (0.2 * chartData.data.length)
                      }
                      height={180}
                      chartConfig={sbChartConfig}
                      fromZero
                      hideLegend
                      withHorizontalLabels={false}
                      style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        padding: 0,
                        marginLeft: -50,
                      }}
                    />
                  )}
                </ScrollView>
                <View className="w-full flex flex-row flex-wrap justify-between mt-4 px-4">
                  {data?.keys?.map((item, index) => (
                    <View
                      className="flex flex-col w-[48%] items-start mb-2"
                      key={index}
                    >
                      <View
                        className="w-2 h-2"
                        style={{
                          backgroundColor: item.color || C[1],
                        }}
                      ></View>
                      <ThemedText>{item.name}</ThemedText>
                      <ThemedText className="-mt-1">{item.total}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
          <View className="h-40 w-full" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const useHome = () => {
  const [isSetting, setIsSetting] = useState(false);

  const toggleSetting = () => setIsSetting(!isSetting);
  const goToProfile = () => {
    setIsSetting(false);
    router.push("/(admin)/(page)/profile");
  };
  const goToChange = () => {
    setIsSetting(false);
    router.push("/(admin)/(page)/change-password");
  };

  return { isSetting, toggleSetting, goToProfile, goToChange };
};

const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<Overview>({} as Overview);
  const [data, setData] = useState<ChartRes>();

  const fetchOverview = async () => {
    const res = await api.get<Api<Overview>>("/dashboard/overview");
    setOverview(res.data.data);
  };

  const fetchChartProduct = async () => {
    const res = await api.get<Api<ChartRes>>(
      "/dashboard/chart-product?type=yearly"
    );
    setData(res.data.data);
  };

  const dataProduct = data?.chart.map((item) =>
    Object.values(item).filter((value) => typeof value === "number")
  ) || [[]];

  const chartData: StackedBarChartData = {
    labels: data?.chart.map((item) => item?.date) || [],
    legend: data?.keys.map((item) => item.name) || [],
    data: dataProduct,
    barColors: data?.keys.map((item) => item.color) || [],
  };

  const isNoData = chartData.data.every((item) =>
    item.every((value) => value === 0)
  );

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchOverview(), fetchChartProduct()]);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const sbChartConfig: AbstractChartConfig = {
    backgroundGradientFrom: "#FAFAFA",
    backgroundGradientTo: "#FAFAFA",
    decimalPlaces: 0,
    color: () => `gray`,
    labelColor: () => "#181D27",
    barPercentage: 0.5,
    barRadius: 1,
    propsForLabels: {
      fontFamily: "Outfit-Medium",
    },
  };

  const [downloading, setDownloading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<(typeof RANGE_TYPES)[0]>(
    RANGE_TYPES[0]
  );
  const [selectedLaporan, setSelectedLaporan] = useState<
    (typeof LAPORAN_TYPES)[0]
  >(LAPORAN_TYPES[0]);

  const handleDownload = async () => {
    try {
      if (downloading) return;
      setDownloading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await Linking.openURL(
        `${process.env.API_URL}/api/report/${selectedLaporan.value}?type=${selectedRange.value}`
      );
    } catch (error) {
      toastError(error);
    } finally {
      setDownloading(false);
    }
  };

  return {
    overview,
    chartData,
    loading,
    sbChartConfig,
    fetchData,
    data,
    isNoData,
    downloading,
    selectedRange,
    setSelectedRange,
    selectedLaporan,
    setSelectedLaporan,
    handleDownload,
  };
};

const LAPORAN_TYPES = [
  {
    label: "Produk Masuk",
    value: "input",
    isRanged: true,
  },
  {
    label: "Pesanan",
    value: "order",
    isRanged: true,
  },
  {
    label: "Mitra",
    value: "partner",
    isRanged: false,
  },
  {
    label: "Produk",
    value: "product",
    isRanged: false,
  },
];

const RANGE_TYPES = [
  {
    label: "Mingguan",
    value: "weekly",
  },
  {
    label: "Bulanan",
    value: "monthly",
  },
  {
    label: "Semua",
    value: "All",
  },
];

export default HomeScreen;
