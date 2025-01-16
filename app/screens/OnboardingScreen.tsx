import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Button,
  TouchableOpacity,
} from "react-native";
import { useAssets } from "expo-asset";
import { OnboardingScreenProps } from "@/interface/Layout";

const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
  const [assets, error] = useAssets([require("../../assets/images/hero.png")]);
  return (
    <ImageBackground
      source={require("../../assets/images/hero.png")}
      className="flex-1 items-center justify-center"
    >
      <SafeAreaView className="flex-1 items-center justify-center">
        <View className="flex-1 items-center justify-end py-4 px-6">
          <View className="flex flex-col justify-end gap-2 bg-[#FEB30A]">
            <View className="flex flex-col justify-end gap-2">
              <Text className="text-4xl text-black">Enjoy your craving</Text>
              <Text className="text-2xl text-white">
                Every bit of it is worth the sip anyday..
              </Text>
            </View>
            <View className="flex flex-col items-center justify-end gap-2">
              <TouchableOpacity
                className="bg-white text-black py-6 rounded-2xl min-w-full "
                onPress={() => navigation.navigate("MainScreen")}
              >
                <Text className="text-center">Get Started or Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("MainScreen")}
                className="bg-transparent text-black py-6 rounded-2xl min-w-full"
              >
                <Text className="text-center">Continue as Guest</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default OnboardingScreen;
