import { View, Dimensions, TouchableOpacity } from "react-native";
import {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { RefObject } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const WindowWidth = Dimensions.get("window").width;
export const ImageItemWidth = WindowWidth * 0.8;
export const ImageItemHeight = (ImageItemWidth / 3) * 4;

interface ProductItem {
  id: number;
  image: string;
  title: string;
  subTitle: string;
  price: number;
}

interface ImageListItemProps {
  item: ProductItem;
  index: number;
  scrollOffset: SharedValue<number>;
  addButtonClicked: SharedValue<number>;
  activeImageIndex: SharedValue<number>;
  itemDetailActive: SharedValue<number>;
  onPress: () => void;
  activeImageScale: SharedValue<number>;
}

const ImageListItem = ({
  item,
  index,
  scrollOffset,
  addButtonClicked,
  activeImageIndex,
  itemDetailActive,
  onPress,
  activeImageScale,
}: ImageListItemProps) => {
  const gesture = Gesture.Tap().onStart(() => {
    runOnJS(onPress)();
  });

  const rContainerStyle = useAnimatedStyle(() => {
    const paddingLeft = (WindowWidth - ImageItemWidth) / 4;
    const activeIndex = scrollOffset.value / ImageItemWidth;
    const itemDetailActiveValue = itemDetailActive.value;
    const activeImageScaleValue = activeImageScale.value;

    const translateX = interpolate(
      activeIndex,
      [index - 2, index - 1, index, index + 1],
      [260, 145, 0, -ImageItemWidth - paddingLeft],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      activeIndex,
      [index - 2, index - 1, index, index + 1],
      [-160, -120, 0, ImageItemHeight],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      activeIndex,
      [index - 4, index - 3, index - 2, index - 1, index, index + 1],
      [0.05, 0.15, 0.3, 0.7, 1.1 * activeImageScaleValue, -0.5],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      activeIndex,
      [index - 3, index - 2, index - 1, index, index + 1],
      [0, 1 * itemDetailActiveValue, 1 * itemDetailActiveValue, 1, 0.2],
      Extrapolation.CLAMP
    );

    const left = interpolate(
      itemDetailActiveValue,
      [1, 0],
      [paddingLeft, (paddingLeft * 1.5)],
      Extrapolation.CLAMP
    );

    const left2 = interpolate(
      activeImageScaleValue,
      [1, 0.6],
      [1, 3.5],
      Extrapolation.CLAMP
    );

    const bottom = interpolate(
      itemDetailActiveValue,
      [1, 0],
      [0, WindowWidth * 0.15],
      Extrapolation.CLAMP
    );

    return {
      left: left * left2,
      bottom: bottom,
      transform: [
        {
          translateX: scrollOffset.value + translateX,
        },
        { translateY: translateY },
        { scale: scale },
      ],
      opacity: opacity,
    };
  });

  const rGestureStyle = useAnimatedStyle(() => {
    const display = activeImageIndex.value === index ? true : false;
    const translateY = interpolate(
      addButtonClicked.value,
      [0, 0.5, 1],
      [0, -ImageItemHeight * 0.4, -ImageItemHeight * 0.9]
      //   Extrapolation.CLAMP
    );

    const scale = interpolate(
      addButtonClicked.value,
      [0, 0.5, 1],
      [1, 0.5, 0.1]
      //   Extrapolation.CLAMP
    );

    const translateX = interpolate(
      addButtonClicked.value,
      [0, 1],
      [0, ImageItemWidth * 0.5]
      //   Extrapolation.CLAMP
    );

    const opacity = interpolate(
      addButtonClicked.value,
      [0, 0.5, 1],
      [0, 1, 0]
      //   Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateY: translateY },
        { translateX: translateX },
        { scale: scale },
      ],
      opacity: display ? opacity : 0,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            zIndex: -index,
            // backgroundColor: "red",
            // transform: [{ translateX: index * 80 }, { translateY: -(index * 100) }],
          },
          rContainerStyle,
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={{
            width: ImageItemWidth,
            height: ImageItemHeight,
            position: "absolute",
          }}
          contentFit="contain"
        />
        <Animated.Image
          source={{ uri: item.image }}
          style={[
            {
              width: ImageItemWidth,
              height: ImageItemHeight,
              position: "absolute",
            },
            rGestureStyle,
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default ImageListItem;
