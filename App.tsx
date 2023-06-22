import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import SynonymScreen from "./src/screens/synonyms/synonymScreen";
import OptionsScreen from "./src/screens/options/optionsScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import InputModal from "./src/screens/inputModal";
import { CreateStack } from "./src/navigation";
import { ToastProvider } from "react-native-toast-notifications";

const Stack = CreateStack();

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider placement="center">
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
      </ToastProvider>
    </SafeAreaProvider>
  );
}
