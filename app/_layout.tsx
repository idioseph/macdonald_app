import "react-native-gesture-handler";
import "../globals.css";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Image } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "@/app/screens/OnboardingScreen";
import { RootStackParamList } from "@/interface/Layout";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@/app/screens/Main/HomeScreen";
import ItemScreen from "@/app/screens/Main/ItemScreen";
import { BlurView } from "expo-blur";
import { navigationRef } from "@/interface/Layout";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Cart from "@/components/Cart";
import OrdersScreen from "@/app/screens/Main/OrdersScreen";
import SavedScreen from "@/app/screens/Main/SavedScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("@/assets/fonts/Inter-VariableFont.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View className="inset-0 flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer ref={navigationRef}>
        <GestureHandlerRootView className="flex-1">
          {/* <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        > */}
          <StatusBar style="dark" />
          <Stack.Navigator>
            <Stack.Screen
              name="OnboardingScreen"
              options={{ headerShown: false }}
              component={OnboardingScreen}
            />
            <Stack.Screen
              name="MainScreen"
              options={{ headerShown: false }}
              component={MainScreen}
            />
            <Stack.Screen
              name="ItemScreen"
              options={{
                header(props) {
                  return (
                    <SafeAreaView className=" bg-white android:p-4">
                      <View className=" flex-row justify-between items-center py-4 px-4">
                        <TouchableOpacity
                          onPress={() => props.navigation.goBack()}
                        >
                          <Image
                            source={require("@/assets/icons/arrow-left.png")}
                            className="w-[36px] h-[36px]"
                          />
                        </TouchableOpacity>
                        <Cart />
                      </View>
                    </SafeAreaView>
                  );
                },
              }}
              component={ItemScreen}
            />
          </Stack.Navigator>
        </GestureHandlerRootView>
        {/* </ThemeProvider> */}
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const MainScreen = () => {
  const MenuItems = [
    {
      name: "Home",
      icon: require("@/assets/icons/home.png"),
      component: "Home",
    },
    {
      name: "Orders",
      icon: require("@/assets/icons/coffe.png"),
      component: "Orders",
    },
    {
      name: "Saved",
      icon: require("@/assets/icons/heart.png"),
      component: "Saved",
    },
    {
      name: "Update",
      icon: require("@/assets/icons/bell.png"),
      component: "Update",
    },
    {
      name: "Menu",
      icon: require("@/assets/icons/menu.png"),
      component: "Home",
    },
  ];
  return (
    <Tabs.Navigator
      initialRouteName="Home"
      tabBar={({ state, descriptors, navigation }) => (
        <View
          className="h-24 bg-transparent absolute bottom-0 left-0 right-0 w-screen z-50"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 40,
            elevation: 20,
          }}
        >
          <BlurView
            intensity={90}
            tint="extraLight"
            // experimentalBlurMethod="dimezisBlurView"
            className="flex-1 rounded-t-3xl overflow-hidden"
          >
            <View className="flex-row justify-around items-center h-full px-4">
              {MenuItems.map((item, index) => {
                const isFocused = state.routes[state.index]?.name === item.name;
                console.log(state.index);
                console.log(item.name);

                return (
                  <TouchableOpacity
                    key={`${item.name}-${index}`}
                    onPress={() => navigation.navigate(item.component)}
                    className={`p-2 items-center ${
                      isFocused
                        ? "opacity-100 border-t-2 border-[#FEB30A]"
                        : "opacity-60"
                    }`}
                  >
                    <Image
                      source={item.icon}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                    <Text
                      className={`text-xs mt-1 ${
                        isFocused ? "text-black" : "text-black/60"
                      }`}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </BlurView>
        </View>
      )}
    >
      <Tabs.Screen
        options={{
          header(props) {
            return (
              <SafeAreaView className=" bg-white android:p-4">
                <View className=" flex-row justify-between items-center py-4 px-4">
                  <Text className="text-[32px] font-semibold">Menu</Text>
                  <Cart />
                </View>
              </SafeAreaView>
            );
          },
        }}
        name="Home"
        component={HomeScreen}
      />
      <Tabs.Screen
        name="Orders"
        options={{
          header(props) {
            return (
              <SafeAreaView className=" bg-white android:p-4">
                <View className=" flex-row justify-between items-center py-4 px-4">
                  <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Image
                      source={require("@/assets/icons/arrow-left.png")}
                      className="w-[36px] h-[36px]"
                    />
                  </TouchableOpacity>
                  <Cart />
                </View>
              </SafeAreaView>
            );
          },
        }}
        component={OrdersScreen}
      />
      <Tabs.Screen
        name="Saved"
        options={{
          header(props) {
            return (
              <SafeAreaView className=" bg-white android:p-4">
                <View className=" flex-row justify-between items-center py-4 px-4">
                  <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Image
                      source={require("@/assets/icons/arrow-left.png")}
                      className="w-[36px] h-[36px]"
                    />
                  </TouchableOpacity>
                  <Cart />
                </View>
              </SafeAreaView>
            );
          },
        }}
        component={SavedScreen}
      />
    </Tabs.Navigator>
  );
};
