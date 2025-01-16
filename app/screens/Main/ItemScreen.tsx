import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ItemScreenProps } from "@/interface/Layout";
import { useAssets } from "expo-asset";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useScrollViewOffset,
  scrollTo,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import ImageListItem, { ImageItemWidth } from "@/components/ImageListItem";
import { Directions, Gesture } from "react-native-gesture-handler";
import { GestureDetector } from "react-native-gesture-handler";
import { ArrowIcon, BurgerIcon, CupIcon } from "@/components/Icons";
import SwipeButton from "@/components/SwipeButton";
import { storage } from "@/utils/storage";
import CartControl from "@/components/CartControl";
import products from "@/data/products";
import { icons } from "@/data/products";
import { ProductVariant } from "@/data/products";

interface ProductItem {
  id: number;
  image: string;
  title: string;
  subTitle: string;
  price: number;
}

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");
const imageItemPadding = (windowWidth - ImageItemWidth) / 4;

const ItemScreen = ({ route }: ItemScreenProps) => {
  const [items, setItems] = useState<ProductItem[]>([]);
  const { item } = route.params;
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const animatedRefPrice = useAnimatedRef<Animated.ScrollView>();
  const animatedRefText = useAnimatedRef<Animated.ScrollView>();
  const buttonClicked = useSharedValue<number>(0);
  const scrollOffset = useScrollViewOffset(
    animatedRef.current ? animatedRef : null
  );
  const activeImageIndex = useSharedValue<number>(0);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const itemDetailActive = useSharedValue<number>(1);
  const activeImageScale = useSharedValue<number>(1);
  const [activeImageSize, setActiveImageSize] = useState<"sm" | "md" | "lg">(
    "lg"
  );
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);
  const [toggled, setToggled] = useState<boolean>(false);

  const hanldeImagePress = () => {
    itemDetailActive.value = withTiming(0, { duration: 500 });
    setScrollEnabled(false);
  };

  const handleMorePress = () => {
    setScrollEnabled(true);
    setActiveImageSize("lg");
    activeImageScale.value = withTiming(1, { duration: 500 });
    itemDetailActive.value = withTiming(1, { duration: 500 });
  };

  const handleToggle = (toggled: boolean) => {
    setToggled(toggled);
  };

  const handleAddToCart = async () => {
    const cartItem = {
      ...items[currentItemIndex],
      size: activeImageSize,
      temperature: (toggled ? "iced" : "hot") as "iced" | "hot",
    };

    try {
      await storage.addToCart(cartItem);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const swipeUpDownGesture = Gesture.Fling()
    .direction(Directions.UP | Directions.DOWN)
    .onEnd(() => {
      if (itemDetailActive.value === 1) {
        itemDetailActive.value = withTiming(0, { duration: 500 });
        runOnJS(setScrollEnabled)(false);
      } else {
        itemDetailActive.value = withTiming(1, { duration: 500 });
        activeImageScale.value = withTiming(1, { duration: 500 });
        runOnJS(setScrollEnabled)(true);
        runOnJS(setActiveImageSize)("lg");
      }
    });

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        const activeIndex = event.contentOffset.x / ImageItemWidth;
        activeImageIndex.value = Math.round(activeIndex);
        runOnJS(setCurrentItemIndex)(Math.round(activeIndex));
        scrollTo(animatedRefText, activeIndex * 300, 0, false);
        scrollTo(animatedRefPrice, 0, activeIndex * 32, false);
      },
    },
    []
  );

  const handleAddPressed = () => {
    if (buttonClicked.value === 1) {
      buttonClicked.value = 0;
    }
    buttonClicked.value = withTiming(1, { duration: 500 });
    runOnJS(handleAddToCart)();
  };

  const handleRemovePressed = () => {
    if (buttonClicked.value === 0) {
      buttonClicked.value = 1;
    }
    buttonClicked.value = withTiming(0, { duration: 500 });
  };

  const rContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(itemDetailActive.value, [0, 1], [0, 150]);
    const opacity = interpolate(itemDetailActive.value, [0, 1], [1, 0]);

    return {
      transform: [{ translateY: translateY }],
      opacity: opacity,
    };
  });

  const rButtonContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(itemDetailActive.value, [0, 1], [0, 150]);
    const opacity = interpolate(itemDetailActive.value, [0, 1], [1, 0]);

    return {
      transform: [{ translateY: translateY }],
      opacity: opacity,
    };
  });

  if (!item.slug) {
    return null;
  }

  const [assets] = useAssets(
    products[item.slug as keyof typeof products]?.assets || []
  );

  useEffect(() => {
    if (assets) {
      const variants = products[
        item.slug as keyof typeof products
      ]?.variants.map((variant: ProductVariant, index: number) => ({
        ...variant,
        image: assets[index]?.uri || "",
      }));
      setItems(variants || []);
    }
  }, [assets]);

  if (!assets?.length) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-center text-2xl">
          No available product for {item.title}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <View className="flex-1">
        <View className="px-5 py-4">
          <View className="flex flex-row gap-5 justify-between items-center">
            <Animated.ScrollView
              scrollEnabled={true}
              horizontal
              ref={animatedRefText}
              showsHorizontalScrollIndicator={false}
              className="h-12 android:h-14"
            >
              {items.map((item, index) => (
                <View
                  key={index}
                  className={`flex flex-col items-start w-[300px] px-5`}
                >
                  <Text
                    className="text-3xl font-bold"
                    style={{ fontFamily: "Inter" }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{ fontFamily: "Inter" }}
                    className="text-sm text-gray-500"
                  >
                    {item.subTitle}
                  </Text>
                </View>
              ))}
            </Animated.ScrollView>
            <Animated.ScrollView
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ref={animatedRefPrice}
              className="h-12 w-28 py-2 android:h-10 min-w-max"
            >
              {items.map((item, index) => (
                <View
                  key={index}
                  className="flex flex-row items-center justify-start"
                >
                  <Text
                    className="text-3xl font-semibold"
                    style={{ height: 32, fontFamily: "Inter" }}
                  >
                    £{item.price.toString().split(".")[0]}.
                    <Text
                      className="text-xl font-light "
                      style={{ height: 32 }}
                    >
                      {item.price.toString().split(".")[1]}
                    </Text>
                  </Text>
                </View>
              ))}
            </Animated.ScrollView>
          </View>
        </View>
      </View>
      <GestureDetector gesture={swipeUpDownGesture}>
        <Animated.ScrollView
          ref={animatedRef}
          horizontal
          className="pt-48 pb-72 inset-0 absolute z-[999] bg-transparent"
          snapToInterval={ImageItemWidth}
          decelerationRate="fast"
          disableIntervalMomentum
          showsHorizontalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{
            width: ImageItemWidth * items.length + imageItemPadding * 3,
          }}
        >
          {items.map((item, index) => (
            <ImageListItem
              key={index}
              scrollOffset={scrollOffset}
              index={index}
              activeImageIndex={activeImageIndex}
              item={item}
              addButtonClicked={buttonClicked}
              itemDetailActive={itemDetailActive}
              onPress={hanldeImagePress}
              activeImageScale={activeImageScale}
            />
          ))}
        </Animated.ScrollView>
      </GestureDetector>
      <View className="absolute bottom-3 left-3 right-3 z-[999] py-5 flex flex-col gap-5">
        <Animated.View
          style={[rContainerStyle]}
          className="flex flex-row justify-between px-5"
        >
          <Pressable
            className="flex active:opacity-50 flex-col items-center justify-center"
            onPress={() => {
              activeImageScale.value = withTiming(0.6, { duration: 500 });
              setActiveImageSize("sm");
            }}
          >
            <View
              className={`flex flex-col items-center justify-center h-12 w-12 border border-[#3A2522]/35 rounded-full ${
                activeImageSize == "sm" && "bg-[#FEB30A] border-[#FFD600]/35"
              }`}
            >
              {item.slug == "milkshake" ? (
                <CupIcon
                  width={20}
                  height={20}
                  color={activeImageSize == "sm" ? "white" : "black"}
                />
              ) : (
                <BurgerIcon
                  width={20}
                  height={20}
                  color={activeImageSize == "sm" ? "white" : "black"}
                />
              )}
            </View>
            <Text className="text-lg font-[Inter]">Small</Text>
          </Pressable>
          <Pressable
            className="flex active:opacity-50 flex-col items-center justify-center"
            onPress={() => {
              activeImageScale.value = withTiming(0.8, { duration: 500 });
              setActiveImageSize("md");
            }}
          >
            <View
              className={`flex flex-col items-center justify-center h-12 w-12 border border-[#3A2522]/35 rounded-full ${
                activeImageSize == "md" && "bg-[#FEB30A] border-[#FFD600]/35"
              }`}
            >
              {item.slug == "milkshake" ? (
                <CupIcon
                  width={24}
                  height={24}
                  color={activeImageSize == "md" ? "white" : "black"}
                />
              ) : (
                <BurgerIcon
                  width={24}
                  height={24}
                  color={activeImageSize == "md" ? "white" : "black"}
                />
              )}
            </View>
            <Text className="text-lg font-[Inter]">Medium</Text>
          </Pressable>
          <Pressable
            className="flex active:opacity-50 flex-col items-center justify-center"
            onPress={() => {
              activeImageScale.value = withTiming(1, { duration: 500 });
              setActiveImageSize("lg");
            }}
          >
            <View
              className={`flex items-center justify-center h-12 w-12 border border-[#3A2522]/35 rounded-full ${
                activeImageSize == "lg" && "bg-[#FEB30A] border-[#FFD600]/35"
              }`}
            >
              {item.slug == "milkshake" ? (
                <CupIcon
                  width={30}
                  height={30}
                  color={activeImageSize == "lg" ? "white" : "black"}
                />
              ) : (
                <BurgerIcon
                  width={30}
                  height={30}
                  color={activeImageSize == "lg" ? "white" : "black"}
                />
              )}
            </View>
            <Text className="text-lg font-[Inter]">Large</Text>
          </Pressable>
          <Pressable
            className="flex active:opacity-50 flex-col items-center justify-center"
            onPress={handleMorePress}
          >
            <View className="flex flex-col items-center justify-center h-12 w-12 border border-[#3A2522]/35 rounded-full">
              <ArrowIcon width={24} height={24} />
            </View>
            <Text className="text-lg font-[Inter]">More</Text>
          </Pressable>
        </Animated.View>
        <View className="flex flex-row items-center px-5 justify-between gap-3">
          <Animated.View style={[rButtonContainerStyle]}>
            <SwipeButton onToggle={handleToggle} />
          </Animated.View>
          <CartControl
            item={items[currentItemIndex]}
            size={activeImageSize}
            temperature={(toggled ? "iced" : "hot") as "iced" | "hot"}
            itemDetailActive={itemDetailActive}
            addPressed={handleAddPressed}
            removePressed={handleRemovePressed}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ItemScreen;
