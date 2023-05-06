import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import SynonymScreen from "./src/screens/synonymScreen";
import OptionsScreen from "./src/screens/optionsScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import InputModal from "./src/screens/inputModal";

export type StackParamList = {
  Home: undefined;
  Options: undefined;
  InputModal: {
    eventName: string;
    varName: string;
    varHint: string | undefined;
  };
};
export type OptionsProps = NativeStackScreenProps<StackParamList, "Options">;
export type InputModalProps = NativeStackScreenProps<
  StackParamList,
  "InputModal"
>;

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={SynonymScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Options" component={OptionsScreen} />
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="InputModal" component={InputModal} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
