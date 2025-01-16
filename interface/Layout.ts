import {
  CompositeScreenProps,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  OnboardingScreen: undefined;
  MainScreen: any;
  ItemScreen: {
    item: {
      id: number;
      image: any;
      title: string;
      description: string;
      slug: string;
    };
  };
};

export type OnboardingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingScreen"
>;

export type MainScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MainScreen"
>;

export type ItemScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ItemScreen"
>;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<RouteName extends keyof RootStackParamList>(
  ...args: RouteName extends keyof RootStackParamList
    ? undefined extends RootStackParamList[RouteName]
      ? [RouteName] | [RouteName, RootStackParamList[RouteName]]
      : [RouteName, RootStackParamList[RouteName]]
    : never
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...args);
  }
}
