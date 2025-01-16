import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image, View, Text } from "react-native";
import { storage } from "@/utils/storage";
import { AppState } from "react-native";
import { navigate } from "@/interface/Layout";

const Cart = () => {
  const [quantity, setQuantity] = useState(0);

  const updateQuantity = async () => {
    const cartQuantity = await storage.getCartQuantity();
    setQuantity(cartQuantity);
  };

  useEffect(() => {
    updateQuantity();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        updateQuantity();
      }
    });

    const interval = setInterval(updateQuantity, 1000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={() => navigate("MainScreen", { screen: "Orders" })}
    >
      <View className="relative">
        <Image
          source={require("@/assets/icons/cart.png")}
          className="w-[36px] h-[36px]"
        />
        <View className="absolute inset-0 z-[999] items-center justify-center">
          <Text className="text-black text-xs" style={{ marginTop: 6 }}>
            {quantity}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Cart;
