import React from "react";
import { StyleSheet, View, Text, Dimensions, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";

const windowWidth = Dimensions.get('window').width;

const BUTTON_WIDTH = windowWidth * 0.45;
const BUTTON_HEIGHT = 55;
const SEGMENT_WIDTH = BUTTON_WIDTH / 2;

const SwipeButton = ({
  onToggle,
}: {
  onToggle?: (toggled: boolean) => void;
}) => {
  const X = useSharedValue(0);
  const [toggled, setToggled] = React.useState(false);

  const handlePress = (isRight: boolean) => {
    if (isRight) {
      X.value = withTiming(SEGMENT_WIDTH);
      setToggled(true);
      onToggle?.(true);
    } else {
      X.value = withTiming(0);
      setToggled(false);
      onToggle?.(false);
    }
  };

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: X.value }],
  }));

  const leftTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      X.value,
      [0, SEGMENT_WIDTH],
      ["#000", "#666"],
      "RGB",
    ),
  }));

  const rightTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      X.value,
      [0, SEGMENT_WIDTH],
      ["#666", "#000"],
    ),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.segmentedControl}>
        <Animated.View style={[styles.slider, sliderStyle]} />
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.button} onPress={() => handlePress(false)}>
            <Animated.Text style={[styles.buttonText, leftTextStyle]}>
              Hot
            </Animated.Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => handlePress(true)}>
            <Animated.Text style={[styles.buttonText, rightTextStyle]}>
              Iced
            </Animated.Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  segmentedControl: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    backgroundColor: "#F1F1F1",
    borderRadius: BUTTON_HEIGHT / 2,
    overflow: "hidden",
    position: "relative",
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "500",
  },
  slider: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    width: SEGMENT_WIDTH - 4,
    height: BUTTON_HEIGHT - 4,
    backgroundColor: "white",
    borderRadius: (BUTTON_HEIGHT - 4) / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default SwipeButton;
