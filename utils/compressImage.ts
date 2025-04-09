import * as ImageManipulator from "expo-image-manipulator";

const compressImage = async (uri: string) => {
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipResult;
};

export default compressImage;
