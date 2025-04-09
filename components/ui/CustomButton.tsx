import { ActivityIndicator, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";

interface Props {
  onPress?: () => void;
  loading?: boolean;
  cn?: string;
  cnText?: string;
  text?: string;
  colorActivityIndicator?: string;
}

export const CustomButton = (props: Props) => {
  const { onPress, loading, cn, text, cnText, colorActivityIndicator } = props;
  return (
    <TouchableOpacity
      className={`bg-custom-1 px-2 py-2 rounded-lg flex items-center justify-center h-10 space-x-2 ${cn}
        `}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={colorActivityIndicator || "white"}
        />
      ) : (
        <ThemedText className={`text-sm text-white text-center ${cnText}`}>
          {text}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};
