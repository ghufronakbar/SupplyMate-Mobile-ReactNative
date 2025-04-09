import {
  View,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { showPickerOptions } from "@/utils/pickImage";
import * as ImageManipulator from "expo-image-manipulator";
import compressImage from "@/utils/compressImage";
import api from "@/config/api";
import { Api } from "@/models/Response";
import { UploadImage } from "@/models/UploadImage";
import { toastError, toastLoading } from "@/helper/toast";
import { C } from "@/constants/Colors";

export interface PropsSelectImage {
  image?: string | null;
  onChangeImage?: (image: string | null) => void;
  className?: string;
}

const useImage = (
  onChangeImage?: (image: string | null) => void,
  image?: string | null
) => {
  const [loading, setLoading] = useState(false);

  const onImageSelected = async (
    image: ImagePicker.ImagePickerAsset | null
  ) => {
    if (image) {
      try {
        const compress = await compressImage(image.uri);
        const formData = new FormData();
        formData.append("image", {
          name: image?.fileName || "image.jpg",
          type: "image/jpg",
          uri: compress?.uri,
        } as any);
        setLoading(true);
        const res = await api.post<Api<UploadImage>>("/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        onChangeImage?.(res.data.data.path);
      } catch (error) {
        console.log(error);
        toastError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return { onImageSelected, loading };
};
const SelectImage = ({ image, className, onChangeImage }: PropsSelectImage) => {
  const { onImageSelected, loading } = useImage(onChangeImage, image);
  return (
    <View className={`flex-col ${className} mt-1`}>
      <TouchableOpacity
        onPress={() => {
          !loading &&
            showPickerOptions(
              { setImg: onChangeImage, onImageSelected },
              { camera: true, gallery: true }
            );
        }}
        className={`border rounded-xl ${" border-gray-400 "} w-full h-48 mb-5 flex flex-col items-center justify-center overflow-hidden`}
      >
        {loading ? (
          <ActivityIndicator size="large" color={C[1]} />
        ) : image ? (
          <Image source={{ uri: image }} className="w-full h-full rounded-xl" />
        ) : (
          <PickAnImage />
        )}
      </TouchableOpacity>
    </View>
  );
};

const PickAnImage = () => {
  return (
    <>
      <MaterialCommunityIcons
        style={{ fontSize: 42, color: "#A5A5A5", alignSelf: "center" }}
        name="image-multiple-outline"
      />

      <ThemedText className="text-gray-500 font-oregular text-xs md:text-sm text-center px-4 mt-5">
        Unggah gambar dengan ukuran maksimum 5MB {"\n"}dalam format PNG atau
        JPEG
      </ThemedText>
    </>
  );
};

export default SelectImage;
