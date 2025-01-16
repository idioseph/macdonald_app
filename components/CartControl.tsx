import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { storage } from "@/utils/storage";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { Dimensions } from "react-native";
import { GestureDetector, GestureType } from "react-native-gesture-handler";

const windowWidth = Dimensions.get("window").width;
const BUTTON_WIDTH = windowWidth * 0.4;
const BUTTON_HEIGHT = 55;

interface CartControlProps {
  item?: {
    id: number;
    image: string;
    title: string;
    subTitle: string;
    price: number;
  };
  size: "sm" | "md" | "lg";
  temperature: "hot" | "iced";
  itemDetailActive: SharedValue<number>;
  addPressed: () => void;
  removePressed: () => void;
}

const CartControl = ({
  item,
  size,
  temperature,
  itemDetailActive,
  addPressed,
  removePressed,
}: CartControlProps) => {
  const [itemQuantity, setItemQuantity] = useState(0);

  const isDetailView = useDerivedValue(() => {
    return itemDetailActive.value === 0;
  });

  const checkQuantity = async () => {
    if (!item) return;
    const cartItem = { ...item, size, temperature };
    const quantity = await storage.getItemQuantity(cartItem);
    setItemQuantity(quantity);
  };

  useEffect(() => {
    if (!item) return;
    const interval = setInterval(checkQuantity, 1000);
    return () => clearInterval(interval);
  }, [item?.id, size, temperature]);

  const handlePress = async (action: "add" | "remove") => {
    if (!item) return;
    const cartItem = { ...item, size, temperature };
    if (action === "add") {
      addPressed();
      await storage.addToCart(cartItem);
    } else {
      removePressed();
      await storage.removeOneFromCart(cartItem);
    }
    checkQuantity();
  };

  const rAddButtonStyle = useAnimatedStyle(() => {
    const shouldShow =
      !isDetailView.value || (isDetailView.value && itemQuantity === 0);
    return {
      opacity: withSpring(shouldShow ? 1 : 0),
      transform: [{ scale: withSpring(shouldShow ? 1 : 0.8) }],
      display: shouldShow ? "flex" : "none",
    };
  });

  const rControlStyle = useAnimatedStyle(() => {
    const shouldShow = isDetailView.value && itemQuantity > 0;
    return {
      opacity: withSpring(shouldShow ? 1 : 0),
      transform: [{ scale: withSpring(shouldShow ? 1 : 0.8) }],
      display: shouldShow ? "flex" : "none",
    };
  });

  return (
    <>
      {/* <GestureDetector gesture={addGesture}> */}
      <Animated.View style={[styles.addButton, rAddButtonStyle]}>
        <TouchableOpacity
          style={styles.addButtonInner}
          onPress={() => handlePress("add")}
        >
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
      {/* </GestureDetector> */}

      <Animated.View style={[styles.controlContainer, rControlStyle]}>
        <View style={styles.control}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePress("remove")}
          >
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{itemQuantity}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePress("add")}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: BUTTON_HEIGHT,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT / 2,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#000",
  },
  controlContainer: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
  },
  control: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F1F1F1",
    borderRadius: BUTTON_HEIGHT / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  button: {
    width: BUTTON_HEIGHT - 4,
    height: BUTTON_HEIGHT - 4,
    backgroundColor: "white",
    borderRadius: (BUTTON_HEIGHT - 4) / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#000",
  },
  quantityText: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#000",
  },
});

export default CartControl;
