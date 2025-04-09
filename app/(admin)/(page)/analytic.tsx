import { ThemedText } from "@/components/ThemedText";
import LoadingView from "@/components/ui/LoadingView";
import api from "@/config/api";
import { C } from "@/constants/Colors";
import { ChartRes, Overview, PartnerOverview } from "@/models/Dashboard";
import { Api } from "@/models/Response";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import StackedBarChart, {
  StackedBarChartData,
} from "react-native-chart-kit/dist/StackedBarChart";

const AnalyticScreen = () => {
  const {
    chartProductData,
    sbChartConfig,
    loading,
    fetchData,
    onClickSection,
    sections,
    selectedSection,
    partners,
    isVisible,
    income,
    product,
    selectedType,
    onClickType,
    fetching
  } = useDashboard();
  if (loading) return <LoadingView />;
  return (
    <ScrollView
      className="h-full bg-white"
      refreshControl={
        <RefreshControl refreshing={fetching} onRefresh={fetchData} />
      }
    >
      <View className="flex flex-col space-y-4 h-full">
        <View className="flex flex-row">
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
        <View className="flex flex-row px-4 space-x-2">
          {TYPES.map((item, index) => (
            <TouchableOpacity
              className={`px-2 py-1 h-fit rounded-xl flex items-center justify-center ${
                selectedType === item
                  ? "bg-custom-1"
                  : " bg-white border border-custom-1"
              }`}
              onPress={() => onClickType(item)}
            >
              <ThemedText
                className={`text-sm ${
                  selectedType === item ? "text-white" : " text-custom-1"
                }`}
              >
                {item}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <View
          className={`flex flex-col space-y-2 px-4 mt-2 ${isVisible(
            "Ringkasan"
          )}`}
        >
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <View className="flex flex-row justify-between">
              <View className="flex flex-col">
                <ThemedText>Penjualan Kotor (IDR)</ThemedText>
                <ThemedText className="text-sm">
                  Terakhir Diperbarui {formatDate(new Date(), true, true)}
                </ThemedText>
                <ThemedText className="text-2xl font-osemibold mt-1 text-black">
                  {formatRupiah(income?.master?.totalSellPrice)}
                </ThemedText>
              </View>
              <View className="rounded-full bg-[#F5F5F5] flex items-center justify-center w-10 h-10">
                <MaterialIcons name="bar-chart" color={C[1]} size={30} />
              </View>
            </View>
            {/* CHART */}
            <ScrollView className="overflow-x-scroll w-full" horizontal>
              {chartProductData.data.length > 0 && !loading && (
                <StackedBarChart
                  data={chartProductData}
                  width={
                    Dimensions.get("window").width * 2
                    //  +
                    // Dimensions.get("window").width *
                    //   (0.1 * chartProductData.data.length)
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
              {income?.keys?.map((item, index) => (
                <View
                  className="flex flex-col w-[48%] items-start mb-2"
                  key={index}
                >
                  <View
                    className="w-2 h-2"
                    style={{
                      backgroundColor: item?.color || C[1],
                    }}
                  ></View>
                  <ThemedText>{item?.name}</ThemedText>
                  <ThemedText className="-mt-1 text-sm">
                    {formatRupiah(item?.total)}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText>Penjualan Bersih (IDR)</ThemedText>
            <ThemedText className="text-2xl font-osemibold mt-1 text-black">
              {formatRupiah(income?.master?.profit)}
            </ThemedText>
            <ThemedText className="text-sm">
              Total penjualan setelah dipotong biaya modal produksi
            </ThemedText>
          </View>
        </View>
        <View
          className={`flex flex-col space-y-2 px-4 ${isVisible("Penjualan")}`}
        >
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText>Total Pesanan Terjual</ThemedText>
            <ThemedText className="text-2xl font-osemibold mt-1 text-black">
              {product?.master?.total || 0}
            </ThemedText>
          </View>
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText className="mb-4">Barang Terlaris</ThemedText>
            {product?.keys
              ?.sort((a, b) => b.total - a.total)
              .slice(0, 5)
              .map((item, index) => (
                <View
                  key={index}
                  className="mb-2 flex flex-row justify-between items-center"
                >
                  <View className="flex flex-col">
                    <ThemedText>{item.name}</ThemedText>
                    <ThemedText className="text-2xl text-black">
                      {item.total}
                    </ThemedText>
                  </View>
                </View>
              ))}
          </View>
        </View>
        <View className={`flex flex-col space-y-2 px-4 ${isVisible("Mitra")}`}>
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText>Rata-Rata Transaksi Mitra</ThemedText>
            <ThemedText className="text-2xl font-osemibold mt-1 text-black">
              {formatRupiah(partners?.transaction?.averageTransactionValue)}
            </ThemedText>
            <ThemedText className="text-sm leading-4">
              Rata-rata nilai pembelian dari setiap mitra (penjualan bersih
              dibagi dengan total pesanan)
            </ThemedText>
          </View>
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText>Total Mitra Bergabung</ThemedText>
            <ThemedText className="text-2xl font-osemibold mt-1 text-black">
              {partners?.totalPartners || 0}
            </ThemedText>
          </View>
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText className="mb-4">Penjualan Terbanyak</ThemedText>
            {partners?.topPartners?.map((item, index) => (
              <View
                key={index}
                className="mb-2 flex flex-row justify-between items-center"
              >
                <View className="flex flex-col">
                  <ThemedText>{item.name}</ThemedText>
                  <ThemedText className="text-2xl text-black">
                    {item?.totalQuantity}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View className="h-40 w-full" />
      </View>
    </ScrollView>
  );
};

type TypeOverview = "12 Bulan Terakhir" | "Bulan Ini" | "7 Hari Terakhir";
const TYPES: TypeOverview[] = [
  "12 Bulan Terakhir",
  "Bulan Ini",
  "7 Hari Terakhir",
];

const useDashboard = () => {
  const [income, setIncome] = useState<ChartRes>();
  const [product, setProduct] = useState<ChartRes>();
  const [partners, setPartners] = useState<PartnerOverview>();
  const [selectedType, setSelectedType] =
    useState<TypeOverview>("12 Bulan Terakhir");

  const [fetching, setFetching] = useState(false);

  const [selectedSection, setSelectedSection] = useState("Ringkasan");
  const sections = ["Ringkasan", "Penjualan", "Mitra"];

  const type =
    selectedType === "7 Hari Terakhir"
      ? "weekly"
      : selectedType === "Bulan Ini"
      ? "monthly"
      : "yearly";

  const onClickType = (type: TypeOverview) => {
    setSelectedType(type);
  };

  const loading = !income || !product || !partners;

  useNavigation().setOptions({
    headerShown: !loading,
  });

  const onClickSection = (section: string) => {
    setSelectedSection(section);
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchData();
  //   }, [])
  // );

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchChartIncome = async () => {
    const res = await api.get<Api<ChartRes>>("/dashboard/chart-income", {
      params: { type },
    });
    setIncome(res.data.data);
  };

  const fetchChartProduct = async () => {
    const res = await api.get<Api<ChartRes>>("/dashboard/chart-product", {
      params: { type },
    });
    setProduct(res.data.data);
  };

  const fetchPartnerOverview = async () => {
    const res = await api.get<Api<PartnerOverview>>(
      "/dashboard/partner-overview",
      {
        params: { type },
      }
    );
    setPartners(res.data.data);
  };

  const dataProduct = income?.chart.map((item) =>
    Object.values(item).filter((value) => typeof value === "number")
  ) || [[]];

  const chartProductData: StackedBarChartData = {
    labels: income?.chart.map((item) => item?.date) || [],
    legend: income?.keys.map((item) => item?.name) || [],
    data: dataProduct,
    barColors: income?.keys.map((item) => item?.color) || [],
  };

  const fetchData = async () => {
    setFetching(true);
    await Promise.all([
      fetchChartProduct(),
      fetchChartIncome(),
      fetchPartnerOverview(),
    ]);
    setFetching(false);
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
      fontFamily: "Outfit-Regular",
    },
  };

  const isVisible = (section: string) => {
    return section === selectedSection ? "flex" : "hidden";
  };

  return {
    chartProductData,
    loading,
    sbChartConfig,
    fetching,
    fetchData,
    onClickSection,
    sections,
    selectedSection,
    partners,
    isVisible,
    income,
    product,
    selectedType,
    onClickType,
  };
};
export default AnalyticScreen;
