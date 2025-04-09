import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { View, Image } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { useContext } from "react";

interface Props {
  onConfirm: () => void;
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const ModalConfirmation = ({
  onConfirm,
  showAlert,
  setShowAlert,
  title = "Konfirmasi Aksi",
  message = "Apakah anda yakin ingin melanjutkan?",
  confirmText = "Konfirmasi",
  cancelText = "Batalkan",
}: Props) => {
  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      contentContainerStyle={[{ backgroundColor: "#FFFFFF", borderRadius: 20 }]}
      customView={
        <View className="items-center">
          <View
            className="p-3 rounded-full"
            style={{ backgroundColor: "#FC366B40" }}
          >
            <Image
              source={require("@/assets/images/cautions.png")}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
          <ThemedText className="font-omedium text-lg md:text-xl my-2">
            {title}
          </ThemedText>
          <ThemedText className="font-oregular text-sm md:text-base text-gray-600 text-center">
            {message}
          </ThemedText>

          {confirmText === "  Keluar  " || confirmText === "Lengkapi" ? (
            <></>
          ) : (
            <ThemedText className="font-oregular text-sm md:text-base text-gray-600">
              Aksi ini tidak dapat dikembalikan
            </ThemedText>
          )}
        </View>
      }
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText={cancelText}
      cancelButtonTextStyle={{
        color: "#181D27",
        fontFamily: "Outfit-Regular",
        paddingHorizontal: 25,
        paddingVertical: 10,
      }}
      cancelButtonStyle={{ backgroundColor: "#F0F0F0", borderRadius: 10 }}
      confirmText={confirmText}
      confirmButtonTextStyle={{
        fontFamily: "Outfit-Regular",
        paddingHorizontal: 25,
        paddingVertical: 10,
      }}
      confirmButtonStyle={{
        backgroundColor: "#f87171",
        borderRadius: 10,
      }}
      onCancelPressed={() => setShowAlert(false)}
      onConfirmPressed={() => onConfirm()}
    />
  );
};

export default ModalConfirmation;
