import { C } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

interface Props {
  onPress?: () => void;
}

export const FloatingAddButton: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress?.()}
      className="absolute bottom-28 right-6 z-10"
      style={{
        backgroundColor: C[1],
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        padding: 10,
      }}
    >
      <Ionicons name="add" size={40} color="white" />
    </TouchableOpacity>
  );
};
