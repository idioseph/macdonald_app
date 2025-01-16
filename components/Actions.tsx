import { Pressable, View } from "react-native";
import { Text } from "react-native";
import { ArrowIcon, CupIcon } from "./Icons";
import SwipeButton from "./SwipeButton";
import {
  ComposedGesture,
  GestureDetector,
  GestureType,
} from "react-native-gesture-handler";
import { useAssets } from "expo-asset";
import {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";

interface ActionProps {
  addPressedGesture: ComposedGesture | GestureType;
  active: SharedValue<number>;
}

const Actions = ({ addPressedGesture, active }: ActionProps) => {
  const [icons, iconsError] = useAssets([require("@/assets/icons/add.png")]);

  const rContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(active.value, [0, 1], [0, 150]);
    const opacity = interpolate(active.value, [0, 1], [1, 0]);

    return {
      transform: [{ translateY: translateY }],
      opacity: opacity,
    };
  });

  const rButtonContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(active.value, [0, 1], [0, 150]);
    const opacity = interpolate(active.value, [0, 1], [1, 0]);

    return {
      transform: [{ translateY: translateY }],
      opacity: opacity,
    };
  });

  return (
    <View className="absolute bottom-3 left-3 right-3 z-[999]">
      <Animated.View
        style={[rContainerStyle]}
        className="flex flex-row justify-between px-5"
      >
        <View className="flex active:opacity-50 flex-col items-center justify-center">
          <View className="flex flex-col items-center justify-center h-12 w-12 border border-[#3A2522]/35 rounded-full">
            <CupIcon width={20} height={20} color="black" />
          </View>
          <Text className="text-lg font-[Inter]">Small</Text>
        </View>
        <View className="flex active:opacity-50 flex-col items-center justify-center">
          <View className="flex flex-col items-center justify-center h-12 w-12 border border-[#3A2522]/35 rounded-full">
            <CupIcon width={24} height={24} color="black" />
          </View>
          <Text className="text-lg font-[Inter]">Medium</Text>
        </View>
        <View className="flex active:opacity-50 flex-col items-center justify-center">
          <View className="flex items-center justify-center h-12 w-12 border border-[#3A2522]/35 rounded-full">
            <CupIcon width={30} height={30} color="black" />
          </View>
          <Text className="text-lg font-[Inter]">Large</Text>
        </View>
        <Pressable
          className="flex active:opacity-50 flex-col items-center justify-center"
          onPress={() => {
            active.value = withTiming(1, { duration: 500 });
          }}
        >
          <View className="flex flex-col items-center justify-center h-12 w-12 border border-[#3A2522]/35 rounded-full">
            <ArrowIcon width={24} height={24} />
          </View>
          <Text className="text-lg font-[Inter]">More</Text>
        </Pressable>
      </Animated.View>
      <View className="flex flex-row items-center justify-between px-5">
        <Animated.View style={[rButtonContainerStyle]}>
          <SwipeButton />
        </Animated.View>
        <GestureDetector gesture={addPressedGesture}>
          <Animated.Image
            source={{ uri: icons?.[0]?.uri }}
            resizeMode="contain"
            className="w-24 h-24"
          />
        </GestureDetector>
      </View>
    </View>
  );
};

export default Actions;
