import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { View, Image } from "react-native";
import { ThemedText } from "../ThemedText";

type Props = {};

const LoadingView = (props: Props) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          return 99;
        }
        return prev + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const dotStates = ["...", "", ".", "..", "..."];
    let index = 0;
    const dotInterval = setInterval(() => {
      index = (index + 1) % dotStates.length;
      setDots(dotStates[index]);
    }, 300);
    return () => clearInterval(dotInterval);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        className="w-56 h-48 object-cover mt-3"
        source={require("@/assets/images/loadinganimation.gif")}
      />
      {/* Loading Bar */}
      <View className="flex my-5 flex-row space-x-2 w-3/4 justify-center items-center">
        <View className="w-3/4 h-2 bg-gray-200 rounded-full ">
          <View
            style={{
              width: `${progress}%`,
            }}
            className="h-full rounded-full bg-custom-1"
          />
        </View>
        {/* Progress Text */}
        <ThemedText className="font-oregular text-custom-1">
          {progress}%
        </ThemedText>
      </View>
      <ThemedText className="font-osemibold text-center text-2xl text-custom-1">
        Mohon Tunggu{dots}
      </ThemedText>
      <ThemedText className="mx-5 mt-2 font-oregular text-center text-base">
        Bersiaplah, konten Anda sedang diproses Kami sedang mempersiapkan yang
        terbaik untuk Anda!
      </ThemedText>
    </View>
  );
};

export default LoadingView;
