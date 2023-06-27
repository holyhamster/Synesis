import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { OptionSectionsEnum } from "./screens/options/optionsScreen";

export type StackParamList = {
  Synesis: undefined;
  Options: { unravel?: OptionSectionsEnum };
  InputModal: {
    eventName: string;
    varName: string;
    varHint: string | undefined;
    varLink: string | undefined;
  };
};
export type SynesisProps = NativeStackScreenProps<StackParamList, "Synesis">;
export type OptionsProps = NativeStackScreenProps<StackParamList, "Options">;
export type InputModalProps = NativeStackScreenProps<
  StackParamList,
  "InputModal"
>;

export function CreateStack() {
  return createNativeStackNavigator<StackParamList>();
}
