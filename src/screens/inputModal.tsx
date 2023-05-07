import React, { FC } from "react";
import {
  Button,
  DeviceEventEmitter,
  Text,
  TextInput,
  View,
} from "react-native";

import { InputModalProps } from "../navigation";

export interface InputModalEventParams {
  varName: string;
  varValue: string;
}

//Modal that asks for a string and launches an event after it has been submitted
const InputModal: FC<InputModalProps> = ({ navigation, route }) => {
  const { eventName, varName, varHint } = route.params;

  const submitValue = (value: string) => {
    const params: InputModalEventParams = { varName: varName, varValue: value };
    DeviceEventEmitter.emit(eventName, params);
    navigation.goBack();
  };

  const [inputText, setInputText] = React.useState("");
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 30 }}>Enter {varHint ?? "variable"}</Text>
      <TextInput
        autoFocus={true}
        blurOnSubmit={true}
        value={inputText}
        onChangeText={(text) => {
          setInputText(text);
        }}
        onSubmitEditing={({ nativeEvent }) => {
          const { text } = nativeEvent;
          if (text) submitValue(text);
        }}
      />
      <View style={{ flexDirection: "row" }}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="OK" onPress={() => submitValue(inputText)} />
      </View>
    </View>
  );
};

export default InputModal;
