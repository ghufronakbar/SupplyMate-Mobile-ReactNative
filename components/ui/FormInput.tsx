import React, { useContext, useState, forwardRef, useEffect } from "react";
import {
  KeyboardTypeOptions,
  StyleProp,
  Text,
  TextStyle,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

import { Colors } from "@/constants/Colors";

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  rows?: number;
  isHalf?: boolean;
  editable?: boolean;
  isInsideCard?: boolean;
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
  isError?: boolean;
  setIsError?: (isError: boolean) => void;
  setIsErrorMessage?: (message: string) => void;
  isPhoneNumber?: boolean;
  isSearch?: boolean;
  isAddMinus?: boolean;
  right?: React.ReactNode;
  left?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const FormInputComponent = (
  {
    label,
    value,
    onChangeText,
    keyboardType = "default",
    secureTextEntry = false,
    rows = 1,
    isHalf,
    editable = true,
    returnKeyType = "done",
    onSubmitEditing,
    isError = false,
    isAddMinus = false,
    isInsideCard = false,
    isPhoneNumber = false,
    isSearch = false,
    left,
    right,
    style,
    ...rest
  }: Props,
  ref: React.Ref<any>
) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <TextInput
      ref={ref}
      className={isHalf ? "w-[48%]" : "w-full"}
      label={
        isAddMinus ? (
          <></>
        ) : (
          <Text
            style={{
              fontFamily: "Outfit-Regular",
              color: isError ? "red" : undefined,
            }}
          >
            {label}
          </Text>
        )
      }
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      mode="outlined"
      secureTextEntry={isPasswordVisible}
      multiline={rows > 1}
      numberOfLines={rows}
      editable={editable}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      outlineColor={isError ? "red" : "gray"}
      style={[
        {
          backgroundColor: "transparent",
          fontFamily: "Outfit-Regular",
          fontSize: 16,
          marginVertical: 10,
        },
        style,
      ]}
      contentStyle={{
        textAlign: isAddMinus ? "center" : "left",
        fontFamily: "Outfit-Regular",
        color: "#181D27",
      }}
      theme={{
        colors: {
          placeholder: "#aaa",
          primary: isError ? "red" : "#23ACE3",
          background: isInsideCard
            ? "#FAFAFA"
            : isAddMinus
            ? "gray"
            : "#FFFFFF",
        },

        roundness: 10,
        fonts: {
          regular: {
            fontFamily: "Outfit-Regular",
          },
        },
      }}
      left={
        left ? (
          left
        ) : isPhoneNumber ? (
          <TextInput.Icon
            icon={() => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text className="text-md text-[#181D27]">+62</Text>
                <View className="h-6 w-0.5 bg-[#181D27] ml-2" />
              </View>
            )}
          />
        ) : isSearch ? (
          <TextInput.Icon icon={"magnify"} />
        ) : undefined
      }
      right={
        right ? (
          right
        ) : secureTextEntry ? (
          <TextInput.Icon
            icon={isPasswordVisible ? "eye-off" : "eye"}
            onPress={togglePasswordVisibility}
          />
        ) : null
      }
      {...rest}
    />
  );
};

const FormInput = forwardRef(FormInputComponent);

export default FormInput;
