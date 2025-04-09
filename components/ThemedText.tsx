import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { C } from "@/constants/Colors";
export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "sectionTitle"
    | "label";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "sectionTitle" ? styles.sectionTitle : undefined,
        type === "label" ? styles.label : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    color: "#757575",
    fontFamily: "Outfit-Regular",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Outfit-SemiBold",
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: "Outfit-Bold",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Outfit-SemiBold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: C[1],
    fontFamily: "Outfit-Regular",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Outfit-SemiBold",
  },
  label: {
    fontSize: 16,
    fontFamily: "Outfit-Bold",
    color: "#404040",
  },
});
