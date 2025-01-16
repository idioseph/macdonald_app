import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useAssets } from "expo-asset";
import { useNavigation } from "@react-navigation/native";
import { MainScreenProps } from "@/interface/Layout";

const menuItems = [
  {
    id: 1,
    image: require("@/assets/images/items/milkshake.png"),
    title: "Milkshake",
    slug: "milkshake",
    description: "20 Cups of different flavours",
  },
  {
    id: 2,
    image: require("@/assets/images/items/burger.png"),
    title: "Chicken Burger",
    slug: "chicken-burger",
    description: "20 sets of different flavours",
  },
  {
    id: 3,
    image: require("@/assets/images/items/choco.png"),
    title: "Chocolate Drinks",
    slug: "chocolate-drinks",
    description: "20 Cups of different flavours",
  },
  {
    id: 4,
    image: require("@/assets/images/items/coffe.png"),
    title: "Coffee",
    slug: "coffee",
    description: "20 sets of different flavours",
  },
  {
    id: 5,
    image: require("@/assets/images/items/icecream.png"),
    title: "Ice Cream",
    slug: "ice-cream",
    description: "20 sets of different flavours",
  },
];

interface MenuItem {
  id: number;
  image: any;
  title: string;
  description: string;
  slug: string;
}

const MenuItem = ({ item, index }: { item: MenuItem; index: number }) => {
  const [isPressed, setIsPressed] = useState(false);
  const translateY = useSharedValue(500);
  const navigation = useNavigation<MainScreenProps["navigation"]>();

  useEffect(() => {
    translateY.value = withDelay(
      index * 200,
      withTiming(0, { duration: 1000 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View className="min-h-max" style={animatedStyle}>
      <View className="h-[calc(185px-132px)] bg-transparent" />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ItemScreen", {
            item,
          });
        }}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        className={`
          mb-4 bg-white rounded-[20px]
          ${isPressed ? "opacity-90" : "opacity-100"}
        `}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <View className="flex-row relative p-4 h-[143px] justify-between items-center">
          <View className="max-h-[185px] min-h-[185px] bottom-5 left-5 absolute">
            <Image
              source={item.image}
              className="max-h-[185px] max-w-[121px]"
              resizeMode="contain"
            />
          </View>
          <View className="h-28 w-32" />
          <View className="flex-1 ml-4">
            <Text className="text-[20px] font-semibold">{item.title}</Text>
            <Text className="text-gray-500 text-[14px] mt-1">
              {item.description}
            </Text>
          </View>
          <View className="absolute right-4 bottom-4">
            <Image
              source={require("@/assets/icons/arrow-right.png")}
              className="w-[20px] h-[20px]"
              resizeMode="contain"
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HomeScreen = () => {
  const [assets] = useAssets([
    require("@/assets/images/items/milkshake.png"),
    require("@/assets/images/items/burger.png"),
    require("@/assets/images/items/choco.png"),
    require("@/assets/images/items/coffe.png"),
    require("@/assets/images/items/icecream.png"),
    require("@/assets/icons/arrow-right.png"),
  ]);

  if (!assets) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 25 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} item={item} index={index} />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
