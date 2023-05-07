import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

export type StackParamList = {
  Home: undefined;
  Options: undefined;
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
