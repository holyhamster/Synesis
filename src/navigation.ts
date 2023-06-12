import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { OptionSectionsEnum } from "./screens/options/optionsScreen";

export type StackParamList = {
  Home: undefined;
  Options: { unravel?: OptionSectionsEnum };
  InputModal: {
    eventName: string;
    varName: string;
    varHint: string | undefined;
  };
};
export type HomeProps = NativeStackScreenProps<StackParamList, "Home">;
export type OptionsProps = NativeStackScreenProps<StackParamList, "Options">;
export type InputModalProps = NativeStackScreenProps<
  StackParamList,
  "InputModal"
>;

export function CreateStack() {
  return createNativeStackNavigator<StackParamList>();
}
