import { DEFAULT_IMAGE, DEFAULT_PROFILE } from "@/assets";
import { Image, type ImageProps } from "react-native";
import { forwardRef } from "react";

interface Props extends Omit<ImageProps, "source"> {
  uri?: string | null;
  type?: "default" | "profile";
}

export const Img = forwardRef<Image, Props>((props, forwardedRef) => {
  const { uri, type, ...rest } = props;
  return (
    <Image
      ref={forwardedRef}
      source={
        uri
          ? { uri: uri }
          : type === "profile"
          ? DEFAULT_PROFILE
          : DEFAULT_IMAGE
      }
      {...rest}
    />
  );
});
