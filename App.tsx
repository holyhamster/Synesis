import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from "react-native-toast-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";

import SynonymScreen from "./src/screens/synonyms/synonymScreen";
import OptionsScreen from "./src/screens/options/optionsScreen";
import InputModal from "./src/screens/inputModal";
import { CreateStack } from "./src/navigation";

const Stack = CreateStack();

//SynonymScreen component is the app's main screen
//Navigation is used to switch to options and any popups
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ToastProvider placement="center">
          <Stack.Navigator>
            <Stack.Screen
              name="Synesis"
              component={SynonymScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Options" component={OptionsScreen} />
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen name="InputModal" component={InputModal} />
            </Stack.Group>
          </Stack.Navigator>
        </ToastProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
