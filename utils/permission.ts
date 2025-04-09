import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastError } from "@/helper/toast";
import * as MediaLibrary from "expo-media-library";
import * as Camera from "expo-camera";

export const requestPermissions = async () => {
  try {
    const { status: cameraStatus } =
      await Camera.Camera.requestCameraPermissionsAsync();
    if (cameraStatus !== "granted") {
      toastError("Aplikasi memerlukan izin kamera untuk melanjutkan.");
    }

    const { status: mediaStatus } =
      await MediaLibrary.requestPermissionsAsync();
    if (mediaStatus !== "granted") {
      toastError(
        "Aplikasi memerlukan izin perpustakaan media untuk melanjutkan."
      );
    }
  } catch (error) {
    console.error("Error while requesting permissions:", error);
  }
};
