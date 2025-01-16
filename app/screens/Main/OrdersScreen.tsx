import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import { storage } from '@/utils/storage';
import type { CartItem } from '@/utils/storage';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const THRESHOLD = -WINDOW_WIDTH * 0.3;

const OrderItem = ({ item, onRemove, index }: { 
  item: CartItem; 
  onRemove: () => void;
  index: number;
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(50);
  const itemHeight = useSharedValue(100);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      index * 100,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .simultaneousWithExternalGesture(Gesture.Native())
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (translateX.value < THRESHOLD) {
        translateX.value = withTiming(-WINDOW_WIDTH);
        itemHeight.value = withTiming(0);
        opacity.value = withTiming(0, undefined, (finished) => {
          if (finished) {
            runOnJS(onRemove)();
          }
        });
      } else {
        translateX.value = withSpring(0, {
          velocity: 20,
          damping: 12,
        });
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ],
  }));

  const rContainerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    opacity: opacity.value,
    marginBottom: withSpring(itemHeight.value === 0 ? 0 : 8),
  }));

  return (
    <Animated.View 
      style={[rContainerStyle]} 
      className="relative mb-4 active:opacity-0"
    >
      <View className="absolute right-0 h-full justify-center pr-5 z-0">
        <Text className="text-red-500 font-[Inter] font-medium">Delete</Text>
      </View>
      
      <GestureDetector gesture={gesture}>
        <Animated.View 
          style={[
            {
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
              backgroundColor: 'white',
              borderRadius: 16,
            },
            rStyle
          ]} 
          className="p-4 flex-row items-center h-[100px] z-10"
        >
          <Image
            source={{ uri: item.image }}
            className="w-[80px] h-[80px] rounded-xl"
            resizeMode="contain"
          />
          <View className="flex-1 ml-4">
            <Text className="text-base font-[Inter] font-medium">{item.title}</Text>
            <Text className="text-xs text-[#666] mt-1 font-[Inter]">
              {item.size?.toUpperCase()} • {item.temperature?.toUpperCase()}
            </Text>
            <Text className="text-xs text-[#666] font-[Inter]">
              Qty: {item.quantity}
            </Text>
          </View>
          <Text className="text-base font-[Inter] font-medium">
            £{(item.price * item.quantity).toFixed(2)}
          </Text>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const OrdersScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const loadCartItems = async () => {
    const items = await storage.getCartItems();
    const cartTotal = await storage.getCartTotal();
    setCartItems(items);
    setTotal(cartTotal);
  };

  useEffect(() => {
    loadCartItems();
    const interval = setInterval(loadCartItems, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRemoveItem = async (item: CartItem) => {
    await storage.removeItemFromCart(item);
    loadCartItems();
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-[Inter] font-semibold mb-5">Your Orders</Text>
      </View>

      <View className="bg-white px-4 py-4 border-t border-[#F1F1F1]">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-[Inter] font-medium">Total:</Text>
          <Text className="text-lg font-[Inter] font-semibold">
            £{total.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <Animated.ScrollView 
        className="flex-1 px-4 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {cartItems.map((item, index) => (
          <OrderItem
            key={`${item.id}-${item.size}-${item.temperature}`}
            item={item}
            index={index}
            onRemove={() => handleRemoveItem(item)}
          />
        ))}
      </Animated.ScrollView>

      <View className="bg-white px-4 py-4 border-t border-[#F1F1F1]">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-[Inter] font-medium">Total:</Text>
          <Text className="text-lg font-[Inter] font-semibold">
            £{total.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrdersScreen;
