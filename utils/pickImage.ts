import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { requestPermissions } from "./permission";

export const compressImage = async (uri: string) => {
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipResult;
};

export interface PropsSelectImage {
  setImg?: (uri: string) => void;
  onImageSelected?: (image: ImagePicker.ImagePickerAsset | null) => void;
  directlyCallback?: (image: ImagePicker.ImagePickerAsset) => void;
}

export const pickImageFromGallery = async ({
  setImg,
  onImageSelected,
  directlyCallback,
}: PropsSelectImage) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const imageAsset = result.assets[0];

    if (directlyCallback) {
      const compressedImage = await compressImage(imageAsset.uri);
      directlyCallback({ ...imageAsset, uri: compressedImage.uri });
      return;
    }

    const compressedImage = await compressImage(imageAsset.uri);

    setImg?.(compressedImage.uri);
    onImageSelected?.({
      ...imageAsset,
      uri: compressedImage.uri,
    });
  }
};

export const pickImageFromCamera = async ({
  setImg,
  onImageSelected,
  directlyCallback,
}: PropsSelectImage) => {
  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const imageAsset = result.assets[0];

    if (directlyCallback) {
      const compressedImage = await compressImage(imageAsset.uri);
      directlyCallback({ ...imageAsset, uri: compressedImage.uri });
      return;
    }

    const compressedImage = await compressImage(imageAsset.uri);

    setImg?.(compressedImage.uri);
    onImageSelected?.({
      ...imageAsset,
      uri: compressedImage.uri,
    });
  }
};

const deletingImage = async (callback: () => void) => {
  Alert.alert(
    "Hapus Gambar",
    "Apakah Anda yakin ingin menghapus gambar ini?",
    [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Hapus",
        onPress: callback,
      },
    ],
    { cancelable: true }
  );
};

interface Option {
  gallery?: boolean;
  camera?: boolean;
  deleteImage?: boolean;
  callbackDeleteImage?: () => void;
}

export const showPickerOptions = (
  { setImg, onImageSelected, directlyCallback }: PropsSelectImage,
  {
    gallery = false,
    camera = false,
    deleteImage = false,
    callbackDeleteImage,
  }: Option
) => {
  requestPermissions();

  const options: Array<{
    text: string;
    style?: "cancel" | "default" | "destructive";
    onPress?: () => void;
  }> = [];

  if (camera) {
    options.push({
      text: "Kamera",
      onPress: () =>
        pickImageFromCamera({ setImg, onImageSelected, directlyCallback }),
    });
  }

  if (gallery) {
    options.push({
      text: "Galeri",
      onPress: () =>
        pickImageFromGallery({ setImg, onImageSelected, directlyCallback }),
    });
  }

  if (deleteImage) {
    options.push({
      text: "Hapus",
      onPress: () => deletingImage(() => callbackDeleteImage?.()),
    });
  }

  options.push({
    text: "Batal",
    style: "cancel",
  });

  Alert.alert("Pilih Gambar", "Pilih opsi untuk melanjutkan", options, {
    cancelable: true,
  });
};
